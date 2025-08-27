import type { ImagePickerAsset } from "expo-image-picker";
import type {
  DocumentPickerResult,
  DocumentPickerAsset,
} from "expo-document-picker";

export type MediaFile = {
  uri: string;
  type?: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

export type MediaPickerResult =
  | ImagePickerAsset
  | DocumentPickerAsset
  | MediaFile;
