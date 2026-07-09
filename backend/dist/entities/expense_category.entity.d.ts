import { Expense } from './expense.entity';
import { Company } from './company.entity';
export declare class ExpenseCategory {
    id: string;
    company_id: string;
    company: Company;
    name: string;
    description: string;
    color: string;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    deleted_at: Date;
    expenses: Expense[];
}
