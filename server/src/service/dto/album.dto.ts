/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ArtistDTO } from './artist.dto';
import { GenreDTO } from './genre.dto';
import { TrackDTO } from './track.dto';

/**
 * A AlbumDTO object.
 */
export class AlbumDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @ApiModelProperty({ type: ArtistDTO, description: 'artist relationship' })
    artist: ArtistDTO;

    @ApiModelProperty({ type: GenreDTO, description: 'genre relationship' })
    genre: GenreDTO;

    @ApiModelProperty({ type: TrackDTO, isArray: true, description: 'tracks relationship' })
    tracks: TrackDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
