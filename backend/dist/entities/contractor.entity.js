"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Contractor", {
    enumerable: true,
    get: function() {
        return Contractor;
    }
});
const _typeorm = require("typeorm");
const _invoiceentity = require("./invoice.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Contractor = class Contractor {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Contractor.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 200
    }),
    _ts_metadata("design:type", String)
], Contractor.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Contractor.prototype, "phone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 200,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Contractor.prototype, "company_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Contractor.prototype, "notes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Contractor.prototype, "is_active", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Contractor.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Contractor.prototype, "updated_at", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_invoiceentity.Invoice, (invoice)=>invoice.contractor),
    _ts_metadata("design:type", Array)
], Contractor.prototype, "invoices", void 0);
Contractor = _ts_decorate([
    (0, _typeorm.Entity)('contractors')
], Contractor);

//# sourceMappingURL=contractor.entity.js.map