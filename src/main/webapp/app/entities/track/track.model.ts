import { IAlbum } from 'app/entities/album/album.model';

export interface ITrack {
  id?: number;
  name?: string;
  album?: IAlbum | null;
}

export class Track implements ITrack {
  constructor(public id?: number, public name?: string, public album?: IAlbum | null) {}
}

export function getTrackIdentifier(track: ITrack): number | undefined {
  return track.id;
}
