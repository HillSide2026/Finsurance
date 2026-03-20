import { Link, useLocation } from "wouter";
import { useChats, useCreateChat } from "@/hooks/use-chats";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, LogOut, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function getStatusLabel(status: string) {
  if (status === "draft_generated") {
    return "Draft";
  }

  if (status === "ready_for_generation") {
    return "Ready";
  }

  return "Intake";
}

export function Sidebar({ className }: { className?: string }) {
  const [location, setLocation] = useLocation();
  const { data: chats } = useChats();
  const { mutate: createChat, isPending: isCreating } = useCreateChat();
  const { logout } = useAuth();

  const handleNewChat = () => {
    createChat(undefined, {
      onSuccess: (newChat) => setLocation(`/chat/${newChat.id}`),
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-border/50 shadow-xl shadow-black/5 z-20", className)}>
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-3 mb-8 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">NDA Esq.</h1>
              <p className="text-xs text-muted-foreground mt-1">Legal AI Assistant</p>
            </div>
          </div>
        </Link>

        <Button 
          onClick={handleNewChat} 
          disabled={isCreating}
          className="w-full justify-start gap-2 shadow-md hover:shadow-lg transition-all" 
          size="lg"
        >
          <Plus className="w-5 h-5" />
          {isCreating ? "Creating..." : "New Consultation"}
        </Button>
      </div>

      <div className="px-6 pb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Consultations</h3>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-4">
          {chats?.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <button
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden",
                  location === `/chat/${chat.id}`
                    ? "bg-secondary text-secondary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={cn(
                    "w-4 h-4 transition-colors",
                    location === `/chat/${chat.id}` ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary"
                  )} />
                  <span className="truncate flex-1">{chat.title || "Untitled Consultation"}</span>
                  <Badge variant="outline" className="border-border/80 text-[10px] uppercase tracking-wide">
                    {getStatusLabel(chat.status)}
                  </Badge>
                </div>
                {chat.createdAt && (
                  <span className="text-[10px] text-muted-foreground/50 mt-1 pl-7 block">
                    {format(new Date(chat.createdAt), "MMM d, yyyy")}
                  </span>
                )}
              </button>
            </Link>
          ))}
          {chats?.length === 0 && (
            <div className="text-center py-8 px-4 text-muted-foreground text-sm">
              <p>No prior consultations found.</p>
              <p className="mt-1 text-xs opacity-70">Start a new chat to generate your first NDA.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-gray-50/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
