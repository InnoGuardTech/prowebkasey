import { ContractorsService } from './contractors.service';
import { Contractor } from '../entities/contractor.entity';
export declare class ContractorsController {
    private readonly contractorsService;
    constructor(contractorsService: ContractorsService);
    findAll(page: string | undefined, limit: string | undefined, req: any): Promise<{
        data: Contractor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<Contractor>;
    create(contractorData: Partial<Contractor>, req: any): Promise<Contractor>;
    update(id: string, contractorData: Partial<Contractor>, req: any): Promise<Contractor>;
    remove(id: string, req: any): Promise<void>;
}
