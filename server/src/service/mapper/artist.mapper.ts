import { Artist } from '../../domain/artist.entity';
import { ArtistDTO } from '../dto/artist.dto';

/**
 * A Artist mapper object.
 */
export class ArtistMapper {
    static fromDTOtoEntity(entityDTO: ArtistDTO): Artist {
        if (!entityDTO) {
            return;
        }
        const entity = new Artist();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Artist): ArtistDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ArtistDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
