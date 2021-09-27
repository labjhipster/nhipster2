import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistController } from '../web/rest/artist.controller';
import { ArtistRepository } from '../repository/artist.repository';
import { ArtistService } from '../service/artist.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArtistRepository])],
    controllers: [ArtistController],
    providers: [ArtistService],
    exports: [ArtistService],
})
export class ArtistModule {}
