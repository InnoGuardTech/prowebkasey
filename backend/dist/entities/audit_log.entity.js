"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditLog", {
    enumerable: true,
    get: function() {
        return AuditLog;
    }
});
const _typeorm = require("typeorm");
const _userentity = require("./user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuditLog = class AuditLog {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "entity_type", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], AuditLog.prototype, "entity_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)('simple-json', {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "old_values", void 0);
_ts_decorate([
    (0, _typeorm.Column)('simple-json', {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AuditLog.prototype, "new_values", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User),
    (0, _typeorm.JoinColumn)({
        name: 'user_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], AuditLog.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuditLog.prototype, "created_at", void 0);
AuditLog = _ts_decorate([
    (0, _typeorm.Entity)('audit_logs')
], AuditLog);

//# sourceMappingURL=audit_log.entity.js.map