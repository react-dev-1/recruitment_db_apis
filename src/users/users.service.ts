import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User as UserEntity } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { randomBytes, scrypt } from "crypto";

type UserResponse = Pick<
    UserEntity,
    'id' | 'email' | 'first_name' | 'last_name' | 'role' | 'is_active' | 'created_at' 
>;

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`scrypt$${salt.toString('hex')}$${derivedKey.toString('hex')}`);
    });
  });
}

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    private toUserResponse(user: UserEntity): UserResponse {
        return {
            id: user.id, 
            email: user.email, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            role: user.role, 
            is_active: user.is_active, 
            created_at: user.created_at,
        }
    }

    private async getUserEntityById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ id });

        if(!user) {
            throw new NotFoundException(`User with ${id} not found`);
        }

        return user;
    }

    async getUserById(id: number): Promise<UserResponse> {
        return this.toUserResponse(await this.getUserEntityById(id));
    }

    async getAllUsers(): Promise<UserResponse[]> {
        const users = await this.userRepository.find();
        return users.map((user) => this.toUserResponse(user));
    }

    async emailNotTaken(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOneBy({ email });

        if (existingUser) {
            throw new ConflictException(`User with email ${email} already exists`)
        }
    }

    async createUser(dto: CreateUserDTO): Promise<UserResponse> {
        await this.emailNotTaken(dto.email);

        const user = await this.userRepository.create({
            email: dto.email, 
            password_hash: dto.password ? await hashPassword(dto.password) : null,
            first_name: dto.first_name, 
            last_name: dto.last_name, 
            role: dto.role, 
            is_active: true, 
        })

        return this.toUserResponse(await this.userRepository.save(user));
    }

    async updateUser(id: number, dto: UpdateUserDTO): Promise<UserResponse> {
        const user = await this.getUserEntityById(id);

        if (dto.email !== undefined) {
            await this.emailNotTaken(dto.email);
        }
        
        Object.assign(user, {
            ...(dto.email !== undefined && {email: dto.email}), 
            ...(dto.first_name !== undefined && {first_name: dto.first_name}), 
            ...(dto.last_name !== undefined && {last_name: dto.last_name}), 
            ...(dto.role !== undefined && {role: dto.role}), 
            ...(dto.is_active !== undefined && {is_active: dto.is_active})
        });

        return this.toUserResponse(await this.userRepository.save(user))
    }

    async deleteUser(id: number): Promise<UserResponse> {
        const user = await this.getUserEntityById(id);
        await this.userRepository.remove(user);
        return this.toUserResponse(user);
    }
}


