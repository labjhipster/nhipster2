import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TrackDTO } from '../../service/dto/track.dto';
import { TrackService } from '../../service/track.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tracks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('tracks')
export class TrackController {
    logger = new Logger('TrackController');

    constructor(private readonly trackService: TrackService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TrackDTO,
    })
    async getAll(@Req() req: Request): Promise<TrackDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.trackService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: TrackDTO,
    })
    async getOne(@Param('id') id: number): Promise<TrackDTO> {
        return await this.trackService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create track' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TrackDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() trackDTO: TrackDTO): Promise<TrackDTO> {
        const created = await this.trackService.save(trackDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Track', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update track' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TrackDTO,
    })
    async put(@Req() req: Request, @Body() trackDTO: TrackDTO): Promise<TrackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Track', trackDTO.id);
        return await this.trackService.update(trackDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update track with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TrackDTO,
    })
    async putId(@Req() req: Request, @Body() trackDTO: TrackDTO): Promise<TrackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Track', trackDTO.id);
        return await this.trackService.update(trackDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete track' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Track', id);
        return await this.trackService.deleteById(id);
    }
}
