// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  filePath: string,
  folder: string = "uploads",
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    // Remove o arquivo temporário
    fs.unlinkSync(filePath);

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
