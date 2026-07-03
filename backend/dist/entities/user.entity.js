"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "User", {
    enumerable: true,
    get: function() {
        return User;
    }
});
const _typeorm = require("typeorm");
const _driverentity = require("./driver.entity");
const _truckentity = require("./truck.entity");
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
let User = class User {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], User.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 150
    }),
    _ts_metadata("design:type", String)
], User.prototype, "full_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 255,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 255
    }),
    _ts_metadata("design:type", String)
], User.prototype, "password_hash", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "phone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        default: 'driver'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "updated_at", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_driverentity.Driver, (driver)=>driver.user),
    _ts_metadata("design:type", typeof _driverentity.Driver === "undefined" ? Object : _driverentity.Driver)
], User.prototype, "driver_details", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_truckentity.Truck, (truck)=>truck.driver),
    _ts_metadata("design:type", Array)
], User.prototype, "trucks", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_invoiceentity.Invoice, (invoice)=>invoice.creator),
    _ts_metadata("design:type", Array)
], User.prototype, "created_invoices", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_expenseentity.Expense, (expense)=>expense.creator),
    _ts_metadata("design:type", Array)
], User.prototype, "created_expenses", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_expenseentity.Expense, (expense)=>expense.approver),
    _ts_metadata("design:type", Array)
], User.prototype, "approved_expenses", void 0);
User = _ts_decorate([
    (0, _typeorm.Entity)('users')
], User);

//# sourceMappingURL=user.entity.js.map