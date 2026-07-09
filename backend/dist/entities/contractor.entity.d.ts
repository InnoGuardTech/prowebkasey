import { Invoice } from './invoice.entity';
import { Company } from './company.entity';
export declare class Contractor {
    id: string;
    company_id: string;
    company: Company;
    name: string;
    phone: string;
    company_name: string;
    notes: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    invoices: Invoice[];
}
