import { withAudit } from '@/middlewares/withAudit';
// pages/api/protected/users/settings.ts (adicionar método PATCH)
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getUserSettings, updateUserSettings } from "@/services/users";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (req.method === "GET") {
    try {
      const user = await getUserSettings(session.user.id as string);

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar configurações do usuário:", error);
      return res.status(500).json({ message: "Erro ao buscar dados do usuário" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const form = formidable({
        maxFileSize: 2 * 1024 * 1024, // 2MB
        allowEmptyFiles: false,
      });

      const [fields, files] = await form.parse(req);

      let imageUrl: string | undefined;

      // Upload da imagem para o Cloudinary se existir
      if (files.avatar && files.avatar[0]) {
        const file = files.avatar[0];
        imageUrl = await uploadToCloudinary(file.filepath, "user-avatars");
      }

      const updateData = {
        name: fields.fullName?.[0],
        phone: fields.phone?.[0],
        address: fields.address?.[0],
        ...(imageUrl && { image: imageUrl }),
        ...(fields.currentPassword?.[0] &&
          fields.newPassword?.[0] && {
            currentPassword: fields.currentPassword[0],
            newPassword: fields.newPassword[0],
          }),
      };

      const updatedUser = await updateUserSettings(session.user.id as string, updateData);

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      return res.status(500).json({ message: "Erro ao atualizar dados" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}

export default withAudit(handler);