import type { Request } from 'express';
import type { Child } from '../../generated/prisma/client';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface ParentTokenPayload {
  sub: string;
  scope: 'parent';
}

/** Request después de pasar por JwtAuthGuard (y opcionalmente ChildAccessGuard). */
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
  child?: Child;
}
