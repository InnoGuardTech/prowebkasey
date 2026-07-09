import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            full_name: any;
            role: any;
            company_id: any;
        };
    }>;
    register(req: any): Promise<{
        id: string;
        company_id: string;
        company: import("../entities/company.entity").Company;
        full_name: string;
        email: string;
        phone: string;
        role: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        driver_details: import("../entities/driver.entity").Driver;
        trucks: import("../entities/truck.entity").Truck[];
        created_invoices: import("../entities/invoice.entity").Invoice[];
        created_expenses: import("../entities/expense.entity").Expense[];
        approved_expenses: import("../entities/expense.entity").Expense[];
    }>;
}
