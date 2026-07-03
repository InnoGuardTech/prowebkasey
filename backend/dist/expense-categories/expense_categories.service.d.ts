import { Repository } from 'typeorm';
import { ExpenseCategory } from '../entities/expense_category.entity';
export declare class ExpenseCategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<ExpenseCategory>);
    findAll(): Promise<ExpenseCategory[]>;
    findOne(id: string): Promise<ExpenseCategory>;
    create(categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    update(id: string, categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
}
