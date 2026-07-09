import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { User } from '../entities/user.entity';
export declare class DriversService {
    private driversRepository;
    private usersRepository;
    constructor(driversRepository: Repository<Driver>, usersRepository: Repository<User>);
    findAll(page?: number, limit?: number, companyId?: string): Promise<{
        data: Driver[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, companyId?: string): Promise<Driver>;
    create(data: any, companyId?: string): Promise<Driver>;
    update(id: string, data: any, companyId?: string): Promise<Driver>;
}
