import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITrack, Track } from '../track.model';
import { TrackService } from '../service/track.service';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

@Component({
  selector: 'jhi-track-update',
  templateUrl: './track-update.component.html',
})
export class TrackUpdateComponent implements OnInit {
  isSaving = false;

  albumsSharedCollection: IAlbum[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    album: [],
  });

  constructor(
    protected trackService: TrackService,
    protected albumService: AlbumService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ track }) => {
      this.updateForm(track);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const track = this.createFromForm();
    if (track.id !== undefined) {
      this.subscribeToSaveResponse(this.trackService.update(track));
    } else {
      this.subscribeToSaveResponse(this.trackService.create(track));
    }
  }

  trackAlbumById(index: number, item: IAlbum): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrack>>): void {
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

  protected updateForm(track: ITrack): void {
    this.editForm.patchValue({
      id: track.id,
      name: track.name,
      album: track.album,
    });

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing(this.albumsSharedCollection, track.album);
  }

  protected loadRelationshipsOptions(): void {
    this.albumService
      .query()
      .pipe(map((res: HttpResponse<IAlbum[]>) => res.body ?? []))
      .pipe(map((albums: IAlbum[]) => this.albumService.addAlbumToCollectionIfMissing(albums, this.editForm.get('album')!.value)))
      .subscribe((albums: IAlbum[]) => (this.albumsSharedCollection = albums));
  }

  protected createFromForm(): ITrack {
    return {
      ...new Track(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      album: this.editForm.get(['album'])!.value,
    };
  }
}
