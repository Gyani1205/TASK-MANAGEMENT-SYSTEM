import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID:
        config.get<string>('GOOGLE_CLIENT_ID') ||
        'test-google-client-id',

      clientSecret:
        config.get<string>('GOOGLE_CLIENT_SECRET') ||
        'test-google-client-secret',

      callbackURL:
        config.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:4000/api/v1/auth/google/callback',

      scope: ['email', 'profile'],
    });
  }
}