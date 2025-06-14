import { ISession } from 'src/libs/ts/interfaces/session.interface';

export interface ISessionsService {
  createSession(dto: ISession): Promise<void>;

  updateSession(dto: ISession, oldTokenPairId: string): Promise<void>;

  deleteSession(deviceId: string): Promise<void>;
}
