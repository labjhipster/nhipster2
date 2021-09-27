jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TrackService } from '../service/track.service';
import { ITrack, Track } from '../track.model';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

import { TrackUpdateComponent } from './track-update.component';

describe('Component Tests', () => {
  describe('Track Management Update Component', () => {
    let comp: TrackUpdateComponent;
    let fixture: ComponentFixture<TrackUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let trackService: TrackService;
    let albumService: AlbumService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TrackUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TrackUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TrackUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      trackService = TestBed.inject(TrackService);
      albumService = TestBed.inject(AlbumService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Album query and add missing value', () => {
        const track: ITrack = { id: 456 };
        const album: IAlbum = { id: 59646 };
        track.album = album;

        const albumCollection: IAlbum[] = [{ id: 74519 }];
        spyOn(albumService, 'query').and.returnValue(of(new HttpResponse({ body: albumCollection })));
        const additionalAlbums = [album];
        const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
        spyOn(albumService, 'addAlbumToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ track });
        comp.ngOnInit();

        expect(albumService.query).toHaveBeenCalled();
        expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(albumCollection, ...additionalAlbums);
        expect(comp.albumsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const track: ITrack = { id: 456 };
        const album: IAlbum = { id: 24592 };
        track.album = album;

        activatedRoute.data = of({ track });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(track));
        expect(comp.albumsSharedCollection).toContain(album);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const track = { id: 123 };
        spyOn(trackService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ track });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: track }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(trackService.update).toHaveBeenCalledWith(track);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const track = new Track();
        spyOn(trackService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ track });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: track }));
        saveSubject.complete();

        // THEN
        expect(trackService.create).toHaveBeenCalledWith(track);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const track = { id: 123 };
        spyOn(trackService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ track });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(trackService.update).toHaveBeenCalledWith(track);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAlbumById', () => {
        it('Should return tracked Album primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAlbumById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
