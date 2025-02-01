"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

type ItemMenu = {
  quantidade: number;
  id: number;
  nomeProduto: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  tipo: "espeto" | "sobremesa" | "acompanhamento" | "bebidas";
};

const MenuPage = () => {
  const [mesa, setMesa] = useState<string>("");
  const [pedido, setPedido] = useState<ItemMenu[]>([]);
  const [produtos, setProdutos] = useState<ItemMenu[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    "espeto" | "sobremesa" | "acompanhamento" | "bebidas"
  >("espeto");

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

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
    toast.success(`${item.nomeProduto} adicionado ao pedido!`, {
      position: "top-right",
      duration: 1500,
    });
  };

  const removerDoPedido = (id: number) => {
    setPedido((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removido do pedido!", {
      position: "top-right",
      duration: 1500,
    });
  };

  const aumentarQuantidade = (id: number) => {
    setPedido((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: (item.quantidade || 1) + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (id: number) => {
    setPedido((prev) =>
      prev.map((item) =>
        item.id === id && (item.quantidade || 1) > 1
          ? { ...item, quantidade: (item.quantidade || 1) - 1 }
          : item
      )
    );
  };

  const calcularTotal = () => {
    return pedido.reduce(
      (total, item) => total + (item.preco * (item.quantidade || 1)),
      0
    ).toFixed(2);
  };

  const finalizarPedido = async () => {
    if (!mesa || pedido.length === 0) {
      toast.error("Por favor, selecione a mesa e adicione itens ao pedido!");
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

      toast.success(
        `Pedido finalizado para a mesa ${mesa}. Total: R$ ${calcularTotal()}`,
        { position: "top-right" }
      );

      setMesa("");
      setPedido([]);
      setIsModalOpen(false); // Fecha o modal após finalizar
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error("Erro ao finalizar pedido. Tente novamente.", {
        position: "top-right",
      });
    }
  };

  // Função para contar o total de itens no carrinho
  const contarItensNoCarrinho = () => {
    return pedido.reduce((total, item) => total + (item.quantidade || 1), 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Botão do Carrinho no canto superior direito */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 lg:top-8 lg:right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl transition-all duration-200 hover:bg-indigo-700 flex items-center justify-center z-50"
      >
        Carrinho
        {/* Exibindo o contador de itens no carrinho */}
        {contarItensNoCarrinho() > 0 && (
          <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
            {contarItensNoCarrinho()}
          </span>
        )}
      </button>

      {/* Seleção de Mesa */}
      <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-medium mb-6 text-center text-gray-800">
          Selecione a Mesa
        </h2>
        <select
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
      <div className="mt-8 max-w-md mx-auto overflow-x-auto flex space-x-6 p-3">
        {["espeto", "acompanhamento", "bebidas", "sobremesa"].map(
          (categoria) => (
            <button
              key={categoria}
              onClick={() =>
                setCategoriaSelecionada(
                  categoria as
                    | "espeto"
                    | "acompanhamento"
                    | "bebidas"
                    | "sobremesa"
                )
              }
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoriaSelecionada === categoria
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-indigo-500 hover:text-white"
              }`}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Menu */}
      <div className="mt-8 max-w-2xl mx-auto">
        {produtos
          .filter((item) => item.tipo === categoriaSelecionada)
          .map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md mb-6 transition-all duration-200 hover:scale-105"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">{item.nomeProduto}</h3>
                  <p className="text-sm text-gray-500">{item.descricao}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-semibold text-gray-800">
                    R$ {item.preco.toFixed(2)}
                  </span>
                  <button
                    onClick={() => adicionarAoPedido(item)}
                    className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-indigo-700"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-medium text-center mb-4">Carrinho de Compras</h2>
            <ul>
              {pedido.map((item, index) => (
                <li key={index} className="flex justify-between items-center mb-4">
                  <span>{item.nomeProduto}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => diminuirQuantidade(item.id)}
                      className="mr-2 bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      -
                    </button>
                    <span>{item.quantidade || 1}</span>
                    <button
                      onClick={() => aumentarQuantidade(item.id)}
                      className="ml-2 bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      +
                    </button>
                    <span className="ml-2">R$ {item.preco.toFixed(2)}</span>
                    <button
                      onClick={() => removerDoPedido(item.id)}
                      className="ml-4 bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-xl font-medium mb-4">
              <span>Total:</span>
              <span>R$ {calcularTotal()}</span>
            </div>
            <button
              onClick={finalizarPedido}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              Finalizar Pedido
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MenuPage;
