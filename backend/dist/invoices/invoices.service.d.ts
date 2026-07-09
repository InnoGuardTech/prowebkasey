import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
export declare class InvoicesService {
    private invoicesRepository;
    constructor(invoicesRepository: Repository<Invoice>);
    findAll(page?: number, limit?: number, companyId?: string): Promise<{
        data: Invoice[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, companyId?: string): Promise<Invoice>;
    create(invoiceData: any, userId: string, companyId?: string): Promise<Invoice>;
    update(id: string, invoiceData: any, companyId?: string): Promise<Invoice>;
    softDelete(id: string, companyId?: string): Promise<void>;
}
