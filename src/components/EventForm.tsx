
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Trash2 } from 'lucide-react';
import { currencies, getCurrencySymbol } from '@/utils/currencies';

interface EventFormProps {
  onAddEvent: (event: {
    title: string;
    type: 'Trip' | 'Event';
    totalPlanned: number;
    currency: string;
    status: 'Planning' | 'Completed';
    items: Array<{
      name: string;
      category: string;
      planned: number;
      notes: string;
    }>;
  }) => void;
  onClose: () => void;
  defaultCurrency: string;
}

const eventCategories = [
  'Transportation',
  'Accommodation',
  'Food & Dining',
  'Activities',
  'Shopping',
  'Equipment',
  'Insurance',
  'Other'
];

const EventForm = ({ onAddEvent, onClose, defaultCurrency }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Event' as 'Trip' | 'Event',
    currency: defaultCurrency,
    status: 'Planning' as 'Planning' | 'Completed',
    items: [
      { name: '', category: '', planned: 0, notes: '' }
    ]
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', category: '', planned: 0, notes: '' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) return;

    const totalPlanned = formData.items.reduce((sum, item) => sum + item.planned, 0);

    onAddEvent({
      title: formData.title,
      type: formData.type,
      currency: formData.currency,
      status: formData.status,
      totalPlanned,
      items: formData.items.filter(item => item.name && item.category)
    });
  };

  const currencySymbol = getCurrencySymbol(formData.currency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Create New Event/Trip Budget</CardTitle>
              <CardDescription>Plan your budget for upcoming events or trips</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event/Trip Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Vacation, Wedding"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'Trip' | 'Event') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trip">Trip</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Planning' | 'Completed') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Budget Items</h3>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Item Name</Label>
                        <Input
                          placeholder="e.g., Flight tickets"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Category</Label>
                        <Select 
                          value={item.category} 
                          onValueChange={(value) => updateItem(index, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Planned ({currencySymbol})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.planned || ''}
                          onChange={(e) => updateItem(index, 'planned', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs">Notes (optional)</Label>
                      <Input
                        placeholder="Add any notes or reminders"
                        value={item.notes}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                Create Event Budget
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
