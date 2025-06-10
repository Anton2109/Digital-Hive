import { ConflictException, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
      role: createUserDto.role || 'user'
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
    this.logger.debug(`Found user: ${JSON.stringify(user)}`);

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

  async update(id: number, updateData: Partial<User>): Promise<User> {
    this.logger.debug(`Attempting to update user with ID: ${id}`);
    const user = await this.findById(id);
    
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new Error('User not found');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, currentEmail: string): Promise<User> {
    this.logger.debug('Начало обновления профиля:', {
      currentEmail,
      updateData: {
        ...updateProfileDto,
        currentPassword: '***' // Скрываем пароль в логах
      }
    });

    const { email, username, currentPassword, newPassword } = updateProfileDto;

    // Находим пользователя по текущему email из токена
    const currentUser = await this.userRepository.findOne({
      where: { email: currentEmail }
    });

    if (!currentUser) {
      this.logger.warn(`Пользователь с email ${currentEmail} не найден`);
      throw new NotFoundException('User not found');
    }

    this.logger.debug('Найден текущий пользователь:', {
      id: currentUser.id,
      email: currentUser.email,
      username: currentUser.username
    });

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password_hash);
    if (!isPasswordValid) {
      this.logger.warn(`Неверный пароль для пользователя с email ${currentEmail}`);
      throw new BadRequestException('Current password is incorrect');
    }

    this.logger.debug('Пароль подтвержден');

    // Проверяем, не занят ли новый email другим пользователем
    if (email !== currentEmail) {
      this.logger.debug(`Проверка доступности нового email: ${email}`);
      const existingUser = await this.findByEmail(email);
      if (existingUser && existingUser.id !== currentUser.id) {
        this.logger.warn(`Email ${email} уже занят другим пользователем`);
        throw new BadRequestException('Email is already taken');
      }
    }

    // Обновляем данные пользователя
    currentUser.email = email;
    currentUser.username = username;

    // Если указан новый пароль, обновляем его
    if (newPassword) {
      this.logger.debug('Обновление пароля пользователя');
      currentUser.password_hash = await bcrypt.hash(newPassword, 10);
    }

    try {
      const updatedUser = await this.userRepository.save(currentUser);
      this.logger.debug('Профиль успешно обновлен:', {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username
      });
      return updatedUser;
    } catch (error) {
      this.logger.error('Ошибка при сохранении обновленного профиля:', {
        error: error.message,
        stack: error.stack
      });
      throw new BadRequestException('Failed to update profile');
    }
  }
}
