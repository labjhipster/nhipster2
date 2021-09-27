import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAlbum, Album } from '../album.model';
import { AlbumService } from '../service/album.service';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';

@Component({
  selector: 'jhi-album-update',
  templateUrl: './album-update.component.html',
})
export class AlbumUpdateComponent implements OnInit {
  isSaving = false;

  artistsCollection: IArtist[] = [];
  genresCollection: IGenre[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    artist: [],
    genre: [],
  });

  constructor(
    protected albumService: AlbumService,
    protected artistService: ArtistService,
    protected genreService: GenreService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ album }) => {
      this.updateForm(album);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const album = this.createFromForm();
    if (album.id !== undefined) {
      this.subscribeToSaveResponse(this.albumService.update(album));
    } else {
      this.subscribeToSaveResponse(this.albumService.create(album));
    }
  }

  trackArtistById(index: number, item: IArtist): number {
    return item.id!;
  }

  trackGenreById(index: number, item: IGenre): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbum>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(album: IAlbum): void {
    this.editForm.patchValue({
      id: album.id,
      name: album.name,
      artist: album.artist,
      genre: album.genre,
    });

    this.artistsCollection = this.artistService.addArtistToCollectionIfMissing(this.artistsCollection, album.artist);
    this.genresCollection = this.genreService.addGenreToCollectionIfMissing(this.genresCollection, album.genre);
  }

  protected loadRelationshipsOptions(): void {
    this.artistService
      .query({ filter: 'album-is-null' })
      .pipe(map((res: HttpResponse<IArtist[]>) => res.body ?? []))
      .pipe(map((artists: IArtist[]) => this.artistService.addArtistToCollectionIfMissing(artists, this.editForm.get('artist')!.value)))
      .subscribe((artists: IArtist[]) => (this.artistsCollection = artists));

    this.genreService
      .query({ filter: 'album-is-null' })
      .pipe(map((res: HttpResponse<IGenre[]>) => res.body ?? []))
      .pipe(map((genres: IGenre[]) => this.genreService.addGenreToCollectionIfMissing(genres, this.editForm.get('genre')!.value)))
      .subscribe((genres: IGenre[]) => (this.genresCollection = genres));
  }

  protected createFromForm(): IAlbum {
    return {
      ...new Album(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      artist: this.editForm.get(['artist'])!.value,
      genre: this.editForm.get(['genre'])!.value,
    };
  }
}
