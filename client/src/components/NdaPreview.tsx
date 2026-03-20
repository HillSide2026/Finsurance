import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, Scale, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Nda } from "@shared/schema";

interface NdaPreviewProps {
  nda: Nda | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NdaPreview({ nda, isOpen, onClose }: NdaPreviewProps) {
  if (!nda) return null;

  const disclaimer =
    "Automatically generated document. This is not legal advice. Consider having a lawyer review before signing.";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([`${disclaimer}\n\n${nda.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Consultation_NDA.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 bg-white sm:rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-start justify-between bg-gray-50/50">
            <div>
              <DialogTitle className="text-2xl font-display text-primary flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                NDA Generated Successfully
              </DialogTitle>
              <DialogDescription className="mt-1">
                Your custom Non-Disclosure Agreement is ready for review.
              </DialogDescription>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Preview Panel */}
            <ScrollArea className="flex-1 p-8 bg-white print-content">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  {disclaimer}
                </div>
                <div className="font-serif text-sm leading-7 text-justify whitespace-pre-wrap">
                  {nda.content}
                </div>
              </div>
            </ScrollArea>

            {/* Sidebar Actions */}
            <div className="w-64 border-l border-border bg-gray-50 p-6 flex flex-col gap-6">
              <div>
                <h4 className="font-semibold text-sm mb-3 text-primary">Actions</h4>
                <div className="space-y-3">
                  <Button onClick={handlePrint} variant="outline" className="w-full justify-start gap-2 bg-white">
                    <Printer className="w-4 h-4" />
                    Print / Save as PDF
                  </Button>
                  <Button onClick={handleDownloadText} variant="outline" className="w-full justify-start gap-2 bg-white">
                    <Download className="w-4 h-4" />
                    Download Text
                  </Button>
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Legal Review
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Need professional assurance? Escalate this draft to Levine Law for attorney review.
                  </p>
                  <Button className="w-full text-xs" size="sm">
                    Escalate to Levine Law
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border bg-white sm:justify-between items-center">
            <p className="text-xs text-muted-foreground italic">
              *Disclaimer: This generated document is for informational purposes and does not constitute legal advice.
            </p>
            <Button onClick={onClose}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden container for printing */}
      <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:z-[9999] print:p-12 whitespace-pre-wrap font-serif">
        <p className="mb-8 border border-amber-200 bg-amber-50 p-4 font-sans text-sm text-amber-900">
          {disclaimer}
        </p>
        {nda.content}
      </div>
    </>
  );
}
