import { User } from './user.entity';
import { Company } from './company.entity';
export declare class Driver {
    id: string;
    user: User;
    company_id: string;
    company: Company;
    license_number: string;
    license_expiry: Date;
    salary: number;
    hired_date: Date;
    emergency_contact: string;
    iqama_number: string;
    iqama_expiry: Date;
    deleted_at: Date;
}
