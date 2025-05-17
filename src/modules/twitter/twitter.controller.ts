import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TwitterService } from './twitter.service';

@Controller('twitter')
@UseGuards(JwtAuthGuard)
export class TwitterController {
  constructor(private readonly twitter: TwitterService) {}

  @Get('get-tweet')
  async getTweet(@Query('tweetId') tweetId: string) {
    const tweet = await this.twitter.getTweet(tweetId);
    return tweet;
  }

  @Post('tweet')
  async tweet(@Body('text') text: string) {
    const tweetId = await this.twitter.postTweet(text);
    return { success: true, tweetId };
  }
}
