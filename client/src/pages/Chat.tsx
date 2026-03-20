import { type FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  useChat,
  useSendMessage,
  useCreateChat,
  useUpdateChatIntake,
} from "@/hooks/use-chats";
import { useGenerateNda, useNdaForChat } from "@/hooks/use-ndas";
import { Sidebar } from "@/components/Sidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { NdaPreview } from "@/components/NdaPreview";
import { IntakePanel } from "@/components/IntakePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Menu, Loader2, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Nda, NdaIntakePatch } from "@shared/schema";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const parsedChatId = id === "new" ? null : Number(id);
  const chatId =
    parsedChatId !== null && Number.isInteger(parsedChatId) && parsedChatId > 0
      ? parsedChatId
      : null;
  const shouldLoadChat = Boolean(user) && !isAuthLoading && chatId !== null;
  const { data: chatData, isLoading: isChatLoading } = useChat(
    chatId ?? 0,
    shouldLoadChat,
  );
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: createChat, isPending: isCreating } = useCreateChat();
  const { mutate: updateChatIntake, isPending: isSavingIntake } =
    useUpdateChatIntake();
  const { mutate: generateNda, isPending: isGenerating } = useGenerateNda();
  const { data: existingNda } = useNdaForChat(chatId ?? 0, shouldLoadChat);
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNdaPreview, setShowNdaPreview] = useState(false);
  const [generatedNda, setGeneratedNda] = useState<Nda | null>(null);
  const [newChatError, setNewChatError] = useState(false);
  const hasRequestedNewChat = useRef(false);

  // If "new" is passed as ID, create a chat immediately
  useEffect(() => {
    if (
      id === "new" &&
      !isAuthLoading &&
      user &&
      !isCreating &&
      !newChatError &&
      !hasRequestedNewChat.current
    ) {
      hasRequestedNewChat.current = true;
      createChat(undefined, {
        onSuccess: (newChat) => setLocation(`/chat/${newChat.id}`),
        onError: (error) => {
          setNewChatError(true);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to create a new consultation. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  }, [id, isAuthLoading, user, createChat, isCreating, newChatError, setLocation, toast]);

  useEffect(() => {
    setGeneratedNda(null);
    setShowNdaPreview(false);
  }, [chatId]);

  useEffect(() => {
    if (id !== "new") {
      setNewChatError(false);
      hasRequestedNewChat.current = false;
    }
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData?.messages]);

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatId || isSending) return;

    sendMessage({ chatId, content: input }, {
      onSuccess: () => setInput(""),
      onError: (error) => {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const previewNda = generatedNda ?? existingNda ?? null;

  const handleSaveIntake = (intake: NdaIntakePatch) => {
    if (!chatId) return;

    updateChatIntake(
      { chatId, intake },
      {
        onSuccess: () => {
          toast({
            title: "Intake updated",
            description: "Your consultation details have been saved.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to update consultation details.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleGenerateClick = () => {
    if (!chatId) return;
    
    generateNda({ chatId }, {
      onSuccess: (nda) => {
        setGeneratedNda(nda);
        setShowNdaPreview(true);
        toast({
          title: "NDA Generated",
          description: "Your document is ready for review.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to generate the NDA. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (isAuthLoading || (id === "new" && !newChatError)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  if (id !== "new" && chatId === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-primary">Invalid consultation link</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This consultation address is not valid. Start a new consultation to continue.
          </p>
          <Button className="mt-6" onClick={() => setLocation("/chat/new")}>
            Start New Consultation
          </Button>
        </div>
      </div>
    );
  }

  if (id === "new" && newChatError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-primary">Could not start a consultation</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The app could not create a fresh consultation right now. You can try again immediately.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              hasRequestedNewChat.current = false;
              setNewChatError(false);
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (chatId && !isChatLoading && chatData === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-primary">Consultation not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This consultation either does not exist or is not available to your account.
          </p>
          <Button className="mt-6" onClick={() => setLocation("/chat/new")}>
            Start New Consultation
          </Button>
        </div>
      </div>
    );
  }

  const renderIntakePanel = () => {
    if (!chatData) {
      return null;
    }

    return (
      <IntakePanel
        intake={chatData.chat.ndaIntake}
        readiness={chatData.readiness}
        isSaving={isSavingIntake}
        isGenerating={isGenerating}
        hasDraft={Boolean(previewNda)}
        onSave={handleSaveIntake}
        onGenerate={handleGenerateClick}
        onOpenDraft={() => setShowNdaPreview(true)}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 h-full">
        <Sidebar className="h-full" />
      </div>

      <div className="flex-1 flex min-w-0">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative min-w-0">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border shadow-sm z-10">
            <div className="flex items-center gap-2 font-display font-bold text-primary">
              <Briefcase className="w-5 h-5" />
              NDA Esq.
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </header>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 scroll-smooth">
            <div className="max-w-3xl mx-auto flex flex-col min-h-full">
              {chatData && (
                <div className="xl:hidden mb-6">
                  {renderIntakePanel()}
                </div>
              )}

              {isChatLoading ? (
                <div className="space-y-4 mt-8">
                  <Skeleton className="h-12 w-3/4 rounded-r-xl rounded-bl-xl" />
                  <Skeleton className="h-24 w-2/3 ml-auto rounded-l-xl rounded-br-xl" />
                  <Skeleton className="h-16 w-1/2 rounded-r-xl rounded-bl-xl" />
                </div>
              ) : chatData?.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary mb-6">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Welcome, {user.firstName || "Counsel"}</h2>
                  <p className="text-muted-foreground max-w-md">
                    I'm NDA Esq. I can help you complete the intake and prepare a Canadian NDA draft for your business needs.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                    {[
                      "Hiring a new employee",
                      "Sharing business ideas",
                      "Contractor agreement",
                      "Merger discussions"
                    ].map((label) => (
                      <button
                        key={label}
                        onClick={() => setInput(`I need an NDA for ${label.toLowerCase()}`)}
                        className="px-4 py-3 bg-white border border-border/60 rounded-xl text-sm text-left hover:border-primary/40 hover:shadow-md transition-all"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {chatData?.messages.map((msg, i) => (
                    <ChatMessage 
                      key={msg.id} 
                      message={msg} 
                      isLast={i === chatData.messages.length - 1} 
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-border/50">
            <form 
              onSubmit={handleSend}
              className="max-w-3xl mx-auto relative flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your situation or answer the next intake question..."
                className="pr-12 py-6 text-base shadow-inner bg-gray-50 border-gray-200 focus-visible:ring-primary/20 rounded-xl"
                disabled={isSending}
                autoFocus
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isSending}
                className={cn(
                  "absolute right-2 w-8 h-8 rounded-lg transition-all duration-200",
                  input.trim() ? "bg-primary shadow-lg shadow-primary/25 scale-100" : "bg-muted text-muted-foreground scale-90 opacity-50"
                )}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
            <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60">
              AI can make mistakes. Verify important legal information before signing.
            </p>
          </div>
        </div>

        {chatData && (
          <aside className="hidden xl:block w-[380px] border-l border-border/60 bg-white overflow-y-auto p-6">
            {renderIntakePanel()}
          </aside>
        )}
      </div>

      <NdaPreview 
        isOpen={showNdaPreview} 
        onClose={() => setShowNdaPreview(false)}
        nda={previewNda}
      />
    </div>
  );
}

// Icon helper for header
function Briefcase({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
