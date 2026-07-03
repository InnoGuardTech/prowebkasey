import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() req) {
    // In a real application, you'd have guards to ensure only managers can register new users
    const { password, ...userData } = req;
    const user = await this.authService.register(userData, password);
    // Remove password hash from response
    const { password_hash, ...result } = user;
    return result;
  }
}
