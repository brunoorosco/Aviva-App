// lib/cloudinary-client.ts (novo arquivo, só funções client)

// Gera URL otimizada para visualização de PDF em iframe
export function getPDFViewUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary.com")) {
    return cloudinaryUrl;
  }

  // Remove o flag "attachment" e adiciona "fl_attachment:false" para forçar visualização inline
  if (cloudinaryUrl.includes("/upload/fl_")) {
    return cloudinaryUrl.replace("fl_attachment", "fl_attachment:false");
  } else if (cloudinaryUrl.includes("/upload/v")) {
    return cloudinaryUrl.replace("/upload/v", "/upload/fl_attachment:false/v");
  } else {
    return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment:false/");
  }
}

// Extrai publicId de uma URL do Cloudinary
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url.includes("cloudinary.com")) return null;

  const urlParts = url.split("/");
  const uploadIndex = urlParts.indexOf("upload");

  if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
    const pathWithVersion = urlParts.slice(uploadIndex + 1).join("/");
    return pathWithVersion.replace(/^v\d+\//, "").replace(/\.[^.]+$/, "");
  }

  return null;
}
