import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
export declare class InvoicesService {
    private invoicesRepository;
    constructor(invoicesRepository: Repository<Invoice>);
    findAll(page?: number, limit?: number): Promise<{
        data: Invoice[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Invoice>;
    create(invoiceData: any, userId: string): Promise<Invoice>;
    update(id: string, invoiceData: any): Promise<Invoice>;
    softDelete(id: string): Promise<void>;
}
