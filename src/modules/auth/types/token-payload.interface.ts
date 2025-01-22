export interface IAccessTokenPayload {
  userId: number;
}

export interface IRefreshTokenPayload {
  userId: number;
  tokenId: string;
}
