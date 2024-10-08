import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(user: Partial<User>): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new BadRequestException('Missing required fields');
    }

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUser: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUser.name === undefined && updateUser.email === undefined && updateUser.password === undefined) {
      throw new BadRequestException('At least one field (name, email, password) must be provided for update');
    }

    await this.usersRepository.update(id, updateUser);

    const updatedUser = await this.usersRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new NotFoundException(`Failed to retrieve updated user with ID ${id}`);
    }

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); 
    await this.usersRepository.delete(id);
  }
}
