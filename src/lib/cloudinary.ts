// lib/cloudinary.ts (mantém só funções server-side)
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mantém apenas as funções que rodam no server
export async function uploadToCloudinary(
  file: string, // Pode ser path ou Base64
  folder: string = "uploads",
  transform: boolean = true
): Promise<string> {
  try {
    const options: any = {
      folder,
      resource_type: "auto",
    };

    if (transform) {
      options.transformation = [
        { quality: "auto" },
      ];
    }

    const result = await cloudinary.uploader.upload(file, options);
    return result.secure_url;
  } catch (error) {
    console.error("Erro ao fazer upload para Cloudinary:", error);
    throw new Error("Falha no upload da imagem");
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Erro ao deletar do Cloudinary:", error);
    throw new Error("Falha ao deletar imagem");
  }
}

export async function deleteComprovanteFromCloudinary(urlOrPublicId: string): Promise<void> {
  try {
    let publicId = urlOrPublicId;
    
    if (urlOrPublicId.includes('cloudinary.com')) {
      const urlParts = urlOrPublicId.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        const pathWithVersion = urlParts.slice(uploadIndex + 1).join('/');
        publicId = pathWithVersion.replace(/^v\d+\//, '').replace(/\.[^.]+$/, '');
      }
    }
    
    await cloudinary.uploader.destroy(publicId);
    console.log(`Comprovante deletado do Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Erro ao deletar comprovante do Cloudinary:", error);
    throw new Error("Falha ao deletar comprovante");
  }
}