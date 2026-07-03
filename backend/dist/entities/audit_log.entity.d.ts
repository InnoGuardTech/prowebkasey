import { User } from './user.entity';
export declare class AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values: any;
    new_values: any;
    user: User;
    created_at: Date;
}
