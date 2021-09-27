import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TrackDTO } from '../service/dto/track.dto';
import { TrackMapper } from '../service/mapper/track.mapper';
import { TrackRepository } from '../repository/track.repository';

const relationshipNames = [];
relationshipNames.push('album');

@Injectable()
export class TrackService {
    logger = new Logger('TrackService');

    constructor(@InjectRepository(TrackRepository) private trackRepository: TrackRepository) {}

    async findById(id: number): Promise<TrackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.trackRepository.findOne(id, options);
        return TrackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TrackDTO>): Promise<TrackDTO | undefined> {
        const result = await this.trackRepository.findOne(options);
        return TrackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TrackDTO>): Promise<[TrackDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.trackRepository.findAndCount(options);
        const trackDTO: TrackDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(track => trackDTO.push(TrackMapper.fromEntityToDTO(track)));
            resultList[0] = trackDTO;
        }
        return resultList;
    }

    async save(trackDTO: TrackDTO, creator?: string): Promise<TrackDTO | undefined> {
        const entity = TrackMapper.fromDTOtoEntity(trackDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.trackRepository.save(entity);
        return TrackMapper.fromEntityToDTO(result);
    }

    async update(trackDTO: TrackDTO, updater?: string): Promise<TrackDTO | undefined> {
        const entity = TrackMapper.fromDTOtoEntity(trackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.trackRepository.save(entity);
        return TrackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.trackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
