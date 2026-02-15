import { FileTypeEnum } from 'src/report/entities/evidence.entity';

export function getFileType(mimeType: string): FileTypeEnum {
  if (mimeType.startsWith('image')) return FileTypeEnum.IMAGE;
  if (mimeType.startsWith('video')) return FileTypeEnum.VIDEO;
  if (mimeType.startsWith('audio')) return FileTypeEnum.AUDIO;
  return FileTypeEnum.DOCUMENT;
}
