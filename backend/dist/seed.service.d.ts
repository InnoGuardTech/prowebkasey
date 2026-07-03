import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
    private seedAdmin;
}
