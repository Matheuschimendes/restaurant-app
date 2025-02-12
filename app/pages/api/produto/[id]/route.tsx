import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Tipo para o Produto
type Produto = {
  id?: number; // `id` é opcional para POST
  nomeProduto: string;
  preco: number;
  tipo: "espeto" | "sobremesa" | "acompanhamento" | "bebidas";
  descricao?: string;
  imagem?: string; // imagemUrl como opcional
};

// GET: Retorna todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany(); // Buscando todos os produtos
    return NextResponse.json(produtos, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ message: "Erro ao buscar produtos.", error: errorMessage }, { status: 500 });
  }
}

// POST: Cria um novo produto
export async function POST(request: NextRequest) {
  try {
    const body: Produto = await request.json();
    const { nomeProduto, preco, tipo, descricao,  } = body;

    if (!nomeProduto || preco <= 0 || !tipo) {
      return NextResponse.json({ message: "Dados do produto inválidos!" }, { status: 400 });
    }

    const novoProduto = await prisma.produto.create({
      data: { nomeProduto, preco, tipo, descricao,  },
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ message: "Erro ao criar produto.", error: errorMessage }, { status: 500 });
  }
}

// PUT: Atualiza um produto existente
export async function PUT(request: NextRequest) {
  try {
    const body: Produto = await request.json();
    const { id, nomeProduto, preco, tipo, descricao,  } = body;

    if (!id || id <= 0) {
      return NextResponse.json({ message: "ID inválido!" }, { status: 400 });
    }

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return NextResponse.json({ message: "Produto não encontrado!" }, { status: 404 });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { nomeProduto, preco, tipo, descricao,  },
    });

    return NextResponse.json(produtoAtualizado, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ message: "Erro ao atualizar produto.", error: errorMessage }, { status: 500 });
  }
}

// DELETE: Deleta um produto
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() || "", 10); // Extrai o ID da URL

    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ message: "ID inválido!" }, { status: 400 });
    }

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return NextResponse.json({ message: "Produto não encontrado!" }, { status: 404 });
    }

    await prisma.produto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto excluído com sucesso!" }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ message: "Erro ao excluir produto.", error: errorMessage }, { status: 500 });
  }
}
