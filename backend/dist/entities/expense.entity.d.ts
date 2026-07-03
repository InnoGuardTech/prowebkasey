import { Truck } from './truck.entity';
import { ExpenseCategory } from './expense_category.entity';
import { User } from './user.entity';
export declare class Expense {
    id: string;
    truck_id: string;
    truck: Truck;
    trip_id: string;
    trip: any;
    category_id: string;
    category: ExpenseCategory;
    amount: number;
    expense_date: Date;
    notes: string;
    attachment_url: string;
    is_approved: boolean;
    approver: User;
    approved_at: Date;
    rejection_reason: string;
    creator: User;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
}
