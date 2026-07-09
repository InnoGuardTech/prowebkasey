import { TripsService } from './trips.service';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    create(createTripDto: any, req: any): Promise<import("../entities/trip.entity").Trip[]>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: import("../entities/trip.entity").Trip[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<import("../entities/trip.entity").Trip>;
    update(id: string, updateTripDto: any, req: any): Promise<import("../entities/trip.entity").Trip>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
