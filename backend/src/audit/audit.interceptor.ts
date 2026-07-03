import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    
    // Only log mutations
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      const url = req.url;
      const user = req.user; // from AuthGuard
      
      let action = 'UPDATE';
      if (method === 'POST') action = 'CREATE';
      if (method === 'DELETE') action = 'DELETE';
      
      // Determine entity type from URL simply
      let entity_type = 'unknown';
      if (url.includes('trucks')) entity_type = 'Truck';
      else if (url.includes('drivers')) entity_type = 'Driver';
      else if (url.includes('contractors')) entity_type = 'Contractor';
      else if (url.includes('invoices')) entity_type = 'Invoice';
      else if (url.includes('expenses')) entity_type = 'Expense';
      
      if (url.includes('approve')) action = 'APPROVE';
      if (url.includes('reject')) action = 'REJECT';

      return next.handle().pipe(
        tap((data) => {
          if (user && entity_type !== 'unknown') {
             const entity_id = data?.id || req.params?.id || 'unknown';
             this.auditService.logAction(user.id, action, entity_type, entity_id, null, data || req.body).catch(e => console.error('Audit Error:', e));
          }
        }),
      );
    }
    
    return next.handle();
  }
}
