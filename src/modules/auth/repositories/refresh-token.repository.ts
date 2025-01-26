import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(
    user: User,
    token: string,
    tokenId: string,
    expiresAt: Date,
  ) {
    const refreshToken = this.refreshTokenRepository.create({
      user,
      token_id: tokenId,
      refresh_token: token,
      expires_at: expiresAt,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findTokenByTokenId(tokenId: string) {
    return this.refreshTokenRepository.findOne({
      where: { token_id: tokenId },
      relations: ['user'],
    });
  }

  async deleteToken(token: string) {
    await this.refreshTokenRepository.delete({ refresh_token: token });
  }

  async deleteTokenById(tokenId: string) {
    await this.refreshTokenRepository.delete({ token_id: tokenId });
  }

  async deleteTokensByUser(userId: number) {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
