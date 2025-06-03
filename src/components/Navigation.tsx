
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const { toast } = useToast();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('budgetData');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            SmartBudget
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">
              Events & Trips
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reports
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user.name || 'User'}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
