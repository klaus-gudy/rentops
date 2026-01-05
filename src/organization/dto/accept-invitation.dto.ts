import { IsEmail, IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
