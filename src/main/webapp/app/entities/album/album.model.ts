import { IArtist } from 'app/entities/artist/artist.model';
import { IGenre } from 'app/entities/genre/genre.model';
import { ITrack } from 'app/entities/track/track.model';

export interface IAlbum {
  id?: number;
  name?: string;
  artist?: IArtist | null;
  genre?: IGenre | null;
  tracks?: ITrack[] | null;
}

export class Album implements IAlbum {
  constructor(
    public id?: number,
    public name?: string,
    public artist?: IArtist | null,
    public genre?: IGenre | null,
    public tracks?: ITrack[] | null
  ) {}
}

export function getAlbumIdentifier(album: IAlbum): number | undefined {
  return album.id;
}
