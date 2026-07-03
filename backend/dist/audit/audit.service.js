"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditService", {
    enumerable: true,
    get: function() {
        return AuditService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _audit_logentity = require("../entities/audit_log.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuditService = class AuditService {
    logAction(userId, action, entity_type, entity_id, old_values, new_values) {
        const log = this.auditLogRepository.create({
            action,
            entity_type,
            entity_id,
            old_values,
            new_values,
            user: {
                id: userId
            }
        });
        return this.auditLogRepository.save(log);
    }
    findAll() {
        return this.auditLogRepository.find({
            relations: {
                user: true
            },
            order: {
                created_at: 'DESC'
            },
            take: 100 // Limit to recent 100 logs for performance
        });
    }
    constructor(auditLogRepository){
        this.auditLogRepository = auditLogRepository;
    }
};
AuditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_audit_logentity.AuditLog)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], AuditService);

//# sourceMappingURL=audit.service.js.map