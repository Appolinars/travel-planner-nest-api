import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { IAppConfig } from 'src/config/configuration.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { EAuthProvider } from 'src/shared/types/auth.types';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { GoogleUserDto } from './dto/google-auth.dto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from './types/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<IAppConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async verifyUserLogin(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async login(user: User, response: Response) {
    try {
      const { accessToken, expiresAccessToken } = this.createAccessToken(
        user.id,
      );
      const { refreshToken, expiresRefreshToken } =
        await this.createRefreshToken(user);

      response.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresAccessToken,
      });
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresRefreshToken,
      });

      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async googleLogin(googleUser: GoogleUserDto, response: Response) {
    try {
      const user = await this.usersService.findByEmail(googleUser.email);

      if (user) {
        return this.login(user, response);
      }

      const newUser = await this.userRepository.save({
        username: googleUser.displayName,
        email: googleUser.email,
        provider: EAuthProvider.GOOGLE,
      });

      return this.login(newUser, response);
    } catch {
      throw new BadRequestException();
    }
  }

  async verifyRefreshToken(userId: number, tokenId: string) {
    try {
      const token =
        await this.refreshTokenRepository.findTokenByTokenId(tokenId);

      if (!token || token.user.id !== userId) {
        throw new UnauthorizedException('Refresh token is invalid.');
      }

      return token.user;
    } catch {
      throw new UnauthorizedException('Refresh token is invalid.');
    }
  }

  private getTokenExpirationTime(expirationTimeMs: number) {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + expirationTimeMs);
    return expiresDate;
  }

  private createAccessToken(userId: number) {
    const expiresAccessToken = this.getTokenExpirationTime(
      this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME_MS'),
    );

    const accessTokenPayload: IAccessTokenPayload = {
      userId,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_EXPIRATION_TIME_MS',
      )}ms`,
    });

    return { accessToken, expiresAccessToken };
  }

  private async createRefreshToken(user: User) {
    const expiresRefreshToken = this.getTokenExpirationTime(
      this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_TIME_MS'),
    );

    const refreshTokenId = uuidv4();

    const refreshTokenPayload: IRefreshTokenPayload = {
      userId: user.id,
      tokenId: refreshTokenId,
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_EXPIRATION_TIME_MS',
      )}ms`,
    });

    await this.refreshTokenRepository.createRefreshToken(
      user,
      refreshToken,
      refreshTokenId,
      expiresRefreshToken,
    );

    return { refreshToken, expiresRefreshToken };
  }
}
