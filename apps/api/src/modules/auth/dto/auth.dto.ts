// ============================================================
// Na Quadra — DTOs: Auth
// ============================================================
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'fan@naquadra.com.br' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SenhaSegura123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'João da Quadra' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'joao@naquadra.com.br' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SenhaSegura123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
