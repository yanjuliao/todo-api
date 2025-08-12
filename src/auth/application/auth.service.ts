import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/infraestructure/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('invalid_credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}