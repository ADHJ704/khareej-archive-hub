
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
            قدم اقتراح مشروع إبداعي ومبتكر في تخصص ${department || 'علوم الحاسب'}. 
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
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

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
        response: suggestion
      });

    if (error) console.error('Error saving suggestion:', error);

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in project suggestion:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
