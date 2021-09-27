import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ArtistDTO } from '../service/dto/artist.dto';
import { ArtistMapper } from '../service/mapper/artist.mapper';
import { ArtistRepository } from '../repository/artist.repository';

const relationshipNames = [];

@Injectable()
export class ArtistService {
    logger = new Logger('ArtistService');

    constructor(@InjectRepository(ArtistRepository) private artistRepository: ArtistRepository) {}

    async findById(id: number): Promise<ArtistDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.artistRepository.findOne(id, options);
        return ArtistMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ArtistDTO>): Promise<ArtistDTO | undefined> {
        const result = await this.artistRepository.findOne(options);
        return ArtistMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ArtistDTO>): Promise<[ArtistDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.artistRepository.findAndCount(options);
        const artistDTO: ArtistDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(artist => artistDTO.push(ArtistMapper.fromEntityToDTO(artist)));
            resultList[0] = artistDTO;
        }
        return resultList;
    }

    async save(artistDTO: ArtistDTO, creator?: string): Promise<ArtistDTO | undefined> {
        const entity = ArtistMapper.fromDTOtoEntity(artistDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.artistRepository.save(entity);
        return ArtistMapper.fromEntityToDTO(result);
    }

    async update(artistDTO: ArtistDTO, updater?: string): Promise<ArtistDTO | undefined> {
        const entity = ArtistMapper.fromDTOtoEntity(artistDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.artistRepository.save(entity);
        return ArtistMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.artistRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
