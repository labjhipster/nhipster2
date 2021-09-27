import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGenre, getGenreIdentifier } from '../genre.model';

export type EntityResponseType = HttpResponse<IGenre>;
export type EntityArrayResponseType = HttpResponse<IGenre[]>;

@Injectable({ providedIn: 'root' })
export class GenreService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/genres');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(genre: IGenre): Observable<EntityResponseType> {
    return this.http.post<IGenre>(this.resourceUrl, genre, { observe: 'response' });
  }

  update(genre: IGenre): Observable<EntityResponseType> {
    return this.http.put<IGenre>(`${this.resourceUrl}/${getGenreIdentifier(genre) as number}`, genre, { observe: 'response' });
  }

  partialUpdate(genre: IGenre): Observable<EntityResponseType> {
    return this.http.patch<IGenre>(`${this.resourceUrl}/${getGenreIdentifier(genre) as number}`, genre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGenre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGenre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGenreToCollectionIfMissing(genreCollection: IGenre[], ...genresToCheck: (IGenre | null | undefined)[]): IGenre[] {
    const genres: IGenre[] = genresToCheck.filter(isPresent);
    if (genres.length > 0) {
      const genreCollectionIdentifiers = genreCollection.map(genreItem => getGenreIdentifier(genreItem)!);
      const genresToAdd = genres.filter(genreItem => {
        const genreIdentifier = getGenreIdentifier(genreItem);
        if (genreIdentifier == null || genreCollectionIdentifiers.includes(genreIdentifier)) {
          return false;
        }
        genreCollectionIdentifiers.push(genreIdentifier);
        return true;
      });
      return [...genresToAdd, ...genreCollection];
    }
    return genreCollection;
  }
}
