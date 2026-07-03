import { Expense } from './expense.entity';
export declare class ExpenseCategory {
    id: string;
    name: string;
    description: string;
    color: string;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    expenses: Expense[];
}
