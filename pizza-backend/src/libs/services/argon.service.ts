import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonService {
  async hash(data: string): Promise<string> {
    return data ? argon2.hash(data) : undefined;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    try {
      return argon2.verify(hash, data);
    } catch (error) {
      return false;
    }
  }
}
