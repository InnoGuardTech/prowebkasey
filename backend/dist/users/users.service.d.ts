import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(page?: number, limit?: number): Promise<{
        data: User[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<User | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
