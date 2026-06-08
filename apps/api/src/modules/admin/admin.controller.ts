import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  overview() {
    return this.adminService.overview();
  }

  @Get('users')
  users() {
    return this.adminService.users();
  }

  @Get('comments')
  comments(@Query('moderated') moderated?: string) {
    return this.adminService.comments(moderated);
  }

  @Get('newsletter/history')
  newsletters() {
    return this.adminService.newsletters();
  }

  @Get('newsletter/subscribers')
  subscribers() {
    return this.adminService.subscribers();
  }

  @Get('providers/status')
  providerStatus() {
    return this.adminService.providerStatus();
  }

  @UseGuards(CsrfGuard)
  @Patch('comments/moderate')
  moderateComment(@Body() body: { commentId: string; isModerated: boolean }) {
    return this.adminService.moderateComment(body.commentId, body.isModerated);
  }

  @UseGuards(CsrfGuard)
  @Post('news/publish')
  publishNews(@Body() body: Record<string, unknown>) {
    return this.adminService.publishNews(body);
  }
}
