import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IFilesService } from './files';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { IFile } from 'src/libs/ts/interfaces/file.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService implements IFilesService {
  private readonly logger: Logger = new Logger(FilesService.name);

  private readonly s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get('ACCESS_KEY_ID'),
        secretAccessKey: configService.get('SECRET_ACCESS_KEY'),
      },
      region: configService.get('REGION'),
      endpoint: configService.get('BUCKET_ENDPOINT'),
      apiVersion: 'latest',
    });
  }

  async uploadFile({
    dataBuffer,
    fileName,
    contentType,
  }: IFile): Promise<string> {
    const buckets = await this.s3.listBuckets();

    const bucketName = this.configService.get('BUCKET_NAME');

    if (!buckets?.Buckets?.some((b) => b.Name === bucketName)) {
      await this.s3.createBucket({
        Bucket: bucketName,
      });
    }

    const upload: Upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucketName,
        Body: dataBuffer,
        ContentType: contentType,
        Key: randomUUID() + '-' + fileName,
        ACL: 'public-read',
      },
    });

    try {
      const uploadResult = await upload.done();

      this.logger.debug(`file ${fileName} uploaded successfully to s3`);

      const locationUrl = new URL(
        uploadResult.Key,
        this.configService.get('IMAGES_ENDPOINT_URL'),
      );

      return locationUrl.href;
    } catch (error) {
      this.logger.error(`failed to upload file ${fileName} to s3`, error);

      throw new BadRequestException('files.upload.failed');
    }
  }
}
