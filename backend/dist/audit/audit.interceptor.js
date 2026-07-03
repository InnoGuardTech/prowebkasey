"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditInterceptor", {
    enumerable: true,
    get: function() {
        return AuditInterceptor;
    }
});
const _common = require("@nestjs/common");
const _operators = require("rxjs/operators");
const _auditservice = require("./audit.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        // Only log mutations
        if ([
            'POST',
            'PATCH',
            'PUT',
            'DELETE'
        ].includes(method)) {
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
            return next.handle().pipe((0, _operators.tap)((data)=>{
                if (user && entity_type !== 'unknown') {
                    const entity_id = data?.id || req.params?.id || 'unknown';
                    this.auditService.logAction(user.id, action, entity_type, entity_id, null, data || req.body).catch((e)=>console.error('Audit Error:', e));
                }
            }));
        }
        return next.handle();
    }
    constructor(auditService){
        this.auditService = auditService;
    }
};
AuditInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService
    ])
], AuditInterceptor);

//# sourceMappingURL=audit.interceptor.js.map