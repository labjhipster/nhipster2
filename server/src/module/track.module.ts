import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from '../web/rest/track.controller';
import { TrackRepository } from '../repository/track.repository';
import { TrackService } from '../service/track.service';

@Module({
    imports: [TypeOrmModule.forFeature([TrackRepository])],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService],
})
export class TrackModule {}
