"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrucksService", {
    enumerable: true,
    get: function() {
        return TrucksService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _truckentity = require("../entities/truck.entity");
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
let TrucksService = class TrucksService {
    async findAll(userRole, userId, page = 1, limit = 20) {
        const query = this.trucksRepository.createQueryBuilder('truck').leftJoinAndSelect('truck.driver', 'driver').where('truck.is_deleted = false').orderBy('truck.created_at', 'DESC');
        if (userRole === 'driver') {
            query.andWhere('truck.driver_id = :userId', {
                userId
            });
        }
        const total = await query.getCount();
        const data = await query.skip((page - 1) * limit).take(limit).getMany();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }
    async findOne(id, userRole, userId) {
        const query = this.trucksRepository.createQueryBuilder('truck').leftJoinAndSelect('truck.driver', 'driver').where('truck.id = :id', {
            id
        }).andWhere('truck.is_deleted = false');
        if (userRole === 'driver') {
            query.andWhere('truck.driver_id = :userId', {
                userId
            });
        }
        const truck = await query.getOne();
        if (!truck) throw new _common.NotFoundException('القاطرة غير موجودة');
        return truck;
    }
    create(truckData) {
        const newTruck = this.trucksRepository.create(truckData);
        return this.trucksRepository.save(newTruck);
    }
    async update(id, truckData) {
        await this.findOne(id); // Ensure it exists
        await this.trucksRepository.update(id, truckData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id); // Ensure it exists
        await this.trucksRepository.update(id, {
            is_deleted: true
        });
    }
    constructor(trucksRepository){
        this.trucksRepository = trucksRepository;
    }
};
TrucksService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_truckentity.Truck)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], TrucksService);

//# sourceMappingURL=trucks.service.js.map