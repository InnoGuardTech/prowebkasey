import { Repository } from 'typeorm';
import { Contractor } from '../entities/contractor.entity';
export declare class ContractorsService {
    private contractorsRepository;
    constructor(contractorsRepository: Repository<Contractor>);
    findAll(page?: number, limit?: number, companyId?: string): Promise<{
        data: Contractor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, companyId?: string): Promise<Contractor>;
    create(contractorData: Partial<Contractor>, companyId?: string): Promise<Contractor>;
    update(id: string, contractorData: Partial<Contractor>, companyId?: string): Promise<Contractor>;
    remove(id: string, companyId?: string): Promise<void>;
}
