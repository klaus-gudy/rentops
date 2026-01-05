import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from 'src/organization/organization.service';
import { AcceptInvitationDto } from 'src/organization/dto/accept-invitation.dto';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly organizationService: OrganizationService 
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName
    });

    await this.userRepo.save(user);

    await this.organizationService.createOrganizationForOwner(user, { name: dto.organizationName });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return this.signToken(user);
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already exists. Please login instead.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.userRepo.save(user);

    await this.organizationService.activateInvitation(
      dto.email,
      user,
    );

    return this.signToken(user);
  }

  private signToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.configService.get('JWT_SECRET');
    console.log('Using JWT secret (length):', secret?.length);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
