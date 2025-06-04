
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RainbowButton } from '@/components/ui/rainbow-button';
import EventForm from '@/components/EventForm';
import { BudgetVoiceInput } from '@/components/BudgetVoiceInput';
import { Calendar, MapPin, DollarSign, Download, Trash2, User } from 'lucide-react';
import { currencies, getCurrencySymbol } from '@/utils/currencies';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Event {
  id: string;
  title: string;
  type: 'Trip' | 'Event';
  totalPlanned: number;
  currency: string;
  status: 'Planning' | 'Completed';
  days: number;
  items: Array<{
    name: string;
    category: string;
    planned: number;
    notes: string;
  }>;
  createdAt: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const { toast } = useToast();

  // Load events from localStorage on component mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    const userCurrency = localStorage.getItem('userCurrency') || 'USD';
    setDefaultCurrency(userCurrency);
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString()
    };
    
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    setShowForm(false);
    
    toast({
      title: "Budget Created",
      description: "Your budget has been created successfully!"
    });
  };
  const handleVoiceBudgetExtracted = (budget: {
    title?: string;
    type?: 'Trip' | 'Event';
    items?: Array<{
      name: string;
      category: string;
      planned: number;
      notes?: string;
    }>;
  }) => {
    // Create a new event/budget from voice input
    const newEvent: Event = {
      id: Date.now().toString(),
      title: budget.title || 'Voice Budget',
      type: budget.type || 'Event',
      totalPlanned: budget.items?.reduce((sum, item) => sum + item.planned, 0) || 0,
      currency: 'USD', // Default currency
      status: 'Planning',
      createdAt: new Date().toISOString(),
      days: 1, // Default days
      items: budget.items?.map(item => ({
        ...item,
        notes: item.notes || ''
      })) || []
    };

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Voice Budget Created",
      description: `Budget "${newEvent.title}" created with ${budget.items?.length || 0} items`,
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
    
    toast({
      title: "Budget Deleted",
      description: "The budget has been removed successfully.",
    });
  };

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.zIndex = '1000';
      confetti.style.pointerEvents = 'none';
      confetti.style.borderRadius = '50%';
      confetti.style.animation = 'confetti 3s linear forwards';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);
    }
  };

  const downloadPDF = (event: Event) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to download your budget PDF.",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const currencySymbol = getCurrencySymbol(event.currency);
      
      // Header
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SMARTBUDGET REPORT', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Your Complete Budget Analysis', 105, 30, { align: 'center' });
      
      // Budget Info Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Budget Information', 20, 60);
      
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.5);
      doc.line(20, 65, 190, 65);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const infoStartY = 75;
      doc.text(`Budget: ${event.title}`, 20, infoStartY);
      doc.text(`Type: ${event.type}`, 20, infoStartY + 8);
      doc.text(`Status: ${event.status}`, 20, infoStartY + 16);
      doc.text(`Duration: ${event.days} day${event.days > 1 ? 's' : ''}`, 20, infoStartY + 24);
      doc.text(`Currency: ${event.currency}`, 20, infoStartY + 32);
      doc.text(`Total ${event.status === 'Completed' ? 'Expenses' : 'Planned'}: ${currencySymbol}${event.totalPlanned.toLocaleString()}`, 20, infoStartY + 40);
      doc.text(`Created: ${event.createdAt}`, 20, infoStartY + 48);
      
      // Items Section
      const itemsStartY = 140;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Budget Items', 20, itemsStartY);
      doc.line(20, itemsStartY + 5, 190, itemsStartY + 5);
      
      let currentY = itemsStartY + 20;
      
      event.items.forEach((item, index) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 30;
        }
        
        // Item box
        doc.setFillColor(248, 250, 252);
        doc.rect(20, currentY - 8, 170, 25, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(20, currentY - 8, 170, 25);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(item.name, 25, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(`Category: ${item.category}`, 25, currentY + 8);
        doc.text(`${event.status === 'Completed' ? 'Expense' : 'Planned'}: ${currencySymbol}${item.planned.toLocaleString()}`, 25, currentY + 14);
        
        if (item.notes) {
          doc.text(`Notes: ${item.notes}`, 120, currentY + 8);
        }
        
        currentY += 35;
      });
      
      // Summary Section
      if (currentY > 220) {
        doc.addPage();
        currentY = 30;
      }
      
      currentY += 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Budget Summary', 20, currentY);
      doc.line(20, currentY + 5, 190, currentY + 5);
      
      currentY += 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total ${event.status === 'Completed' ? 'Expenses' : 'Planned'}: ${currencySymbol}${event.totalPlanned.toLocaleString()}`, 20, currentY);
      doc.text(`Number of Items: ${event.items.length}`, 20, currentY + 10);
      doc.text(`Average per Day: ${currencySymbol}${(event.totalPlanned / event.days).toLocaleString()}`, 20, currentY + 20);
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 280, 210, 17, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Generated by SmartBudget', 20, 290);
        doc.text(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`, 20, 295);
        doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
      }
      
      // Save the PDF
      doc.save(`${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-budget.pdf`);
      
      // Show confetti
      createConfetti();
      
      toast({
        title: "Download Complete",
        description: `Your budget "${event.title}" has been downloaded successfully!`,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SmartBudget
          </h1>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <span className="text-purple-300">Welcome, {user.name || user.email}</span>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl mb-2 font-extrabold text-rose-500">Your Events & Trips</h2>
            <p className="text-gray-300 text-sm sm:text-base">Plan and track budgets for your upcoming and past events</p>
          </div>
          <Button onClick={() => setShowEventForm(true)} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            New Budget
          </Button>
        </div>

        {/* Planning Events */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl text-white mb-4 font-bold">Planning Events</h3>
          {planningEvents.length === 0 ? (            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 mx-auto mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">No Events Yet</h4>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  Create your first event or trip budget to get started with planning!
                </p>
                
                {/* Voice Input Section */}
                <div className="mb-6">
                  <div className="text-sm text-gray-300 mb-3">🎤 Create budget with voice:</div>
                  <BudgetVoiceInput onBudgetExtracted={handleVoiceBudgetExtracted} />
                </div>
                
                {/* Divider */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="px-3 text-gray-400 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>
                
                <RainbowButton onClick={() => setShowEventForm(true)}>
                  Create Your First Budget
                </RainbowButton>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {planningEvents.map(event => (
                <EventCard key={event.id} event={event} onDownload={handleDownload} onDelete={deleteEvent} />
              ))}
            </div>
          )}
        </div>

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Past Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {completedEvents.map(event => (
                <EventCard key={event.id} event={event} onDownload={handleDownload} onDelete={deleteEvent} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showEventForm && (
        <EventForm
          onAddEvent={addEvent}
          onClose={() => setShowEventForm(false)}
          defaultCurrency={selectedCurrency}
        />
      )}

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-slate-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-400" />
                <span>Past Budgets</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your budget history and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="bg-slate-700/30 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white mb-2">{event.title}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                              {event.type}
                            </Badge>
                            <Badge 
                              variant={event.status === 'Planning' ? 'outline' : 'secondary'}
                              className={event.status === 'Planning' 
                                ? 'border-yellow-500/30 text-yellow-300' 
                                : 'bg-green-600/20 text-green-300 border-green-500/30'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-600/20 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{event.days} day{event.days > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span>{event.items.length}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total {event.status === 'Completed' ? 'Expenses' : 'Planned'}:</span>
                          <span className="text-green-400">
                            {getCurrencySymbol(event.currency)}{event.totalPlanned.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{event.createdAt}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => downloadPDF(event)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {events.length === 0 && (
          <Card className="bg-slate-800/50 border-purple-500/20 text-center">
            <CardContent className="py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No budgets created yet</p>
                <p className="text-sm">Create your first budget to get started!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showForm && (
        <EventForm
          onAddEvent={addEvent}
          onClose={() => setShowForm(false)}
          defaultCurrency={defaultCurrency}
        />
      )}
    </div>
  );
};

export default Events;
