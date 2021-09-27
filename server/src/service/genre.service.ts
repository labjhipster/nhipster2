import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { GenreDTO } from '../service/dto/genre.dto';
import { GenreMapper } from '../service/mapper/genre.mapper';
import { GenreRepository } from '../repository/genre.repository';

const relationshipNames = [];

@Injectable()
export class GenreService {
    logger = new Logger('GenreService');

    constructor(@InjectRepository(GenreRepository) private genreRepository: GenreRepository) {}

    async findById(id: number): Promise<GenreDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.genreRepository.findOne(id, options);
        return GenreMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<GenreDTO>): Promise<GenreDTO | undefined> {
        const result = await this.genreRepository.findOne(options);
        return GenreMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<GenreDTO>): Promise<[GenreDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.genreRepository.findAndCount(options);
        const genreDTO: GenreDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(genre => genreDTO.push(GenreMapper.fromEntityToDTO(genre)));
            resultList[0] = genreDTO;
        }
        return resultList;
    }

    async save(genreDTO: GenreDTO, creator?: string): Promise<GenreDTO | undefined> {
        const entity = GenreMapper.fromDTOtoEntity(genreDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.genreRepository.save(entity);
        return GenreMapper.fromEntityToDTO(result);
    }

    async update(genreDTO: GenreDTO, updater?: string): Promise<GenreDTO | undefined> {
        const entity = GenreMapper.fromDTOtoEntity(genreDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.genreRepository.save(entity);
        return GenreMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.genreRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
