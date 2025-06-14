import { ERole, User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UpdateCurrentUserDto } from './dtos/update-current-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterUsersDto } from './dtos/filter-users.dto';

export interface IUsersService {
  createUser(dto: CreateUserDto): Promise<{ id: number; role: ERole }>;

  findUsers(filterData: FilterUsersDto): Promise<[User[], number]>;

  findUserById(id: number): Promise<User>;

  findUserByEmail(email: string): Promise<{
    id: number;
    role: ERole;
    hashedPassword: string;
  }>;

  updateUser(id: number, dto: UpdateUserDto): Promise<void>;

  updateCurrentUser(id: number, dto: UpdateCurrentUserDto): Promise<void>;

  removeUser(id: number): Promise<void>;
}
