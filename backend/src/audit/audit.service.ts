import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit_log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  logAction(userId: string, action: string, entity_type: string, entity_id: string, old_values?: any, new_values?: any) {
    const log = this.auditLogRepository.create({
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      user: { id: userId } as any,
    });
    return this.auditLogRepository.save(log);
  }

  findAll() {
    return this.auditLogRepository.find({
      relations: { user: true },
      order: { created_at: 'DESC' },
      take: 100 // Limit to recent 100 logs for performance
    });
  }
}
