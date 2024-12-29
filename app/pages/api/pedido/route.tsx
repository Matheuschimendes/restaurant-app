import { NextRequest, NextResponse } from "next/server";

type ItemPedido = {
  nomeProduto: string;
  preco: number;
};

type Pedido = {
  id: number;
  mesa: string;
  itens: ItemPedido[];
  total: string;
  status: string;
};

// Banco de dados simulado em memória
const pedidos: Pedido[] = [];

export async function POST(request: NextRequest) {
  const { mesa, itens, total }: { mesa: string; itens: ItemPedido[]; total: string } = await request.json();

  // Validação de dados
  if (!mesa || !itens || !total) {
    return NextResponse.json({ message: "Dados do pedido incompletos!" }, { status: 400 });
  }

  // Criando novo pedido
  const novoPedido: Pedido = {
    id: pedidos.length + 1,
    mesa,
    itens,
    total,
    status: "pendente", // Status inicial do pedido
  };

  pedidos.push(novoPedido); // Salvando o pedido em memória

  return NextResponse.json({ message: "Pedido recebido com sucesso!", pedido: novoPedido }, { status: 201 });
}

export async function GET() {
  // Retorna todos os pedidos para exibir no dashboard
  return NextResponse.json(pedidos);
}
