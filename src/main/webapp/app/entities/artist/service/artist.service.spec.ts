import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArtist, Artist } from '../artist.model';

import { ArtistService } from './artist.service';

describe('Service Tests', () => {
  describe('Artist Service', () => {
    let service: ArtistService;
    let httpMock: HttpTestingController;
    let elemDefault: IArtist;
    let expectedResult: IArtist | IArtist[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArtistService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Artist', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Artist()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Artist', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Artist', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Artist()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Artist', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Artist', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArtistToCollectionIfMissing', () => {
        it('should add a Artist to an empty array', () => {
          const artist: IArtist = { id: 123 };
          expectedResult = service.addArtistToCollectionIfMissing([], artist);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artist);
        });

        it('should not add a Artist to an array that contains it', () => {
          const artist: IArtist = { id: 123 };
          const artistCollection: IArtist[] = [
            {
              ...artist,
            },
            { id: 456 },
          ];
          expectedResult = service.addArtistToCollectionIfMissing(artistCollection, artist);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Artist to an array that doesn't contain it", () => {
          const artist: IArtist = { id: 123 };
          const artistCollection: IArtist[] = [{ id: 456 }];
          expectedResult = service.addArtistToCollectionIfMissing(artistCollection, artist);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artist);
        });

        it('should add only unique Artist to an array', () => {
          const artistArray: IArtist[] = [{ id: 123 }, { id: 456 }, { id: 3777 }];
          const artistCollection: IArtist[] = [{ id: 123 }];
          expectedResult = service.addArtistToCollectionIfMissing(artistCollection, ...artistArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const artist: IArtist = { id: 123 };
          const artist2: IArtist = { id: 456 };
          expectedResult = service.addArtistToCollectionIfMissing([], artist, artist2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artist);
          expect(expectedResult).toContain(artist2);
        });

        it('should accept null and undefined values', () => {
          const artist: IArtist = { id: 123 };
          expectedResult = service.addArtistToCollectionIfMissing([], null, artist, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artist);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
