import { IFile } from 'src/libs/ts/interfaces/file.interface';

export interface IFilesService {
  uploadFile(file: IFile): Promise<string>;
}
