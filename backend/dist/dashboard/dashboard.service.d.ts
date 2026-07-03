import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';
import { Truck } from '../entities/truck.entity';
import { Driver } from '../entities/driver.entity';
export declare class DashboardService {
    private invoicesRepository;
    private expensesRepository;
    private trucksRepository;
    private driverRepository;
    constructor(invoicesRepository: Repository<Invoice>, expensesRepository: Repository<Expense>, trucksRepository: Repository<Truck>, driverRepository: Repository<Driver>);
    getDashboardStats(): Promise<{
        activeTrucks: number;
        totalIncome: number;
        totalExpenses: number;
        approvedExpenses: number;
        pendingExpenses: number;
        netProfit: number;
        chartData: {
            name: string;
            income: number;
            expense: number;
        }[];
    }>;
    getAlerts(): Promise<any[]>;
}
