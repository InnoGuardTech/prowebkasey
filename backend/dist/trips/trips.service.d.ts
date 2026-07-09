import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
export declare class TripsService {
    private readonly tripRepository;
    constructor(tripRepository: Repository<Trip>);
    findAll(userRole: string, userId: string, page?: number, limit?: number, companyId?: string): Promise<{
        data: Trip[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, userRole: string, userId: string, companyId?: string): Promise<Trip>;
    create(createTripDto: any, companyId?: string): Promise<Trip[]>;
    update(id: string, updateTripDto: any, companyId?: string): Promise<Trip>;
    remove(id: string, companyId?: string): Promise<{
        success: boolean;
    }>;
}
