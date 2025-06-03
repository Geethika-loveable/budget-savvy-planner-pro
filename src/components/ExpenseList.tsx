
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No expenses recorded yet.</p>
          <p className="text-sm text-gray-400 mt-2">Add your first expense to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedExpenses.map((expense) => (
        <Card key={expense.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{expense.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-red-600">
                  -${expense.amount.toFixed(2)}
                </h3>
                {expense.description && (
                  <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteExpense(expense.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
