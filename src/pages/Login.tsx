
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
        
        // Check if there's a pending download
        const pendingDownload = localStorage.getItem('pendingDownload');
        if (pendingDownload) {
          const event = JSON.parse(pendingDownload);
          localStorage.removeItem('pendingDownload');
          
          // Trigger download and show confetti
          setTimeout(() => {
            // Simulate PDF download
            const link = document.createElement('a');
            link.href = 'data:application/pdf;base64,'; // This would be actual PDF data
            link.download = `${event.title}-budget.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show confetti
            showConfetti();
          }, 500);
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back to SmartBudget!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const showConfetti = () => {
    // Simple confetti effect using CSS animation
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎊'.repeat(20);
    confetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      animation: confetti 3s ease-out;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => document.body.removeChild(confetti), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SmartBudget</CardTitle>
          <CardDescription className="text-gray-300">Sign in to access your budget dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
