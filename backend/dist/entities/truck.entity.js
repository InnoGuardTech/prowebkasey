"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Truck", {
    enumerable: true,
    get: function() {
        return Truck;
    }
});
const _typeorm = require("typeorm");
const _userentity = require("./user.entity");
const _invoiceentity = require("./invoice.entity");
const _expenseentity = require("./expense.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Truck = class Truck {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Truck.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 50,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Truck.prototype, "truck_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'driver_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Truck.prototype, "driver_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.trucks, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'driver_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Truck.prototype, "driver", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        default: 'inactive'
    }),
    _ts_metadata("design:type", String)
], Truck.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "operation_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Truck.prototype, "notes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Truck.prototype, "is_deleted", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "registration_expiry", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "insurance_expiry", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "inspection_expiry", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Truck.prototype, "updated_at", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_invoiceentity.Invoice, (invoice)=>invoice.truck),
    _ts_metadata("design:type", Array)
], Truck.prototype, "invoices", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_expenseentity.Expense, (expense)=>expense.truck),
    _ts_metadata("design:type", Array)
], Truck.prototype, "expenses", void 0);
Truck = _ts_decorate([
    (0, _typeorm.Entity)('trucks')
], Truck);

//# sourceMappingURL=truck.entity.js.map