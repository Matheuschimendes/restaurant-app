"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ItemPedido = {
  nomeProduto: string;
  descricao: string;
  preco: number;
};

type Pedido = {
  id: number;
  mesa: string;
  itens: ItemPedido[];
  total: string;
  status: string;
};

const DashboardPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("/pages/api/pedido/");
        if (!response.ok) throw new Error("Erro ao carregar pedidos");
        const data: Pedido[] = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Pedidos do Dashboard
      </h1>

      <div className="flex space-x-4 mb-6">
        <Link
          href="/pages/produto/"
          className="px-6 py-2 bg-blue-500 text-white rounded-full"
        >
          Cadastro de Produtos
        </Link>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pedidos</h2>
      <div className="">
        {pedidos.length > 0 ? (
          <ul className="grid grid-cols-3 max-[1200px]:grid-cols-1 gap-3 space-y-2">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold bg-blue-500 rounded-full w-auto p-2 text-center text-white">
                  Mesa {pedido.mesa}
                </h3>
                <ul className="mt-2">
                  {pedido.itens.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="m-2">
                        <h3 className="text-lg font-semibold">
                          {item.nomeProduto}
                        </h3>
                        <p className="text-sm">{item.descricao}</p>
                      </div>
                      <span className="text-gray-600">
                        R$ {item.preco.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div>
                  <div className="mt-4 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">R$ {pedido.total}</span>
                  </div>
                  <span
                    className={`mt-2 inline-block text-sm font-medium ${
                      pedido.status === "pendente"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    Status: {pedido.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum pedido disponível.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
