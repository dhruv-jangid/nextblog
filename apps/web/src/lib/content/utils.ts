export const replaceImageUrls = (
  content: BlogContent,
  replacements: Record<string, string>
): BlogContent => {
  const safeContent = JSON.parse(JSON.stringify(content));

  const processNode = (node: BlogContent): BlogContent => {
    if (!node || typeof node !== "object") {
      return node;
    }

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      replacements[node.attrs.src]
    ) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: replacements[node.attrs.src],
        },
      };
    }

    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map((child) => processNode(child)),
      };
    }

    return node;
  };

  return processNode(safeContent);
};

const base64ToFile = (base64: string, filename: string) => {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binaryString = atob(data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
};
export const extractImages = (content: BlogContent) => {
  const images: File[] = [];
  const base64Urls: string[] = [];
  const processedUrls = new Set<string>();
  let imageCounter = 0;

  const processNode = (node: BlogContent) => {
    if (!node || typeof node !== "object") return;

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      node.attrs.src.startsWith("data:image/") &&
      !processedUrls.has(node.attrs.src)
    ) {
      try {
        const mimeType = node.attrs.src.split(";")[0].split("/")[1] || "jpeg";
        const filename = `image-${++imageCounter}-${Date.now()}.${mimeType}`;

        const file = base64ToFile(node.attrs.src, filename);
        images.push(file);
        base64Urls.push(node.attrs.src);
        processedUrls.add(node.attrs.src);
      } catch (error) {
        console.warn("Failed to process image:", error);
      }
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  processNode(content);
  return { images, base64Urls };
};

const isCloudinaryUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.endsWith("cloudinary.com");
  } catch {
    return false;
  }
};
export const extractImageUrls = (content: BlogContent) => {
  const cloudinaryUrls: string[] = [];
  const processedUrls = new Set<string>();

  const processNode = (node: BlogContent) => {
    if (!node || typeof node !== "object") return;

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      isCloudinaryUrl(node.attrs.src) &&
      !processedUrls.has(node.attrs.src)
    ) {
      cloudinaryUrls.push(node.attrs.src);
      processedUrls.add(node.attrs.src);
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  processNode(content);
  return cloudinaryUrls;
};
