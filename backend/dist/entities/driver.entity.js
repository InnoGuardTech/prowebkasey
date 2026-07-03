"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Driver", {
    enumerable: true,
    get: function() {
        return Driver;
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
let Driver = class Driver {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)('uuid'),
    _ts_metadata("design:type", String)
], Driver.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_userentity.User, (user)=>user.driver_details, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'id'
    }),
    _ts_metadata("design:type", typeof _userentity.User === "undefined" ? Object : _userentity.User)
], Driver.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 50,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Driver.prototype, "license_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Driver.prototype, "license_expiry", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], Driver.prototype, "salary", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Driver.prototype, "hired_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 20,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Driver.prototype, "emergency_contact", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        length: 50,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Driver.prototype, "iqama_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Driver.prototype, "iqama_expiry", void 0);
Driver = _ts_decorate([
    (0, _typeorm.Entity)('drivers')
], Driver);

//# sourceMappingURL=driver.entity.js.map