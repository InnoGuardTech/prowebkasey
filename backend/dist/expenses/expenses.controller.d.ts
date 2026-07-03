import { ExpensesService } from './expenses.service';
import { Expense } from '../entities/expense.entity';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: Expense[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Expense>;
    create(createExpenseDto: Partial<Expense>, req: any): Promise<Expense>;
    update(id: string, updateExpenseDto: Partial<Expense>): Promise<Expense>;
    approve(id: string, req: any): Promise<Expense>;
    reject(id: string, reason: string): Promise<Expense>;
    remove(id: string): Promise<void>;
}
