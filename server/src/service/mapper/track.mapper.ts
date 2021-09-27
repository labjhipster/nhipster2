import { Track } from '../../domain/track.entity';
import { TrackDTO } from '../dto/track.dto';

/**
 * A Track mapper object.
 */
export class TrackMapper {
    static fromDTOtoEntity(entityDTO: TrackDTO): Track {
        if (!entityDTO) {
            return;
        }
        const entity = new Track();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Track): TrackDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new TrackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
