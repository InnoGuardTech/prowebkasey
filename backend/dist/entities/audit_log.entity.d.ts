import { User } from './user.entity';
import { Company } from './company.entity';
export declare class AuditLog {
    id: string;
    company_id: string;
    company: Company;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values: any;
    new_values: any;
    user: User;
    created_at: Date;
}
