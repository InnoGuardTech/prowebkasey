import { Invoice } from './invoice.entity';
export declare class Contractor {
    id: string;
    name: string;
    phone: string;
    company_name: string;
    notes: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    invoices: Invoice[];
}
