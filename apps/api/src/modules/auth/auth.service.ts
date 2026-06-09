// ============================================================
// Na Quadra — Auth Service
// ============================================================
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './entities/user.entity';
import { RegisterDto, LoginDto, UpdateProfileDto, UpdatePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import * as crypto from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ── Register ──
  async register(dto: RegisterDto): Promise<TokenPair> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'user',
      discoveryMode: true,
    });

    const saved = await this.userRepo.save(user);
    this.logger.log(`User registered: ${saved.email} (${saved.id})`);

    return this.generateTokenPair(saved);
  }

  // ── Login ──
  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'name', 'role', 'passwordHash'],
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    this.logger.log(`User logged in: ${user.email}`);
    return this.generateTokenPair(user);
  }

  // ── Refresh Token ──
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('auth.refreshSecret'),
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Verify the stored refresh token hash matches
      const tokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!tokenValid) {
        // Possible token reuse — invalidate all tokens
        user.refreshTokenHash = null;
        await this.userRepo.save(user);
        throw new UnauthorizedException('Refresh token já utilizado — faça login novamente');
      }

      return this.generateTokenPair(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Refresh token expirado ou inválido');
    }
  }

  // ── Logout ──
  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash: null });
    this.logger.log(`User logged out: ${userId}`);
  }

  // ── Get current user profile ──
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      avatarBase64: user.avatarBase64,
      discoveryMode: user.discoveryMode,
      onboardingCompleted: user.onboardingCompleted,
      favoriteTeamId: user.favoriteTeamId,
      followedTeamIds: user.followedTeamIds || [],
      favoritePlayerIds: user.favoritePlayerIds || [],
      createdAt: user.createdAt.toISOString(),
    };
  }

  // ── Profile Updates ──
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    if (dto.name) user.name = dto.name;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    if (dto.avatarBase64 !== undefined) user.avatarBase64 = dto.avatarBase64;

    await this.userRepo.save(user);
    return this.getProfile(userId);
  }

  // ── Password Update ──
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'passwordHash'],
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const passwordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepo.save(user);
  }

  // ── Forgot Password ──
  async requestPasswordReset(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    user.passwordResetToken = resetTokenHash;
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiration
    user.passwordResetExpires = expires;

    await this.userRepo.save(user);

    // In a real app, send email here.
    this.logger.log(`Password reset token for ${user.email}: ${resetToken}`);
    return { message: 'Se o e-mail existir, um link de recuperação foi enviado.' };
  }

  // ── Reset Password ──
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (new Date() > user.passwordResetExpires) {
      throw new UnauthorizedException('Token expirado.');
    }

    const tokenValid = await bcrypt.compare(dto.token, user.passwordResetToken);
    if (!tokenValid) {
      throw new UnauthorizedException('Token inválido.');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.userRepo.save(user);
    return { message: 'Senha redefinida com sucesso.' };
  }

  // ── Internal: Token Generation ──
  private async generateTokenPair(user: UserEntity): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = this.config.get<string>('auth.jwtSecret')!;
    const jwtExp = this.config.get<string>('auth.jwtExpiration') ?? '15m';
    const refreshSecret = this.config.get<string>('auth.refreshSecret')!;
    const refreshExp = this.config.get<string>('auth.refreshExpiration') ?? '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {
        secret: jwtSecret,
        expiresIn: jwtExp as any,
      }),
      this.jwtService.signAsync({ ...payload }, {
        secret: refreshSecret,
        expiresIn: refreshExp as any,
      }),
    ]);

    // Store hashed refresh token (rotating refresh tokens)
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, { refreshTokenHash: refreshHash });

    return { accessToken, refreshToken };
  }
}
