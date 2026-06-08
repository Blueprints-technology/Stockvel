import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Public()
  @Post('subscribe')
  subscribe(@Body() body: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(body);
  }

  @Public()
  @Post('unsubscribe')
  unsubscribe(@Body() body: UnsubscribeNewsletterDto) {
    return this.newsletterService.unsubscribe(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('subscribers')
  subscribers() {
    return this.newsletterService.subscribers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfGuard)
  @Roles(Role.ADMIN)
  @Post('draft')
  draft(@Body() body: CreateNewsletterDto) {
    return this.newsletterService.draft(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfGuard)
  @Roles(Role.ADMIN)
  @Post('send')
  send(@Body() body: CreateNewsletterDto) {
    return this.newsletterService.send(body);
  }
}
