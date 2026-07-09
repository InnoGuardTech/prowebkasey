import { Truck } from './truck.entity';
import { Contractor } from './contractor.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
export declare class Invoice {
    id: string;
    company_id: string;
    company: Company;
    truck_id: string;
    truck: Truck;
    trip_id: string;
    trip: any;
    contractor_id: string;
    contractor: Contractor;
    invoice_number: string;
    amount: number;
    invoice_date: Date;
    description: string;
    status: string;
    vat_amount: number;
    attachment_url: string;
    creator: User;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
}
