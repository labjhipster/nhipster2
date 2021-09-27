export interface IArtist {
  id?: number;
  name?: string;
}

export class Artist implements IArtist {
  constructor(public id?: number, public name?: string) {}
}

export function getArtistIdentifier(artist: IArtist): number | undefined {
  return artist.id;
}
