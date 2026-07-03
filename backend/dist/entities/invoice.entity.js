"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Invoice", {
    enumerable: true,
    get: function() {
        return Invoice;
    }
});
const _typeorm = require("typeorm");
const _truckentity = require("./truck.entity");
const _contractorentity = require("./contractor.entity");
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
let Invoice = class Invoice {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Invoice.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'truck_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "truck_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_truckentity.Truck, (truck)=>truck.invoices, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'truck_id'
    }),
    _ts_metadata("design:type", typeof _truckentity.Truck === "undefined" ? Object : _truckentity.Truck)
], Invoice.prototype, "truck", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'trip_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "trip_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('Trip', 'invoices', {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'trip_id'
    }),
    _ts_metadata("design:type", Object)
], Invoice.prototype, "trip", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'contractor_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "contractor_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_contractorentity.Contractor, (contractor)=>contractor.invoices, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'contractor_id'
    }),
    _ts_metadata("design:type", typeof _contractorentity.Contractor === "undefined" ? Object : _contractorentity.Contractor)
], Invoice.prototype, "contractor", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 50
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "invoice_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal',
        precision: 12,
        scale: 2
    }),
    _ts_metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Invoice.prototype, "invoice_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        default: 'pending'
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Invoice.prototype, "vat_amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 1000,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Invoice.prototype, "attachment_url", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.created_invoices, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'created_by'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Invoice.prototype, "creator", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Invoice.prototype, "is_deleted", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'datetime',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Invoice.prototype, "deleted_at", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Invoice.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Invoice.prototype, "updated_at", void 0);
Invoice = _ts_decorate([
    (0, _typeorm.Entity)('invoices')
], Invoice);

//# sourceMappingURL=invoice.entity.js.map