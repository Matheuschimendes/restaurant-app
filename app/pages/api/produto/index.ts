import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nomeProduto, preco, tipo, descricao, imagem } = req.body;

    try {
      const novoProduto = await prisma.produto.create({
        data: { nomeProduto, preco, tipo, descricao, imagem },
      });

      res.status(201).json(novoProduto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao salvar o produto" });
    }
  } else if (req.method === "GET") {
    try {
      const produtos = await prisma.produto.findMany();
      res.status(200).json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
