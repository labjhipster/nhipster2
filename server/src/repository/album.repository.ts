import { EntityRepository, Repository } from 'typeorm';
import { Album } from '../domain/album.entity';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {}
