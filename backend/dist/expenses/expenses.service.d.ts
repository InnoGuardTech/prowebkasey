import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
export declare class ExpensesService {
    private expensesRepository;
    constructor(expensesRepository: Repository<Expense>);
    findAll(userRole?: string, userId?: string, page?: number, limit?: number): Promise<{
        data: Expense[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Expense>;
    create(expenseData: any, userId: string): Promise<Expense>;
    update(id: string, expenseData: any): Promise<Expense>;
    approve(id: string, approverId: string): Promise<Expense>;
    reject(id: string, reason: string): Promise<Expense>;
    remove(id: string): Promise<void>;
}
