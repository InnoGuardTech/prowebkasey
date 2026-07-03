import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
export declare class TripsService {
    private readonly tripRepository;
    constructor(tripRepository: Repository<Trip>);
    findAll(userRole: string, userId: string, page?: number, limit?: number): Promise<{
        data: Trip[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, userRole: string, userId: string): Promise<Trip>;
    create(createTripDto: any): Promise<Trip[]>;
    update(id: string, updateTripDto: any): Promise<Trip>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
