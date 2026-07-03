"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TripsController", {
    enumerable: true,
    get: function() {
        return TripsController;
    }
});
const _common = require("@nestjs/common");
const _tripsservice = require("./trips.service");
const _passport = require("@nestjs/passport");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
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
let TripsController = class TripsController {
    create(createTripDto) {
        return this.tripsService.create(createTripDto);
    }
    findAll(req, page = '1', limit = '20') {
        return this.tripsService.findAll(req.user.role, req.user.userId, Number(page), Number(limit));
    }
    findOne(id, req) {
        return this.tripsService.findOne(id, req.user.role, req.user.userId);
    }
    update(id, updateTripDto) {
        return this.tripsService.update(id, updateTripDto);
    }
    remove(id) {
        return this.tripsService.remove(id);
    }
    constructor(tripsService){
        this.tripsService = tripsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _rolesdecorator.Roles)('admin', 'accountant'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], TripsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TripsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], TripsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _rolesdecorator.Roles)('admin', 'accountant'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], TripsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _rolesdecorator.Roles)('admin'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TripsController.prototype, "remove", null);
TripsController = _ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _common.Controller)('api/v1/trips'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tripsservice.TripsService === "undefined" ? Object : _tripsservice.TripsService
    ])
], TripsController);

//# sourceMappingURL=trips.controller.js.map