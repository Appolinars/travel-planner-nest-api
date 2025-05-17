import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'src/config/configuration.interface';
import { TweetV2, TwitterApi } from 'twitter-api-v2';

import { ItinerariesService } from '../itineraries/services/itineraries.service';

@Injectable()
export class TwitterService {
  private client: TwitterApi;

  constructor(
    private config: ConfigService<IAppConfig>,
    @Inject() private readonly itinerariesService: ItinerariesService,
  ) {
    this.client = new TwitterApi({
      appKey: this.config.get('TWITTER_API_KEY'),
      appSecret: this.config.get('TWITTER_API_SECRET'),
      accessToken: this.config.get('TWITTER_ACCESS_TOKEN'),
      accessSecret: this.config.get('TWITTER_ACCESS_SECRET'),
    });
  }

  async postItineraryTweet(itineraryId: number): Promise<string> {
    try {
      const itinerary = await this.itinerariesService.findOne(itineraryId);
      const { data } = await this.client.v2.tweet(
        `${itinerary.title} - ${itinerary.description}`,
      );
      return data.id;
    } catch (err) {
      console.log(err?.data);
      throw new InternalServerErrorException(`Failed to post tweet: ${err}`);
    }
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
