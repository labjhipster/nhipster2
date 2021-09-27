export interface IGenre {
  id?: number;
  name?: string;
}

export class Genre implements IGenre {
  constructor(public id?: number, public name?: string) {}
}

export function getGenreIdentifier(genre: IGenre): number | undefined {
  return genre.id;
}
