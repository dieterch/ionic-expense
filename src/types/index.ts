export interface Expense {
    id: string;
    date: Date | string;
    description: string;
    amount: number | string | null;
    location: string | null;
    userId: string;
    category: Category;
    user: User;
    categoryId: string;
    currency: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    icon: string;
    raw: { icon: string };
  }
  
  export interface User {
    id: string;
    name: string;
  }
  
  export interface SelectedTrip {
    id: string;
    name: string;
    users: { user: User }[];
  }

  export interface Trip {
    id: string;
    startDate: string;
    name: string;
    users: { user: User }[];
    expenses: Expense[];
  }
  