import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [NestJwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [NestJwtModule],
})
export class JwtModule {}