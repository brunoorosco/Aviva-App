import type { NextApiRequest, NextApiResponse } from "next";
import { DiscipuladoMongoRepository } from "@/infra/db/repositories/mongo/discipulado";
import { Membro } from "@/domain/models/discupulado";
import { sendMediaApiWhatsapp, sendMessageApiWhatsapp } from "@/infra/http/whatsapp";
import QRCode from "qrcode";
import { MongoHelper } from "@/infra/db/mongoHelper";
import { ObjectId } from "mongodb";
import { uploadToCloudinary, deleteComprovanteFromCloudinary } from "@/lib/cloudinary";

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string } | Error>,
) {
  try {
    const repository = new DiscipuladoMongoRepository();
    const { cicloid } = req.query;

    if (!cicloid || typeof cicloid !== "string") {
      return res.status(400).json({ message: "Invalid ciclo ID" });
    }

    if (req.method === "POST") {
      const inscrito: Membro = req.body;

      if (!inscrito.id || !inscrito.nome) {
        return res.status(400).json({ message: "Missing required fields: id, nome" });
      }

      // 1. Add to cycle enrollments
      const added = await repository.addInscrito(cicloid, inscrito);

      // Se não adicionou, pode ser porque já está matriculado. 
      // Não barramos aqui para permitir o reenvio do QR Code se necessário.

      // 2. Fetch user phone from database
      const usersCollection = await MongoHelper.getCollection("users");
      const user = await usersCollection.findOne({ _id: new ObjectId(inscrito.id) });

      const phone = user?.phone || user?.whatsapp;

      if (phone) {
        try {
          // 3. Verificamos se o aluno já tem uma URL de QR Code salva para evitar upload duplicado
          const cicloCollection = await MongoHelper.getCollection("ciclos_discipulado");
          const cicloDoc = await cicloCollection.findOne({ _id: new ObjectId(cicloid) });
          const alunoJaInscrito = cicloDoc?.inscritos?.find((i: any) => i.id === inscrito.id);

          let qrUrl = alunoJaInscrito?.qrCodeUrl;

          if (!qrUrl) {
            // Se não tem URL, geramos o QR Code e fazemos o upload
            const qrContent = JSON.stringify({
              _id: inscrito.id,
              nome: inscrito.nome,
            });

            // toDataURL returns 'data:image/png;base64,...'
            const qrBase64 = await QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'H' });

            // Upload to Cloudinary
            qrUrl = await uploadToCloudinary(qrBase64, "discipulado/qrcodes", false);
          }

          let firstname = inscrito.nome.split(" ")[0];
          const greeting = `Olá ${firstname}, sua matrícula no Ciclo de Discipulado foi realizada com sucesso!\n\nAbaixo está o seu QR Code de acesso. Apresente-o na entrada das aulas para registrar sua presença.`;

          // 4. Send QR Code URL to WhatsApp
          await sendMediaApiWhatsapp(phone, greeting, qrUrl, false);

          // 5. Update send timestamp and QR URL in DB
          await repository.updateInscritoEnvio(cicloid, inscrito.id, new Date().toISOString(), qrUrl);

          return res.status(201).json({ success: true, message: "Matriculado e QR Code enviado!" });
        } catch (wpError) {
          console.error("Error sending QR Code via WhatsApp:", wpError);
          // Don't fail the request if just WP sending fails, but return a different message
          return res.status(201).json({ success: true, message: "Matriculado, mas falha ao enviar QR Code pelo WhatsApp." });
        }
      } else {
        return res.status(201).json({ success: true, message: "Matriculado (sem WhatsApp cadastrado)." });
      }

    } else if (req.method === "DELETE") {
      // Allow un-enrolling if needed
      const { membroId } = req.body;

      if (!membroId) {
        return res.status(400).json({ message: "Missing membroId" });
      }

      // 1. Buscamos a URL do QR Code antes de deletar
      const cicloCollection = await MongoHelper.getCollection("discipulado_ciclos");
      const cicloDoc = await cicloCollection.findOne({ _id: new ObjectId(cicloid) });
      const inscrito = cicloDoc?.inscritos?.find((i: any) => i.id === membroId);

      if (inscrito?.qrCodeUrl) {
        try {
          // 2. Removemos do Cloudinary
          console.log("Tentando deletar QR Code do Cloudinary:", inscrito.qrCodeUrl);
          await deleteComprovanteFromCloudinary(inscrito.qrCodeUrl);
          console.log("QR Code deletado com sucesso do Cloudinary");
        } catch (error) {
          console.error("Erro ao deletar QR Code do Cloudinary:", error);
          // Opcional: não travar a exclusão do banco se o Cloudinary falhar
        }
      }

      const removed = await repository.removeInscrito(cicloid, membroId);
      if (removed) {
        return res.status(200).json({ success: true, message: "Matrícula removida." });
      } else {
        return res.status(400).json({ message: "Não foi possível remover matrícula." });
      }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Error handling ciclo inscricao:", error);
    return res.status(500).json({ message: error.message || "Erro ao processar matrícula no ciclo" });
  }
}
