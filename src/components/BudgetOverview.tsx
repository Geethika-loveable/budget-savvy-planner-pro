
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetOverviewProps {
  expenses: Expense[];
}

const BudgetOverview = ({ expenses }: BudgetOverviewProps) => {
  // Calculate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const categoryColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No spending data available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount], index) => {
                const percentage = (amount / totalSpent) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-gray-600">
                        ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${categoryColors[index % categoryColors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Spent</span>
                <span>${totalSpent.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
