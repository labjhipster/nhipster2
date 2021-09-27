/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AlbumDTO } from './album.dto';

/**
 * A TrackDTO object.
 */
export class TrackDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @ApiModelProperty({ type: AlbumDTO, description: 'album relationship' })
    album: AlbumDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
