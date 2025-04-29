
import React from 'react';
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp?: Date;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={cn(
      "p-4 rounded-lg mb-4 max-w-[80%]",
      isUser 
        ? "bg-primary text-white self-end" 
        : "bg-muted self-start"
    )}>
      <p className="whitespace-pre-wrap">{message}</p>
      {timestamp && (
        <p className={cn(
          "text-xs mt-2",
          isUser ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {timestamp.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ChatMessage;
