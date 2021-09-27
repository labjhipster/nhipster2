import { EntityRepository, Repository } from 'typeorm';
import { Track } from '../domain/track.entity';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {}
