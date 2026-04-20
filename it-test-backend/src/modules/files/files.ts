import { IFile } from '../../libs/ts/interfaces/file.interface';

export interface IFilesService {
  uploadFile(file: IFile): Promise<string>;
}
