import { CompaniesService } from './companies.service';
import { Company } from '../entities/company.entity';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getThemeBySubdomain(subdomain: string): Promise<{
        name: string;
        subdomain: string;
        logo_url: string;
        theme_colors: any;
    }>;
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    create(companyData: Partial<Company>): Promise<Company>;
    update(id: string, updateData: Partial<Company>): Promise<Company>;
    remove(id: string): Promise<void>;
}
