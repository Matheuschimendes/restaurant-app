import { IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary'; // Certifique-se de que está usando a versão correta do Cloudinary
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next'; 

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Desabilitar o parser de corpo para manipulação com formidable
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erro ao fazer upload:", err);
        res.status(500).json({ error: 'Erro ao fazer upload' });
        return;
      }

      // Verifique se o arquivo de imagem foi enviado
      const imagemProduto = files.imagemProduto ? (Array.isArray(files.imagemProduto) ? files.imagemProduto[0] : files.imagemProduto) : undefined;

      if (!imagemProduto) {
        res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
        return;
      }

      const filePath = imagemProduto.filepath; // Aqui, você está pegando o caminho do arquivo temporário

      try {
        // Fazendo o upload da imagem para o Cloudinary
        const result = await cloudinary.uploader.upload(filePath);

        // Retorna a URL da imagem para o cliente
        res.status(200).json({ url: result.secure_url });

        // Remove o arquivo temporário após o upload
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error("Erro ao enviar imagem para o Cloudinary:", error);
        res.status(500).json({ error: 'Erro ao enviar imagem para o Cloudinary' });
      }
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};

export default handler;
