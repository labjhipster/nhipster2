import { Album } from '../../domain/album.entity';
import { AlbumDTO } from '../dto/album.dto';

/**
 * A Album mapper object.
 */
export class AlbumMapper {
    static fromDTOtoEntity(entityDTO: AlbumDTO): Album {
        if (!entityDTO) {
            return;
        }
        const entity = new Album();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Album): AlbumDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new AlbumDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
