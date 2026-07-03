"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriversModule", {
    enumerable: true,
    get: function() {
        return DriversModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _driverentity = require("../entities/driver.entity");
const _userentity = require("../entities/user.entity");
const _driversservice = require("./drivers.service");
const _driverscontroller = require("./drivers.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DriversModule = class DriversModule {
};
DriversModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _driverentity.Driver,
                _userentity.User
            ])
        ],
        controllers: [
            _driverscontroller.DriversController
        ],
        providers: [
            _driversservice.DriversService
        ],
        exports: [
            _driversservice.DriversService
        ]
    })
], DriversModule);

//# sourceMappingURL=drivers.module.js.map