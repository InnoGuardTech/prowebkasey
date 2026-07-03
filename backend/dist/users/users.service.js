"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
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
let UsersService = class UsersService {
    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.usersRepository.findAndCount({
            select: {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                role: true,
                is_active: true,
                created_at: true
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
    async create(userData) {
        const existing = await this.usersRepository.findOne({
            where: {
                email: userData.email
            }
        });
        if (existing) {
            throw new _common.BadRequestException('البريد الإلكتروني مسجل مسبقاً');
        }
        const hashedPassword = await _bcryptjs.hash(userData.password_hash || '123456', 10);
        const user = this.usersRepository.create({
            ...userData,
            password_hash: hashedPassword
        });
        return this.usersRepository.save(user);
    }
    async update(id, userData) {
        if (userData.password_hash) {
            userData.password_hash = await _bcryptjs.hash(userData.password_hash, 10);
        }
        await this.usersRepository.update(id, userData);
        return this.usersRepository.findOne({
            where: {
                id
            }
        });
    }
    async remove(id) {
        await this.usersRepository.update(id, {
            is_active: false
        });
        return {
            success: true
        };
    }
    constructor(usersRepository){
        this.usersRepository = usersRepository;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map