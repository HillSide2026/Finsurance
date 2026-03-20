import { Button } from "@/components/ui/button";
import { Briefcase, ShieldCheck, Scale, FileText, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/chat/new");
    }
  }, [user, isLoading, setLocation]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display text-primary tracking-tight">NDA Esq.</span>
        </div>
        <Button onClick={handleLogin} variant="outline" className="font-semibold border-primary/20 text-primary hover:bg-primary/5">
          Sign In
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Trusted by Canadian Businesses</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-6 leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700">
          Professional NDAs,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            Drafted in Minutes.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Your AI-powered legal assistant for creating tailored Non-Disclosure Agreements. 
          Specific to Canadian law, customized for your needs.
        </p>
        
        <Button 
          size="lg" 
          onClick={handleLogin}
          className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 animate-in fade-in zoom-in duration-1000 delay-200"
        >
          Start Free Consultation
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full">
          {[
            {
              icon: FileText,
              title: "Tailored Drafting",
              desc: "Answer a few simple questions and let our AI draft a comprehensive agreement suited to your specific situation."
            },
            {
              icon: Scale,
              title: "Canadian Compliance",
              desc: "Designed with Canadian provincial laws in mind to ensure your agreements are enforceable and valid."
            },
            {
              icon: ShieldCheck,
              title: "Legal Escalation",
              desc: "Need an extra layer of protection? Seamlessly escalate your generated NDA to Levine Law for review."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-border/50 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© {new Date().getFullYear()} NDA Esq. Powered by Levine Law Enterprise Services.</p>
      </footer>
    </div>
  );
}
