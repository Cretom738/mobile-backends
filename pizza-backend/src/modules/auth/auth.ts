import { AuthDto } from 'src/modules/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthSuccessDto } from 'src/modules/auth/dtos/auth-success.dto';

export interface IAuthService {
  register(dto: CreateUserDto): Promise<AuthSuccessDto>;

  login(dto: AuthDto): Promise<AuthSuccessDto>;

  logout(deviceId: string): Promise<void>;

  refresh(refreshToken: string): Promise<AuthSuccessDto>;
}
