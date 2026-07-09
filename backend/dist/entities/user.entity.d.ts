import { Driver } from './driver.entity';
import { Truck } from './truck.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';
import { Company } from './company.entity';
export declare class User {
    id: string;
    company_id: string;
    company: Company;
    full_name: string;
    email: string;
    password_hash: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    driver_details: Driver;
    trucks: Truck[];
    created_invoices: Invoice[];
    created_expenses: Expense[];
    approved_expenses: Expense[];
}
