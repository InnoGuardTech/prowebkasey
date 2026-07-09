import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    findAll(page: string | undefined, limit: string | undefined, req: any): Promise<{
        data: Driver[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<Driver>;
    create(driverData: Partial<Driver>, req: any): Promise<Driver>;
    update(id: string, driverData: Partial<Driver>, req: any): Promise<Driver>;
}
