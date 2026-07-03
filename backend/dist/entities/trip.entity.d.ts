import { Truck } from './truck.entity';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';
export declare class Trip {
    id: string;
    trip_number: string;
    truck_id: string;
    truck: Truck;
    driver_id: string;
    driver: User;
    start_date: Date;
    end_date: Date;
    status: string;
    route: string;
    notes: string;
    created_at: Date;
    updated_at: Date;
    invoices: Invoice[];
    expenses: Expense[];
}
