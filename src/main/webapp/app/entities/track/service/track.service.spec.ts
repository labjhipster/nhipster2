import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrack, Track } from '../track.model';

import { TrackService } from './track.service';

describe('Service Tests', () => {
  describe('Track Service', () => {
    let service: TrackService;
    let httpMock: HttpTestingController;
    let elemDefault: ITrack;
    let expectedResult: ITrack | ITrack[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TrackService);
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

      it('should create a Track', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Track()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Track', () => {
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

      it('should partial update a Track', () => {
        const patchObject = Object.assign({}, new Track());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Track', () => {
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

      it('should delete a Track', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTrackToCollectionIfMissing', () => {
        it('should add a Track to an empty array', () => {
          const track: ITrack = { id: 123 };
          expectedResult = service.addTrackToCollectionIfMissing([], track);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(track);
        });

        it('should not add a Track to an array that contains it', () => {
          const track: ITrack = { id: 123 };
          const trackCollection: ITrack[] = [
            {
              ...track,
            },
            { id: 456 },
          ];
          expectedResult = service.addTrackToCollectionIfMissing(trackCollection, track);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Track to an array that doesn't contain it", () => {
          const track: ITrack = { id: 123 };
          const trackCollection: ITrack[] = [{ id: 456 }];
          expectedResult = service.addTrackToCollectionIfMissing(trackCollection, track);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(track);
        });

        it('should add only unique Track to an array', () => {
          const trackArray: ITrack[] = [{ id: 123 }, { id: 456 }, { id: 16737 }];
          const trackCollection: ITrack[] = [{ id: 123 }];
          expectedResult = service.addTrackToCollectionIfMissing(trackCollection, ...trackArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const track: ITrack = { id: 123 };
          const track2: ITrack = { id: 456 };
          expectedResult = service.addTrackToCollectionIfMissing([], track, track2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(track);
          expect(expectedResult).toContain(track2);
        });

        it('should accept null and undefined values', () => {
          const track: ITrack = { id: 123 };
          expectedResult = service.addTrackToCollectionIfMissing([], null, track, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(track);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
