import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type Produto = {
  id: number;
  nomeProduto: string; // Corrigido para nomeProduto
  preco: number;
  tipo: "comida" | "sobremesa";
  descricao?: string
};

// GET: Retorna todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany(); // Buscando todos os produtos
    return NextResponse.json(produtos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Erro ao buscar produtos.", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Erro desconhecido ao buscar produtos." }, { status: 500 });
  }
}

// POST: Cria um novo produto
export async function POST(request: NextRequest) {
  try {
    const { nomeProduto, preco, tipo, descricao }: Produto = await request.json(); // Corrigido para nomeProduto

    if (!nomeProduto || preco <= 0 || !tipo) {
      return NextResponse.json({ message: "Dados do produto inválidos!" }, { status: 400 });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nomeProduto, // Corrigido para nomeProduto
        preco,
        tipo,
        descricao,
      },
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Erro ao criar produto.", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Erro desconhecido ao criar produto." }, { status: 500 });
  }
}

// PUT: Atualiza um produto existente
export async function PUT(request: NextRequest) {
  try {
    const { id, nomeProduto, preco, tipo, descricao }: Produto = await request.json(); // Corrigido para nomeProduto

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return NextResponse.json({ message: "Produto não encontrado!" }, { status: 404 });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nomeProduto, // Corrigido para nomeProduto
        preco,
        tipo,
        descricao
      },
    });

    return NextResponse.json(produtoAtualizado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Erro ao atualizar produto.", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Erro desconhecido ao atualizar produto." }, { status: 500 });
  }
}

// DELETE: Deleta um produto
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() || "", 10); // Extrai o ID da URL

    if (isNaN(id)) {
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

    return NextResponse.json({ message: "Produto excluído com sucesso!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Erro ao excluir produto.", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Erro desconhecido ao excluir produto." }, { status: 500 });
  }
}