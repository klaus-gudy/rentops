import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
