import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';
import { Company } from './company.entity';
export declare class Truck {
    id: string;
    company_id: string;
    company: Company;
    truck_number: string;
    driver_id: string;
    driver: User;
    status: string;
    operation_date: Date;
    notes: string;
    is_deleted: boolean;
    registration_expiry: Date;
    insurance_expiry: Date;
    inspection_expiry: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    invoices: Invoice[];
    expenses: Expense[];
}
