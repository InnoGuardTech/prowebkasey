import { ExpensesService } from './expenses.service';
import { Expense } from '../entities/expense.entity';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(page: string | undefined, limit: string | undefined, req: any): Promise<{
        data: Expense[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<Expense>;
    create(createExpenseDto: Partial<Expense>, req: any): Promise<Expense>;
    update(id: string, updateExpenseDto: Partial<Expense>, req: any): Promise<Expense>;
    approve(id: string, req: any): Promise<Expense>;
    reject(id: string, reason: string, req: any): Promise<Expense>;
    remove(id: string, req: any): Promise<void>;
}
