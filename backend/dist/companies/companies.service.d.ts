import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
export declare class CompaniesService {
    private companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    findBySubdomain(subdomain: string): Promise<{
        name: string;
        subdomain: string;
        logo_url: string;
        theme_colors: any;
    }>;
    create(companyData: Partial<Company>): Promise<Company>;
    update(id: string, updateData: Partial<Company>): Promise<Company>;
    remove(id: string): Promise<void>;
}
