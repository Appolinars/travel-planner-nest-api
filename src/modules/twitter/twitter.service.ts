import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TweetV2, TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private client: TwitterApi;

  constructor(private config: ConfigService) {
    this.client = new TwitterApi({
      appKey: this.config.get('TWITTER_API_KEY'),
      appSecret: this.config.get('TWITTER_API_SECRET'),
      accessToken: this.config.get('TWITTER_ACCESS_TOKEN'),
      accessSecret: this.config.get('TWITTER_ACCESS_SECRET'),
    });
  }

  async postTweet(text: string): Promise<string> {
    try {
      const { data } = await this.client.v2.tweet(text);
      return data.id;
    } catch (err) {
      console.log(err?.data);
      throw new InternalServerErrorException(`Failed to post tweet: ${err}`);
    }
  }

  async getTweet(tweetId: string): Promise<TweetV2> {
    try {
      const { data } = await this.client.v2.singleTweet(tweetId);
      const me = await this.client.v2.me();
      console.log('Twitter user', me?.data);
      return data;
    } catch (err) {
      console.log(err?.data);
      throw new InternalServerErrorException(`Failed to get tweet: ${err}`);
    }
  }
}
