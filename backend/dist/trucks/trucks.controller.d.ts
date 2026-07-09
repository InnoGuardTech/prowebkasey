import { TrucksService } from './trucks.service';
export declare class TrucksController {
    private readonly trucksService;
    constructor(trucksService: TrucksService);
    create(createTruckDto: any, req: any): Promise<import("../entities/truck.entity").Truck>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: import("../entities/truck.entity").Truck[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<import("../entities/truck.entity").Truck>;
    update(id: string, updateTruckDto: any, req: any): Promise<import("../entities/truck.entity").Truck>;
    remove(id: string, req: any): Promise<void>;
}
