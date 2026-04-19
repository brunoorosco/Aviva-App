import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { folder: customFolder } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = customFolder || 'comprovantes';

    // Parâmetros para o upload (assinado)
    const params: Record<string, any> = {
      timestamp: timestamp.toString(),
      folder,
    };

    // Gera assinatura usando api_sign_request
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error('Erro ao gerar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao gerar assinatura' });
  }
}
