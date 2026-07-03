import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
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
