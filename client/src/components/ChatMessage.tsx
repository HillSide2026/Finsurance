import { cn } from "@/lib/utils";
import { type Message } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Bot, User as UserIcon } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
        isUser ? "bg-primary text-primary-foreground" : "bg-white border border-border text-primary"
      )}>
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className={cn(
        "flex flex-col max-w-[80%] lg:max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed prose prose-sm max-w-none break-words",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-white border border-border text-foreground rounded-tl-sm prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
        )}>
          {/* If it's a user message, just text. If bot, render markdown. */}
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        
        <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-70">
          {message.createdAt && format(new Date(message.createdAt), "h:mm a")}
        </span>
      </div>
    </motion.div>
  );
}
