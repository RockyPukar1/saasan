import { HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RegisterUserDto } from '../dtos/register.dto';
import { PASSWORD_SALT } from 'src/user/entities/user.entity';
import { LoginUserDto } from '../dtos/login.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { AuthHelper } from 'src/common/helpers/auth.helper';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}
  async register(userData: RegisterUserDto) {
    const doesUserExists = await this.doesUserExists(userData.email).lean();
    if (doesUserExists) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, PASSWORD_SALT);
    userData.password = hashedPassword;

    const user = await this.userRepo.create(userData);

    this.userRepo.updateLastActive(user._id.toString());

    const accessToken = AuthHelper.generateToken(user);
    const refreshToken = AuthHelper.generateRefreshToken(user._id.toString());

    return ResponseHelper.success(
      {
        user,
        accessToken,
        refreshToken,
      },
      'User registered successfully',
    );
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.doesUserExists({ email }).lean();
    if (!user) {
      throw new GlobalHttpException('userDoesNotExists', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await AuthHelper.comparePassword(
      password,
      user.password || '',
    );
    if (!isValidPassword) {
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);
    }

    this.userRepo.updateLastActive(user._id.toString());

    const accessToken = AuthHelper.generateToken(user);
    const refreshToken = AuthHelper.generateRefreshToken(user._id.toString());

    return ResponseHelper.success(
      {
        user,
        accessToken,
        refreshToken,
      },
      'User logged in successfully',
    );
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }
}
