
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Settings } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { geminiService } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BudgetVoiceInputProps {
  onBudgetExtracted: (budget: {
    title?: string;
    type?: 'Trip' | 'Event';
    items?: Array<{
      name: string;
      category: string;
      planned: number;
      notes?: string;
    }>;
  }) => void;
}

export const BudgetVoiceInput: React.FC<BudgetVoiceInputProps> = ({ onBudgetExtracted }) => {
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initialize API key from localStorage on component mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      geminiService.initialize(savedApiKey);
    }
  }, []);

  const handleVoiceResult = async (transcript: string) => {
    if (!geminiService.isInitialized()) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in settings",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await geminiService.parseBudgetFromText(transcript);
      
      if (result.success && result.data) {
        onBudgetExtracted(result.data);
        toast({
          title: "Voice Input Processed",
          description: `Extracted budget information for: ${result.data.title || 'New Budget'}`,
        });
      } else {
        toast({
          title: "Processing Failed",
          description: result.error || "Could not parse budget information",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process voice input",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceError = (error: string) => {
    toast({
      title: "Voice Recognition Error",
      description: error,
      variant: "destructive",
    });
  };

  const { isListening, isSupported, startListening, stopListening, transcript } = useVoiceRecognition({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      const success = geminiService.initialize(apiKey.trim());
      
      if (success) {
        toast({
          title: "API Key Saved",
          description: "Gemini AI is now ready to use",
        });
        setShowSettings(false);
      } else {
        toast({
          title: "Invalid API Key",
          description: "Please check your API key",
          variant: "destructive",
        });
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <MovingBorderButton
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        borderRadius="1.75rem"
        className="bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased"
        containerClassName={`${
          isListening 
            ? 'bg-red-500/20' 
            : 'bg-green-600/20'
        } h-12 w-auto px-4`}
        borderClassName={`h-20 w-20 opacity-[0.8] ${
          isListening 
            ? 'bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]'
            : 'bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]'
        }`}
        duration={2000}
      >
        <div className="flex items-center space-x-2">
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>{isProcessing ? 'Processing...' : 'Voice Budget'}</span>
            </>
          )}
        </div>
      </MovingBorderButton>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Voice Recognition Settings</DialogTitle>
            <DialogDescription className="text-gray-300">
              Configure your Gemini AI API key for voice-to-budget conversion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-gray-300">Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-700 border-purple-500/30 text-white"
              />
              <p className="text-sm text-gray-400">
                Get your API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            <Button onClick={handleSaveApiKey} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {(isListening || isProcessing || transcript) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-slate-800 border-purple-500/30 max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                {isListening && <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></div>}
                <span className="text-sm text-gray-300">
                  {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Voice Input'}
                </span>
              </div>
              {transcript && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Transcript:</p>
                  <p className="text-sm text-white">{transcript}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
