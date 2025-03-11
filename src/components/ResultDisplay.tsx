
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, ClipboardCopy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResultDisplayProps {
  visible: boolean;
  vectorData: any | null;
  summary: string;
  className?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  visible, 
  vectorData, 
  summary,
  className 
}) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    });
  };
  
  if (!visible) return null;
  
  const vectorString = vectorData ? JSON.stringify(vectorData, null, 2) : '';
  
  return (
    <div 
      className={cn(
        "mt-8 glass-card rounded-xl overflow-hidden transition-all",
        "transform duration-500 ease-in-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium">Results</h3>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="space-y-4">
          {summary && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => copyToClipboard(summary, "Summary")}
                >
                  <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Copy</span>
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                {summary}
              </div>
            </div>
          )}
          
          {vectorData && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Vector Representation</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => copyToClipboard(vectorString, "Vector data")}
                >
                  <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Copy</span>
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-60">
                <pre className="text-xs whitespace-pre-wrap">{vectorString}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
