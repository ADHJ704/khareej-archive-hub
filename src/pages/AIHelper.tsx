
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import { supabase } from '@/integrations/supabase/client';

// Define form schema
const formSchema = z.object({
  message: z.string().min(1, { message: "يجب إدخال رسالة" }),
});

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const AIHelper = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    content: "مرحباً! أنا المساعد الذكي للمشاريع. كيف يمكنني مساعدتك اليوم؟",
    isUser: false,
    timestamp: new Date(),
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage = values.message.trim();
    
    // Add user message to chat
    const userMessageObj = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    
    // Clear the input
    form.reset();
    
    // Call OpenAI
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { message: userMessage },
      });

      if (error) throw error;
      
      if (data.error) {
        toast({
          variant: "destructive",
          title: "حدث خطأ",
          description: data.error || "حدث خطأ أثناء الاتصال بالمساعد الذكي",
        });
        return;
      }

      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.reply,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء الاتصال بالمساعد الذكي",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">المساعد الذكي</h1>
          <p className="text-muted-foreground">استفسر عن أي شيء متعلق بمشاريع التخرج</p>
        </div>
        
        <div className="flex-grow border rounded-lg p-4 flex flex-col overflow-hidden mb-4 bg-card">
          <div className="flex-grow overflow-y-auto flex flex-col">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="self-start max-w-[80%] mb-4">
                <Skeleton className="h-12 w-64 rounded-lg mb-1" />
                <Skeleton className="h-6 w-32 rounded-lg" />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
          
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="اكتب رسالتك هنا..."
                      {...field}
                      disabled={isLoading}
                      className="text-base md:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">إرسال</span>
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default AIHelper;
