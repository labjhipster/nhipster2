import { Genre } from '../../domain/genre.entity';
import { GenreDTO } from '../dto/genre.dto';

/**
 * A Genre mapper object.
 */
export class GenreMapper {
    static fromDTOtoEntity(entityDTO: GenreDTO): Genre {
        if (!entityDTO) {
            return;
        }
        const entity = new Genre();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Genre): GenreDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new GenreDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
