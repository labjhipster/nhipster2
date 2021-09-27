import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from '../web/rest/album.controller';
import { AlbumRepository } from '../repository/album.repository';
import { AlbumService } from '../service/album.service';

@Module({
    imports: [TypeOrmModule.forFeature([AlbumRepository])],
    controllers: [AlbumController],
    providers: [AlbumService],
    exports: [AlbumService],
})
export class AlbumModule {}
