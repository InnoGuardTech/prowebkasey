"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrucksModule", {
    enumerable: true,
    get: function() {
        return TrucksModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _truckentity = require("../entities/truck.entity");
const _trucksservice = require("./trucks.service");
const _truckscontroller = require("./trucks.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TrucksModule = class TrucksModule {
};
TrucksModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _truckentity.Truck
            ])
        ],
        controllers: [
            _truckscontroller.TrucksController
        ],
        providers: [
            _trucksservice.TrucksService
        ],
        exports: [
            _trucksservice.TrucksService
        ]
    })
], TrucksModule);

//# sourceMappingURL=trucks.module.js.map