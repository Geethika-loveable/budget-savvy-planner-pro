
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BudgetOverview from '@/components/BudgetOverview';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetData {
  monthlyBudget: number;
  totalIncome: number;
  totalExpenses: number;
  expenses: Expense[];
}

const Dashboard = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthlyBudget: 3000,
    totalIncome: 4500,
    totalExpenses: 0,
    expenses: []
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
      setBudgetData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    // Calculate total expenses
    const total = budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setBudgetData(prev => ({ ...prev, totalExpenses: total }));
    
    // Save to localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }, [budgetData.expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    
    setBudgetData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
    
    setShowExpenseForm(false);
    toast({
      title: "Expense Added",
      description: `$${expense.amount} added to ${expense.category}`,
    });
  };

  const deleteExpense = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
    
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed",
    });
  };

  const budgetUsed = (budgetData.totalExpenses / budgetData.monthlyBudget) * 100;
  const remainingBudget = budgetData.monthlyBudget - budgetData.totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Dashboard</h1>
          <p className="text-gray-600">Track your expenses and manage your budget</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${budgetData.monthlyBudget.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${budgetData.totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Remaining Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingBudget.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>
              You've used {budgetUsed.toFixed(1)}% of your monthly budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={Math.min(budgetUsed, 100)} 
              className="w-full h-3"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>$0</span>
              <span>${budgetData.monthlyBudget.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Button onClick={() => setShowExpenseForm(true)}>
                Add Expense
              </Button>
            </div>
            <ExpenseList 
              expenses={budgetData.expenses} 
              onDeleteExpense={deleteExpense}
            />
          </div>

          <div>
            <BudgetOverview expenses={budgetData.expenses} />
          </div>
        </div>
      </div>

      {showExpenseForm && (
        <ExpenseForm
          onAddExpense={addExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
