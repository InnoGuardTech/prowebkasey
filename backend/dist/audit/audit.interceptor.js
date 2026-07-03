"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
let AuditInterceptor = class AuditInterceptor {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            const url = req.url;
            const user = req.user;
            let action = 'UPDATE';
            if (method === 'POST')
                action = 'CREATE';
            if (method === 'DELETE')
                action = 'DELETE';
            let entity_type = 'unknown';
            if (url.includes('trucks'))
                entity_type = 'Truck';
            else if (url.includes('drivers'))
                entity_type = 'Driver';
            else if (url.includes('contractors'))
                entity_type = 'Contractor';
            else if (url.includes('invoices'))
                entity_type = 'Invoice';
            else if (url.includes('expenses'))
                entity_type = 'Expense';
            if (url.includes('approve'))
                action = 'APPROVE';
            if (url.includes('reject'))
                action = 'REJECT';
            return next.handle().pipe((0, operators_1.tap)((data) => {
                if (user && entity_type !== 'unknown') {
                    const entity_id = data?.id || req.params?.id || 'unknown';
                    this.auditService.logAction(user.id, action, entity_type, entity_id, null, data || req.body).catch(e => console.error('Audit Error:', e));
                }
            }));
        }
        return next.handle();
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map