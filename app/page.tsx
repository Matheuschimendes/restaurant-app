"use client";

import { useState, useEffect } from "react";

type ItemMenu = {
  id: number;
  nomeProduto: string;
  descricao: string;
  preco: number;
  tipo: "espeto" | "sobremesa" | "acompanhamento" | "bebidas";
};

const MenuPage = () => {
  const [mesa, setMesa] = useState<string>("");
  const [pedido, setPedido] = useState<ItemMenu[]>([]);
  const [produtos, setProdutos] = useState<ItemMenu[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<"espeto" | "sobremesa" | "acompanhamento" | "bebidas">("espeto");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/pages/api/produto/[id]");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data: ItemMenu[] = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  const adicionarAoPedido = (item: ItemMenu) => {
    setPedido((prev) => [...prev, item]);
  };

  const calcularTotal = () => {
    return pedido.reduce((total, item) => total + item.preco, 0).toFixed(2);
  };

  const finalizarPedido = async () => {
    if (!mesa || pedido.length === 0) {
      alert("Por favor, selecione a mesa e adicione itens ao pedido!");
      return;
    }

    const pedidoData = {
      mesa,
      itens: pedido,
      total: calcularTotal(),
    };

    try {
      const response = await fetch("/pages/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao finalizar pedido.");
      }

      alert(`Pedido finalizado para a mesa ${mesa}. Total: R$ ${calcularTotal()}`);
      setMesa("");
      setPedido([]);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Seleção de Mesa */}
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Selecione a Mesa</h2>
        <select
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
        >
          <option value="">Selecione a mesa</option>
          {["1", "2", "3", "4", "5"].map((mesa) => (
            <option key={mesa} value={mesa}>
              Mesa {mesa}
            </option>
          ))}
        </select>
      </div>

      {/* Categorias */}
      <div className="mt-8 max-w-md mx-auto flex space-x-4">
        {["espeto", "acompanhamento", "bebidas", "sobremesa"].map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaSelecionada(categoria as "espeto" | "acompanhamento"| "bebidas" | "sobremesa"  )}
            className={`px-6 py-2 rounded-full font-semibold ${
              categoriaSelecionada === categoria
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        {produtos
          .filter((item) => item.tipo === categoriaSelecionada)
          .map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg mb-4 shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.nomeProduto}</h3>
                  <p className="text-sm">{item.descricao}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">R$ {item.preco.toFixed(2)}</span>
                  <button
                    onClick={() => adicionarAoPedido(item)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pedido */}
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Seu Pedido</h2>
        {pedido.length > 0 ? (
          <>
            <ul>
              {pedido.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.nomeProduto}</span>
                  <span>R$ {item.preco.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <span>Total:</span>
              <span>R$ {calcularTotal()}</span>
            </div>
            <button
              onClick={finalizarPedido}
              className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg"
            >
              Finalizar Pedido
            </button>
          </>
        ) : (
          <p>Nenhum item no pedido.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
