import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Attempting to create user with email: ${createUserDto.email}`);
    this.logger.debug(`Received DTO: ${JSON.stringify(createUserDto)}`);
    
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        this.logger.warn(`User with email ${createUserDto.email} already exists`);
        throw new ConflictException('Данный email уже зарегистрирован');
      }
      this.logger.warn(`User with username ${createUserDto.username} already exists`);
      throw new ConflictException('Имя пользователя уже существует');
    }

    this.logger.debug(`Hashing password for user: ${createUserDto.username}`);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    this.logger.debug(`Password hashed successfully`);

    const user = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password_hash: hashedPassword,
    });
    this.logger.debug(`Created user entity: ${JSON.stringify(user)}`);

    try {
      this.logger.debug(`Attempting to save user to database...`);
      const savedUser = await this.userRepository.save(user);
      this.logger.debug(`Successfully created user with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to save user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.debug(`Attempting to validate user with email: ${email}`);
    
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user with email ${email}`);
      return null;
    }

    this.logger.debug(`Successfully validated user with email: ${email}`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
