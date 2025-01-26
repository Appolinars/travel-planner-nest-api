import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { GoogleUserDto } from '../dto/google-auth.dto';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    // _done: VerifyCallback, from passport-google-oauth20
  ) {
    const { emails, photos } = profile;
    const user: GoogleUserDto = {
      email: emails[0].value,
      displayName: profile.displayName,
      avatar: photos?.[0]?.value || null,
    };
    // done(null, user);
    return user;
  }
}
