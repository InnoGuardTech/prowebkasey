"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Trip", {
    enumerable: true,
    get: function() {
        return Trip;
    }
});
const _typeorm = require("typeorm");
const _truckentity = require("./truck.entity");
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
let Trip = class Trip {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Trip.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 100
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "trip_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'truck_id'
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "truck_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_truckentity.Truck),
    (0, _typeorm.JoinColumn)({
        name: 'truck_id'
    }),
    _ts_metadata("design:type", typeof _truckentity.Truck === "undefined" ? Object : _truckentity.Truck)
], Trip.prototype, "truck", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'driver_id',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "driver_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User),
    (0, _typeorm.JoinColumn)({
        name: 'driver_id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Trip.prototype, "driver", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Trip.prototype, "start_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Trip.prototype, "end_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 50,
        default: 'active'
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 255,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "route", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Trip.prototype, "notes", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Trip.prototype, "created_at", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Trip.prototype, "updated_at", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_invoiceentity.Invoice, (invoice)=>invoice.trip),
    _ts_metadata("design:type", Array)
], Trip.prototype, "invoices", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_expenseentity.Expense, (expense)=>expense.trip),
    _ts_metadata("design:type", Array)
], Trip.prototype, "expenses", void 0);
Trip = _ts_decorate([
    (0, _typeorm.Entity)('trips')
], Trip);

//# sourceMappingURL=trip.entity.js.map