import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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

interface VoiceInputProps {
  onExpenseExtracted: (expense: {
    amount?: number;
    category?: string;
    description?: string;
    date?: string;
  }) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onExpenseExtracted }) => {
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
      const result = await geminiService.parseExpenseFromText(transcript);
      
      if (result.success && result.data) {
        onExpenseExtracted(result.data);
        toast({
          title: "Voice Input Processed",
          description: `Extracted: ${result.data.description}${result.data.amount ? ` - $${result.data.amount}` : ''}`,
        });
      } else {
        toast({
          title: "Processing Failed",
          description: result.error || "Could not parse expense information",
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
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">Voice recognition is not supported in this browser</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Start Voice Input'}
                  </>
                )}
              </Button>
              
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Voice Recognition Settings</DialogTitle>
                    <DialogDescription>
                      Configure your Gemini AI API key for voice-to-expense conversion
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Gemini API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Get your API key from{' '}
                        <a 
                          href="https://makersuite.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Google AI Studio
                        </a>
                      </p>
                    </div>
                    <Button onClick={handleSaveApiKey} className="w-full">
                      Save API Key
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {(isListening || isProcessing) && (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {isListening ? 'Listening...' : 'Processing...'}
                </span>
              </div>
            )}
          </div>
          
          {transcript && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Transcript:</p>
              <p className="text-sm font-medium">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
