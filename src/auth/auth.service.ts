import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  private readonly adminUser = {
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASS,
  };

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    if (
      username === this.adminUser.username &&
      password === this.adminUser.password
    ) {
      return { username };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
