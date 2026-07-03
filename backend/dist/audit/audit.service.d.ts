import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit_log.entity';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    logAction(userId: string, action: string, entity_type: string, entity_id: string, old_values?: any, new_values?: any): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
}
