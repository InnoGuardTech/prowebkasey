"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrucksController", {
    enumerable: true,
    get: function() {
        return TrucksController;
    }
});
const _common = require("@nestjs/common");
const _trucksservice = require("./trucks.service");
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
let TrucksController = class TrucksController {
    create(createTruckDto) {
        return this.trucksService.create(createTruckDto);
    }
    findAll(req, page = '1', limit = '20') {
        return this.trucksService.findAll(req.user?.role, req.user?.userId, Number(page), Number(limit));
    }
    findOne(id, req) {
        return this.trucksService.findOne(id, req.user?.role, req.user?.userId);
    }
    update(id, updateTruckDto) {
        return this.trucksService.update(id, updateTruckDto);
    }
    remove(id) {
        return this.trucksService.remove(id);
    }
    constructor(trucksService){
        this.trucksService = trucksService;
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
], TrucksController.prototype, "create", null);
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
], TrucksController.prototype, "findAll", null);
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
], TrucksController.prototype, "findOne", null);
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
], TrucksController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _rolesdecorator.Roles)('admin'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TrucksController.prototype, "remove", null);
TrucksController = _ts_decorate([
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _common.Controller)('api/v1/trucks'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _trucksservice.TrucksService === "undefined" ? Object : _trucksservice.TrucksService
    ])
], TrucksController);

//# sourceMappingURL=trucks.controller.js.map