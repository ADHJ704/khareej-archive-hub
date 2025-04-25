
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, department } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      console.error('OpenAI API key is not configured');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured', 
        details: 'API key not found in environment variables' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate department
    if (!department) {
      return new Response(JSON.stringify({ 
        error: 'يجب تحديد التخصص', 
        details: 'Department is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Making request to OpenAI with department:', department);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد ذكي لاقتراح مشاريع تخرج للطلاب. 
            قدم اقتراح مشروع إبداعي ومبتكر في تخصص ${department}. 
            يجب أن يكون الاقتراح:
            - واقعي وقابل للتنفيذ
            - مبتكر ويحل مشكلة حقيقية
            - مناسب للمستوى الجامعي
            
            قم بتقديم:
            - عنوان المشروع
            - وصف موجز
            - التقنيات المستخدمة
            - الهدف الرئيسي`
          },
          { role: 'user', content: message || 'اقترح لي مشروع تخرج مميز' }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    // Check if response is successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', JSON.stringify(errorData));
      
      // Extract more specific error information
      const errorMessage = errorData.error?.message || 'OpenAI API error';
      const errorType = errorData.error?.type || 'unknown';
      const errorCode = errorData.error?.code || 'unknown';
      
      return new Response(JSON.stringify({ 
        error: 'خطأ في خدمة الذكاء الاصطناعي', 
        details: errorMessage,
        type: errorType,
        code: errorCode
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    // Check if the expected data structure exists
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response structure:', JSON.stringify(data));
      return new Response(JSON.stringify({ 
        error: 'Invalid response from OpenAI API',
        details: 'The API response did not contain the expected data structure' 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const suggestion = data.choices[0].message.content;

    try {
      // Initialize Supabase client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // Save the suggestion to the database
      const { error } = await supabase
        .from('project_suggestions')
        .insert({
          user_id: req.headers.get('user-id'),
          message: message || 'اقتراح عام',
          response: suggestion,
          department: department
        });

      if (error) console.error('Error saving suggestion:', error);
    } catch (dbError) {
      // Log the error but don't fail the request if database saving fails
      console.error('Error saving to database:', dbError);
    }

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in project suggestion:', error);
    return new Response(JSON.stringify({ 
      error: 'حدث خطأ أثناء معالجة الطلب',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
