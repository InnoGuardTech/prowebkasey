import { Repository } from 'typeorm';
import { Truck } from '../entities/truck.entity';
export declare class TrucksService {
    private trucksRepository;
    constructor(trucksRepository: Repository<Truck>);
    findAll(userRole?: string, userId?: string, page?: number, limit?: number): Promise<{
        data: Truck[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, userRole?: string, userId?: string): Promise<Truck>;
    create(truckData: Partial<Truck>): Promise<Truck>;
    update(id: string, truckData: Partial<Truck>): Promise<Truck>;
    remove(id: string): Promise<void>;
}
