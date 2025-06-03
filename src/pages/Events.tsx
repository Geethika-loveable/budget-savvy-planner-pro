
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import EventForm from '@/components/EventForm';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'Trip' | 'Event';
  totalPlanned: number;
  totalActual: number;
  createdAt: string;
  items: Array<{
    name: string;
    category: string;
    planned: number;
    actual: number;
    notes: string;
  }>;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events & Trips</h1>
            <p className="text-gray-600">Plan and track budgets for your special events and trips</p>
          </div>
          <Button onClick={() => setShowEventForm(true)}>
            Create New Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first event or trip budget to get started with planning!
              </p>
              <Button onClick={() => setShowEventForm(true)}>
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={event.type === 'Trip' ? 'default' : 'secondary'}>
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Planned: <span className="font-semibold">${event.totalPlanned}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Actual: <span className="font-semibold">${event.totalActual}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        {event.items.length} budget items
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showEventForm && (
        <EventForm
          onAddEvent={addEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
};

export default Events;
