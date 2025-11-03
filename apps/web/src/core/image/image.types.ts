export {};

declare global {
  type GetImageSignatureInput = { isUser: boolean };
  type GetImageSignature = GetImageSignatureInput & {
    timestamp: string;
    transformation: string;
    asset_folder: string;
  };
  type ReturnImageSignature = {
    cloudName: string;
    apiKey: string;
    signature: string;
    timestamp: string;
    asset_folder: string;
    transformation: string;
  };

  type DeleteImage = string;

  type DeleteManyImages = string[];
}
