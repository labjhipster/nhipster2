import { EntityRepository, Repository } from 'typeorm';
import { Genre } from '../domain/genre.entity';

@EntityRepository(Genre)
export class GenreRepository extends Repository<Genre> {}
