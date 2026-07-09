import { InvoicesService } from './invoices.service';
import { Invoice } from '../entities/invoice.entity';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    findAll(page: string | undefined, limit: string | undefined, req: any): Promise<{
        data: Invoice[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string, req: any): Promise<Invoice>;
    create(invoiceData: Partial<Invoice>, req: any): Promise<Invoice>;
    update(id: string, invoiceData: Partial<Invoice>, req: any): Promise<Invoice>;
    remove(id: string, req: any): Promise<void>;
}
