import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get()
  list(@Query('assetType') assetType: 'STOCK' | 'CRYPTO', @Query('assetSymbol') assetSymbol: string) {
    return this.commentsService.list(assetType, assetSymbol);
  }

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @ApiBearerAuth()
  @Post('create')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @ApiBearerAuth()
  @Post('reply/:commentId')
  reply(@CurrentUser() user: AuthenticatedUser, @Param('commentId') commentId: string, @Body() dto: ReplyCommentDto) {
    return this.commentsService.reply(user.sub, commentId, dto.content);
  }

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @ApiBearerAuth()
  @Patch('upvote/:commentId')
  upvote(@Param('commentId') commentId: string) {
    return this.commentsService.upvote(commentId);
  }
}
