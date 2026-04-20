import { AuthDto } from '../../modules/auth/dtos/auth.dto';
import { CreateUserDto } from '../../modules/users/dtos/create-user.dto';
import { AuthSuccessDto } from '../../modules/auth/dtos/auth-success.dto';

export interface IAuthService {
  register(dto: CreateUserDto): Promise<AuthSuccessDto>;

  login(dto: AuthDto): Promise<AuthSuccessDto>;

  logout(deviceId: string): Promise<void>;

  refresh(refreshToken: string): Promise<AuthSuccessDto>;
}
