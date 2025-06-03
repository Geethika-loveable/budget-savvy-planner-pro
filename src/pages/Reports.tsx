
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Download, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

const Reports = () => {
  const handleExportCSV = () => {
    const budgetData = JSON.parse(localStorage.getItem('budgetData') || '{}');
    const expenses = budgetData.expenses || [];
    
    const csvContent = [
      ['Date', 'Category', 'Amount', 'Description'],
      ...expenses.map((expense: any) => [
        expense.date,
        expense.category,
        expense.amount,
        expense.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">View detailed insights about your spending patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Monthly Summary</span>
              </CardTitle>
              <CardDescription>Overview of this month's financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Income</span>
                  <span className="font-semibold text-green-600">$4,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Expenses</span>
                  <span className="font-semibold text-red-600">$2,340</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Net Income</span>
                  <span className="font-semibold text-blue-600">$2,160</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Top Categories</span>
              </CardTitle>
              <CardDescription>Your biggest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Food & Dining</span>
                  <span className="text-sm font-semibold">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Transportation</span>
                  <span className="text-sm font-semibold">24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Entertainment</span>
                  <span className="text-sm font-semibold">18%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Budget Performance</span>
              </CardTitle>
              <CardDescription>How well you're sticking to your budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Budget Used</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="text-sm text-green-600">
                  ✓ Under budget this month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Download your financial data for external analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={handleExportCSV} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export to CSV</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export to PDF</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
