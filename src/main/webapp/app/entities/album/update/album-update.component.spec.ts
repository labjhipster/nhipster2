jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AlbumService } from '../service/album.service';
import { IAlbum, Album } from '../album.model';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';

import { AlbumUpdateComponent } from './album-update.component';

describe('Component Tests', () => {
  describe('Album Management Update Component', () => {
    let comp: AlbumUpdateComponent;
    let fixture: ComponentFixture<AlbumUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let albumService: AlbumService;
    let artistService: ArtistService;
    let genreService: GenreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AlbumUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AlbumUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AlbumUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      albumService = TestBed.inject(AlbumService);
      artistService = TestBed.inject(ArtistService);
      genreService = TestBed.inject(GenreService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call artist query and add missing value', () => {
        const album: IAlbum = { id: 456 };
        const artist: IArtist = { id: 63356 };
        album.artist = artist;

        const artistCollection: IArtist[] = [{ id: 746 }];
        spyOn(artistService, 'query').and.returnValue(of(new HttpResponse({ body: artistCollection })));
        const expectedCollection: IArtist[] = [artist, ...artistCollection];
        spyOn(artistService, 'addArtistToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ album });
        comp.ngOnInit();

        expect(artistService.query).toHaveBeenCalled();
        expect(artistService.addArtistToCollectionIfMissing).toHaveBeenCalledWith(artistCollection, artist);
        expect(comp.artistsCollection).toEqual(expectedCollection);
      });

      it('Should call genre query and add missing value', () => {
        const album: IAlbum = { id: 456 };
        const genre: IGenre = { id: 34935 };
        album.genre = genre;

        const genreCollection: IGenre[] = [{ id: 97047 }];
        spyOn(genreService, 'query').and.returnValue(of(new HttpResponse({ body: genreCollection })));
        const expectedCollection: IGenre[] = [genre, ...genreCollection];
        spyOn(genreService, 'addGenreToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ album });
        comp.ngOnInit();

        expect(genreService.query).toHaveBeenCalled();
        expect(genreService.addGenreToCollectionIfMissing).toHaveBeenCalledWith(genreCollection, genre);
        expect(comp.genresCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const album: IAlbum = { id: 456 };
        const artist: IArtist = { id: 26316 };
        album.artist = artist;
        const genre: IGenre = { id: 49939 };
        album.genre = genre;

        activatedRoute.data = of({ album });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(album));
        expect(comp.artistsCollection).toContain(artist);
        expect(comp.genresCollection).toContain(genre);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const album = { id: 123 };
        spyOn(albumService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ album });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: album }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(albumService.update).toHaveBeenCalledWith(album);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const album = new Album();
        spyOn(albumService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ album });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: album }));
        saveSubject.complete();

        // THEN
        expect(albumService.create).toHaveBeenCalledWith(album);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const album = { id: 123 };
        spyOn(albumService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ album });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(albumService.update).toHaveBeenCalledWith(album);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackArtistById', () => {
        it('Should return tracked Artist primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackArtistById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackGenreById', () => {
        it('Should return tracked Genre primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackGenreById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
