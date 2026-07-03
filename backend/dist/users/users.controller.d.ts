import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): Promise<{
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
