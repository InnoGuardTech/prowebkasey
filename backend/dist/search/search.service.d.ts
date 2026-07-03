import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';
import { Truck } from '../entities/truck.entity';
export declare class SearchService {
    private invoicesRepository;
    private expensesRepository;
    private trucksRepository;
    constructor(invoicesRepository: Repository<Invoice>, expensesRepository: Repository<Expense>, trucksRepository: Repository<Truck>);
    globalSearch(query: string): Promise<{
        trucks: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
        invoices: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
        expenses: {
            type: string;
            id: string;
            label: string;
            sub: string;
        }[];
    }>;
}
