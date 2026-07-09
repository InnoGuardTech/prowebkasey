import { User } from './user.entity';
export declare class Company {
    id: string;
    name: string;
    subdomain: string;
    logo_url: string;
    tax_id: string;
    theme_colors: any;
    features: any;
    status: string;
    created_at: Date;
    updated_at: Date;
    users: User[];
}
