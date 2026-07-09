import { Repository } from 'typeorm';
import { Truck } from '../entities/truck.entity';
export declare class TrucksService {
    private trucksRepository;
    constructor(trucksRepository: Repository<Truck>);
    findAll(userRole?: string, userId?: string, page?: number, limit?: number, companyId?: string): Promise<{
        data: Truck[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, userRole?: string, userId?: string, companyId?: string): Promise<Truck>;
    create(truckData: Partial<Truck>, companyId?: string): Promise<Truck>;
    update(id: string, truckData: Partial<Truck>, companyId?: string): Promise<Truck>;
    remove(id: string, companyId?: string): Promise<void>;
}
