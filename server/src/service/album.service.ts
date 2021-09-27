import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AlbumDTO } from '../service/dto/album.dto';
import { AlbumMapper } from '../service/mapper/album.mapper';
import { AlbumRepository } from '../repository/album.repository';

const relationshipNames = [];

@Injectable()
export class AlbumService {
    logger = new Logger('AlbumService');

    constructor(@InjectRepository(AlbumRepository) private albumRepository: AlbumRepository) {}

    async findById(id: number): Promise<AlbumDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.albumRepository.findOne(id, options);
        return AlbumMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AlbumDTO>): Promise<AlbumDTO | undefined> {
        const result = await this.albumRepository.findOne(options);
        return AlbumMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AlbumDTO>): Promise<[AlbumDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.albumRepository.findAndCount(options);
        const albumDTO: AlbumDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(album => albumDTO.push(AlbumMapper.fromEntityToDTO(album)));
            resultList[0] = albumDTO;
        }
        return resultList;
    }

    async save(albumDTO: AlbumDTO, creator?: string): Promise<AlbumDTO | undefined> {
        const entity = AlbumMapper.fromDTOtoEntity(albumDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.albumRepository.save(entity);
        return AlbumMapper.fromEntityToDTO(result);
    }

    async update(albumDTO: AlbumDTO, updater?: string): Promise<AlbumDTO | undefined> {
        const entity = AlbumMapper.fromDTOtoEntity(albumDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.albumRepository.save(entity);
        return AlbumMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.albumRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
