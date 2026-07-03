import { ExpenseCategoriesService } from './expense_categories.service';
import { ExpenseCategory } from '../entities/expense_category.entity';
export declare class ExpenseCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: ExpenseCategoriesService);
    findAll(): Promise<ExpenseCategory[]>;
    findOne(id: string): Promise<ExpenseCategory>;
    create(categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    update(id: string, categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    remove(id: string): Promise<ExpenseCategory>;
}
