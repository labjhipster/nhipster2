import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArtist, getArtistIdentifier } from '../artist.model';

export type EntityResponseType = HttpResponse<IArtist>;
export type EntityArrayResponseType = HttpResponse<IArtist[]>;

@Injectable({ providedIn: 'root' })
export class ArtistService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/artists');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(artist: IArtist): Observable<EntityResponseType> {
    return this.http.post<IArtist>(this.resourceUrl, artist, { observe: 'response' });
  }

  update(artist: IArtist): Observable<EntityResponseType> {
    return this.http.put<IArtist>(`${this.resourceUrl}/${getArtistIdentifier(artist) as number}`, artist, { observe: 'response' });
  }

  partialUpdate(artist: IArtist): Observable<EntityResponseType> {
    return this.http.patch<IArtist>(`${this.resourceUrl}/${getArtistIdentifier(artist) as number}`, artist, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArtist>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArtist[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArtistToCollectionIfMissing(artistCollection: IArtist[], ...artistsToCheck: (IArtist | null | undefined)[]): IArtist[] {
    const artists: IArtist[] = artistsToCheck.filter(isPresent);
    if (artists.length > 0) {
      const artistCollectionIdentifiers = artistCollection.map(artistItem => getArtistIdentifier(artistItem)!);
      const artistsToAdd = artists.filter(artistItem => {
        const artistIdentifier = getArtistIdentifier(artistItem);
        if (artistIdentifier == null || artistCollectionIdentifiers.includes(artistIdentifier)) {
          return false;
        }
        artistCollectionIdentifiers.push(artistIdentifier);
        return true;
      });
      return [...artistsToAdd, ...artistCollection];
    }
    return artistCollection;
  }
}
