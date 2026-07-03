import { Repository } from 'typeorm';
import { Contractor } from '../entities/contractor.entity';
export declare class ContractorsService {
    private contractorsRepository;
    constructor(contractorsRepository: Repository<Contractor>);
    findAll(page?: number, limit?: number): Promise<{
        data: Contractor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Contractor>;
    create(contractorData: Partial<Contractor>): Promise<Contractor>;
    update(id: string, contractorData: Partial<Contractor>): Promise<Contractor>;
}
