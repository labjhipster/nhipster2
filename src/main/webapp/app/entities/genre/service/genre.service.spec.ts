import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGenre, Genre } from '../genre.model';

import { GenreService } from './genre.service';

describe('Service Tests', () => {
  describe('Genre Service', () => {
    let service: GenreService;
    let httpMock: HttpTestingController;
    let elemDefault: IGenre;
    let expectedResult: IGenre | IGenre[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GenreService);
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

      it('should create a Genre', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Genre()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Genre', () => {
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

      it('should partial update a Genre', () => {
        const patchObject = Object.assign({}, new Genre());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Genre', () => {
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

      it('should delete a Genre', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGenreToCollectionIfMissing', () => {
        it('should add a Genre to an empty array', () => {
          const genre: IGenre = { id: 123 };
          expectedResult = service.addGenreToCollectionIfMissing([], genre);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(genre);
        });

        it('should not add a Genre to an array that contains it', () => {
          const genre: IGenre = { id: 123 };
          const genreCollection: IGenre[] = [
            {
              ...genre,
            },
            { id: 456 },
          ];
          expectedResult = service.addGenreToCollectionIfMissing(genreCollection, genre);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Genre to an array that doesn't contain it", () => {
          const genre: IGenre = { id: 123 };
          const genreCollection: IGenre[] = [{ id: 456 }];
          expectedResult = service.addGenreToCollectionIfMissing(genreCollection, genre);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(genre);
        });

        it('should add only unique Genre to an array', () => {
          const genreArray: IGenre[] = [{ id: 123 }, { id: 456 }, { id: 42673 }];
          const genreCollection: IGenre[] = [{ id: 123 }];
          expectedResult = service.addGenreToCollectionIfMissing(genreCollection, ...genreArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const genre: IGenre = { id: 123 };
          const genre2: IGenre = { id: 456 };
          expectedResult = service.addGenreToCollectionIfMissing([], genre, genre2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(genre);
          expect(expectedResult).toContain(genre2);
        });

        it('should accept null and undefined values', () => {
          const genre: IGenre = { id: 123 };
          expectedResult = service.addGenreToCollectionIfMissing([], null, genre, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(genre);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
