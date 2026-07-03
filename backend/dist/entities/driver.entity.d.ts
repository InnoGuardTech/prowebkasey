import { User } from './user.entity';
export declare class Driver {
    id: string;
    user: User;
    license_number: string;
    license_expiry: Date;
    salary: number;
    hired_date: Date;
    emergency_contact: string;
    iqama_number: string;
    iqama_expiry: Date;
}
