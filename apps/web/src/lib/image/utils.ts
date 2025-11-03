export const extractPublicId = (url: string) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) {
      throw new Error("Invalid Cloudinary URL");
    }

    let afterUpload = parts[1];
    const versionIndex = afterUpload.indexOf("/v");
    if (versionIndex !== -1) {
      afterUpload = afterUpload.slice(versionIndex + 1);
    }

    afterUpload = afterUpload.replace(/^v[0-9]+\/?/, "");

    const withoutExtension = afterUpload.replace(/\.[^/.]+$/, "");

    return withoutExtension;
  } catch {
    throw new Error("Invalid Cloudinary URL");
  }
};
