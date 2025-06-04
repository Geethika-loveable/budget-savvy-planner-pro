
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
    days: number;
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
    days: 1,
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
      days: formData.days,
      totalPlanned,
      items: formData.items.filter(item => item.name && item.category)
    });
  };

  const currencySymbol = getCurrencySymbol(formData.currency);
  const columnTitle = formData.status === 'Completed' ? 'Expense' : 'Planned';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-purple-500/30 my-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">New Budget</CardTitle>
              <CardDescription className="text-gray-300">Plan your budget for upcoming events or trips</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-purple-600/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Vacation, Wedding"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'Trip' | 'Event') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="Trip" className="text-white hover:bg-purple-600/20">Trip</SelectItem>
                    <SelectItem value="Event" className="text-white hover:bg-purple-600/20">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days" className="text-gray-300">Number of Days</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.days}
                  onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-300">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 max-h-60">
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-purple-600/20">
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Planning' | 'Completed') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="Planning" className="text-white hover:bg-purple-600/20">Planning</SelectItem>
                  <SelectItem value="Completed" className="text-white hover:bg-purple-600/20">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Budget Items</h3>
                <Button type="button" onClick={addItem} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <Card key={index} className="p-4 bg-slate-700/30 border-purple-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-gray-300">Item Name</Label>
                        <Input
                          placeholder="e.g., Flight tickets"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Category</Label>
                        <Select 
                          value={item.category} 
                          onValueChange={(value) => updateItem(index, 'category', value)}
                        >
                          <SelectTrigger className="bg-slate-600/50 border-purple-500/30 text-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            {eventCategories.map(category => (
                              <SelectItem key={category} value={category} className="text-white hover:bg-purple-600/20">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">{columnTitle} ({currencySymbol})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.planned || ''}
                          onChange={(e) => updateItem(index, 'planned', parseFloat(e.target.value) || 0)}
                          className="bg-slate-600/50 border-purple-500/30 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                          className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs text-gray-300">Notes (optional)</Label>
                      <Input
                        placeholder="Add any notes or reminders"
                        value={item.notes}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                        className="bg-slate-600/50 border-purple-500/30 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create Budget
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20">
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
