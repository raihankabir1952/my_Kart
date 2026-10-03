import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: any,
    @Body()
    body: {
      name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.id, body);
  }
}
