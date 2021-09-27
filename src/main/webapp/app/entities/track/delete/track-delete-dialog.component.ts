import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrack } from '../track.model';
import { TrackService } from '../service/track.service';

@Component({
  templateUrl: './track-delete-dialog.component.html',
})
export class TrackDeleteDialogComponent {
  track?: ITrack;

  constructor(protected trackService: TrackService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trackService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
