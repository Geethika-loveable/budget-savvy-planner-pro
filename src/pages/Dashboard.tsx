
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, DollarSign, ArrowLeft, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const events = JSON.parse(localStorage.getItem('events') || '[]');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const totalBudgets = events.length;
  const planningBudgets = events.filter((e: any) => e.status === 'Planning').length;
  const completedBudgets = events.filter((e: any) => e.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-purple-300 hover:text-purple-200">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Budgets</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="bg-slate-800/50 border-purple-500/20 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <User className="h-5 w-5 text-blue-400" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">{user.name || 'User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{user.email || 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white font-medium">Recently Joined</p>
              </div>
            </CardContent>
          </Card>

          {/* Budget Stats */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Calendar className="h-5 w-5 text-green-400" />
                <span>Budget Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Budgets</span>
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  {totalBudgets}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Planning</span>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                  {planningBudgets}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Completed</span>
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  {completedBudgets}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <DollarSign className="h-5 w-5 text-purple-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  View All Budgets
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
                Download Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {events.length > 0 && (
          <Card className="mt-6 bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Budgets</CardTitle>
              <CardDescription className="text-gray-300">Your latest budget activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(-3).map((event: any) => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-sm text-gray-400">{event.type} • {event.status}</p>
                    </div>
                    <Badge variant={event.status === 'Planning' ? 'outline' : 'secondary'} 
                           className={event.status === 'Planning' ? 'border-purple-500/30 text-purple-300' : 'bg-green-600/20 text-green-300 border-green-500/30'}>
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
