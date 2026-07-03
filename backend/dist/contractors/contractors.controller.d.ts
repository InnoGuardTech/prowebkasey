import { ContractorsService } from './contractors.service';
import { Contractor } from '../entities/contractor.entity';
export declare class ContractorsController {
    private readonly contractorsService;
    constructor(contractorsService: ContractorsService);
    findAll(page?: string, limit?: string): Promise<{
        data: Contractor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Contractor>;
    create(contractorData: Partial<Contractor>): Promise<Contractor>;
    update(id: string, contractorData: Partial<Contractor>): Promise<Contractor>;
    remove(id: string): Promise<Contractor>;
}
