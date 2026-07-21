import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.googleClient = new OAuth2Client(this.config.get<string>('GOOGLE_WEB_CLIENT_ID'));
  }

  async loginWithGoogle(idToken: string) {
    const payload = await this.verificarIdToken(idToken);

    const user = await this.prisma.user.upsert({
      where: { googleId: payload.sub },
      update: { email: payload.email!, name: payload.name },
      create: { googleId: payload.sub, email: payload.email!, name: payload.name },
    });

    const accessToken = await this.jwt.signAsync({ sub: user.id });
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, pro: user.proAtivo },
    };
  }

  // O Web Client ID é o "audience" esperado no token — o app Android pede
  // o ID token usando esse mesmo Client ID como serverClientId, senão a
  // verificação abaixo falha mesmo com um login legítimo.
  private async verificarIdToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.config.get<string>('GOOGLE_WEB_CLIENT_ID'),
    }).catch(() => null);

    const payload = ticket?.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Token do Google inválido');
    }
    return payload;
  }
}
