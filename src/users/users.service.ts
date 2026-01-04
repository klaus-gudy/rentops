import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    async createUser(email: string, passwordHash: string, firstName: string, lastName: string): Promise<User> {
        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(passwordHash, 10);
        const newUser = this.userRepository.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
        });
        return this.userRepository.save(newUser);
    }
}
