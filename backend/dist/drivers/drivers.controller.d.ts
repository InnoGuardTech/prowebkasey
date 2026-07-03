import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    findAll(page?: string, limit?: string): Promise<{
        data: Driver[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Driver>;
    create(driverData: Partial<Driver>): Promise<Driver>;
    update(id: string, driverData: Partial<Driver>): Promise<Driver>;
}
