import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  createdAt: string;
  days: number;
  items: Array<{
    name: string;
    category: string;
    planned: number;
    notes: string;
  }>;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingDownloadEvent, setPendingDownloadEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false);
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
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Budget Deleted",
      description: "Budget has been removed successfully."
    });
  };

  const showConfetti = () => {
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎊'.repeat(30);
    confetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      font-size: 2rem;
      animation: confetti 4s ease-out;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => document.body.removeChild(confetti), 4000);
  };

  const handleDownload = (event: Event) => {
    const user = localStorage.getItem('user');
    if (!user) {
      setPendingDownloadEvent(event);
      localStorage.setItem('pendingDownload', JSON.stringify(event));
      setShowLoginPrompt(true);
      return;
    }

    downloadPDF(event);
    showConfetti();
  };

  const generateBeautifulPDF = (event: Event) => {
    const doc = new jsPDF();
    const currencySymbol = getCurrencySymbol(event.currency);
    const columnTitle = event.status === 'Completed' ? 'Expense' : 'Planned';

    // Page setup
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Colors
    const primaryColor = [99, 102, 241]; // Indigo
    const secondaryColor = [139, 92, 246]; // Purple
    const textColor = [55, 65, 81]; // Gray-700
    const lightGray = [229, 231, 235]; // Gray-200
    const successColor = [34, 197, 94]; // Green
    const warningColor = [245, 158, 11]; // Amber

    // Header background with gradient effect simulation
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Add a subtle accent line
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 55, pageWidth, 5, 'F');

    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SmartBudget', margin, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Budget Report', margin, 45);

    // Date generated
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 80, 30);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, pageWidth - margin - 80, 42);
    yPosition = 80;

    // Event Title Section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(event.title, margin, yPosition);
    const titleWidth = doc.getTextWidth(event.title);
    doc.setLineWidth(2);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.line(margin, yPosition + 3, margin + titleWidth, yPosition + 3);
    yPosition += 25;

    // Event Details Card
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 55, 5, 5, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 55, 5, 5, 'S');
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const leftColumn = margin + 15;
    const rightColumn = pageWidth / 2 + 15;

    doc.text('Type:', leftColumn, yPosition + 18);
    doc.text('Status:', leftColumn, yPosition + 30);
    doc.text('Days:', leftColumn, yPosition + 42);
    doc.text('Currency:', rightColumn, yPosition + 18);
    doc.text('Created:', rightColumn, yPosition + 30);
    doc.text('Items:', rightColumn, yPosition + 42);
    
    doc.setFont('helvetica', 'normal');
    doc.text(event.type, leftColumn + 30, yPosition + 18);
    
    if (event.status === 'Completed') {
      doc.setTextColor(successColor[0], successColor[1], successColor[2]);
    } else {
      doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
    }
    doc.text(event.status, leftColumn + 35, yPosition + 30);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${event.days} day${event.days > 1 ? 's' : ''}`, leftColumn + 30, yPosition + 42);
    doc.text(event.currency, rightColumn + 40, yPosition + 18);
    doc.text(new Date(event.createdAt).toLocaleDateString(), rightColumn + 37, yPosition + 30);
    doc.text(event.items.length.toString(), rightColumn + 32, yPosition + 42);
    yPosition += 75;

    // Total Amount Highlight
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total ${columnTitle}: ${currencySymbol}${event.totalPlanned.toLocaleString()}`, margin + 15, yPosition + 20);
    yPosition += 50;

    // Budget Items Section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Budget Items', margin, yPosition);
    yPosition += 20;

    // Table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item Name', margin + 8, yPosition + 12);
    doc.text('Category', margin + 85, yPosition + 12);
    doc.text(columnTitle, pageWidth - margin - 45, yPosition + 12);
    yPosition += 18;

    // Table rows
    event.items.forEach((item, index) => {
      if (yPosition > pageHeight - 70) {
        doc.addPage();
        yPosition = margin;
        
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Budget Items (continued)', margin, yPosition);
        yPosition += 20;
        
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Item Name', margin + 8, yPosition + 12);
        doc.text('Category', margin + 85, yPosition + 12);
        doc.text(columnTitle, pageWidth - margin - 45, yPosition + 12);
        yPosition += 18;
      }
      
      const rowHeight = item.notes && item.notes.trim() ? 25 : 20;

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');
      }

      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.2);
      doc.line(margin, yPosition + rowHeight, pageWidth - margin, yPosition + rowHeight);
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      const itemName = item.name.length > 22 ? item.name.substring(0, 19) + '...' : item.name;
      const categoryName = item.category.length > 12 ? item.category.substring(0, 9) + '...' : item.category;
      doc.text(itemName, margin + 8, yPosition + 12);
      doc.text(categoryName, margin + 85, yPosition + 12);

      doc.setFont('helvetica', 'bold');
      doc.text(`${currencySymbol}${item.planned.toLocaleString()}`, pageWidth - margin - 45, yPosition + 12);

      if (item.notes && item.notes.trim()) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const notes = item.notes.length > 60 ? item.notes.substring(0, 57) + '...' : item.notes;
        doc.text(`Note: ${notes}`, margin + 8, yPosition + 20);
      }
      yPosition += rowHeight;
    });

    // Summary Section
    yPosition += 20;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 5, 5, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 5, 5, 'S');
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin + 15, yPosition + 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Items: ${event.items.length}`, margin + 15, yPosition + 28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(successColor[0], successColor[1], successColor[2]);
    doc.text(`Total ${columnTitle}: ${currencySymbol}${event.totalPlanned.toLocaleString()}`, pageWidth - margin - 90, yPosition + 28);

    // Footer
    const footerY = pageHeight - 20;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, footerY - 5, pageWidth, 25, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by SmartBudget - Professional Budget Planning Solution', margin, footerY + 8);
    doc.text(`Page 1 of ${doc.internal.pages.length - 1}`, pageWidth - margin - 40, footerY + 8);

    return doc;
  };

  const downloadPDF = (event: Event) => {
    try {
      if (!event || !event.title || !event.items) {
        throw new Error('Invalid event data');
      }
      const doc = generateBeautifulPDF(event);

      const cleanTitle = event.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `smartbudget_${cleanTitle}_${timestamp}.pdf`;
      doc.save(filename);
      toast({
        title: "Download Complete",
        description: `Your beautiful budget report "${event.title}" has been downloaded successfully!`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const user = localStorage.getItem('user');
  const planningEvents = events.filter(e => e.status === 'Planning');
  const completedEvents = events.filter(e => e.status === 'Completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Sasanka Budget Planner</h1>
            <p className="text-gray-300 text-sm sm:text-base">Event & Trip Budget Planner</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-full sm:w-32 bg-slate-800/50 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {currencies.slice(0, 10).map(currency => (
                  <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-purple-600/20">
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user ? (
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => window.location.href = '/login'} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
                Sign In
              </Button>
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
              <CardTitle className="text-white">Sign In Required</CardTitle>
              <CardDescription className="text-gray-300">
                You need to sign in to download your budget reports
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLoginPrompt(false)} 
                className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onDownload, onDelete }: {
  event: Event;
  onDownload: (event: Event) => void;
  onDelete: (eventId: string) => void;
}) => {
  const currencySymbol = getCurrencySymbol(event.currency);
  const columnTitle = event.status === 'Completed' ? 'Expense' : 'Planned';

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg text-white truncate">{event.title}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              {new Date(event.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-1 ml-2">
            <Badge variant={event.type === 'Trip' ? 'default' : 'secondary'} className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
              {event.type}
            </Badge>
            <Badge 
              variant={event.status === 'Planning' ? 'outline' : 'secondary'} 
              className={event.status === 'Planning' ? 'border-purple-500/30 text-purple-300 text-xs' : 'bg-green-600/20 text-green-300 border-green-500/30 text-xs'}
            >
              {event.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-gray-300 truncate">
              {columnTitle}: <span className="font-semibold text-white">{currencySymbol}{event.totalPlanned}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">
              {event.items.length} items • {event.days} day{event.days > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-2">
          <Button 
            variant="outline" 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-500/30 text-sm" 
            onClick={() => onDownload(event)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Complete
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-red-500/30 text-red-300 hover:bg-red-600/20 text-sm" 
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Events;
