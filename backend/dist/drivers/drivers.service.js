"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriversService", {
    enumerable: true,
    get: function() {
        return DriversService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _driverentity = require("../entities/driver.entity");
const _userentity = require("../entities/user.entity");
const _bcryptjs = /*#__PURE__*/ _interop_require_wildcard(require("bcryptjs"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
let DriversService = class DriversService {
    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.driversRepository.findAndCount({
            relations: {
                user: true
            },
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const driver = await this.driversRepository.findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        });
        if (!driver) {
            throw new _common.NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }
    async create(data) {
        const { full_name, email, phone, password, license_number, license_expiry } = data;
        // Create User first
        const password_hash = password ? await _bcryptjs.hash(password, 10) : await _bcryptjs.hash('123456', 10);
        const user = this.usersRepository.create({
            full_name,
            email: email || `driver_${Date.now()}@prokasey.com`,
            phone,
            password_hash,
            role: 'driver'
        });
        const savedUser = await this.usersRepository.save(user);
        // Create Driver
        const newDriver = this.driversRepository.create({
            id: savedUser.id,
            license_number,
            license_expiry
        });
        return this.driversRepository.save(newDriver);
    }
    async update(id, data) {
        const driver = await this.findOne(id);
        // Update user info
        if (data.full_name || data.email || data.phone || data.password || data.is_active !== undefined) {
            const userUpdate = {};
            if (data.full_name) userUpdate.full_name = data.full_name;
            if (data.email) userUpdate.email = data.email;
            if (data.phone) userUpdate.phone = data.phone;
            if (data.is_active !== undefined) userUpdate.is_active = data.is_active;
            if (data.password) {
                userUpdate.password_hash = await _bcryptjs.hash(data.password, 10);
            }
            await this.usersRepository.update(id, userUpdate);
        }
        // Update driver info
        if (data.license_number || data.license_expiry) {
            const driverUpdate = {};
            if (data.license_number) driverUpdate.license_number = data.license_number;
            if (data.license_expiry) driverUpdate.license_expiry = data.license_expiry;
            await this.driversRepository.update(id, driverUpdate);
        }
        return this.findOne(id);
    }
    constructor(driversRepository, usersRepository){
        this.driversRepository = driversRepository;
        this.usersRepository = usersRepository;
    }
};
DriversService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_driverentity.Driver)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], DriversService);

//# sourceMappingURL=drivers.service.js.map