"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Produto = {
  id: number;
  nomeProduto: string;
  preco: number;
  tipo: "espeto" | "sobremesa" | "acompanhamento";
  descricao?: string;
};

const ProdutosPage = () => {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState(0);
  const [tipoProduto, setTipoProduto] = useState<"espeto" | "sobremesa" | "acompanhamento">(
    "espeto"
  );
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  // Buscar produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/pages/api/produto/[id]/");
        if (!response.ok) throw new Error("Erro ao carregar produtos");

        const data: Produto[] = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  // Cadastro ou atualização de produto
  const handleCadastroProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProduto || precoProduto <= 0 || isNaN(precoProduto)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const novoProduto = {
      nomeProduto,
      preco: precoProduto,
      tipo: tipoProduto,
      descricao: descricaoProduto,
    };

    try {
      const response = produtoEditando
        ? await fetch(`/pages/api/produto/[id]${produtoEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...novoProduto, id: produtoEditando.id }),
          })
        : await fetch("/pages/api/produto/[id]", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoProduto),
          });

      if (response.ok) {
        alert(
          produtoEditando
            ? "Produto atualizado com sucesso!"
            : "Produto cadastrado com sucesso!"
        );
        const produtoCadastrado = await response.json();
        setProdutos((prevProdutos) =>
          produtoEditando
            ? prevProdutos.map((prod) =>
                prod.id === produtoEditando.id ? produtoCadastrado : prod
              )
            : [...prevProdutos, produtoCadastrado]
        );
        resetForm();
        setIsModalOpen(false); // Fechar o modal após o cadastro
      } else {
        alert("Erro ao cadastrar/atualizar produto.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar/atualizar produto:", error);
      alert("Erro ao cadastrar/atualizar produto.");
    }
  };

  // Função para excluir o produto
  const handleDeleteProduto = async (id: number) => {
    try {
      const response = await fetch(`/pages/api/produto/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Produto excluído com sucesso!");
        setProdutos(produtos.filter((produto) => produto.id !== id));
      } else {
        alert("Erro ao excluir produto.");
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  };

  // Editar produto
  const handleEditProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNomeProduto(produto.nomeProduto);
    setPrecoProduto(produto.preco);
    setTipoProduto(produto.tipo);
    setDescricaoProduto(produto.descricao || "");
    setIsModalOpen(true); // Abrir o modal para edição
  };

  // Resetar formulário
  const resetForm = () => {
    setProdutoEditando(null);
    setNomeProduto("");
    setPrecoProduto(0);
    setTipoProduto("espeto");
    setDescricaoProduto("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
          Cadastro e Edição de Produtos
        </h1>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.push("/pages/dashboard")}
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-3  shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Voltar para o Dashboard
          </button>
          <button
            onClick={() => setIsModalOpen(true)} // Abrir modal ao clicar no botão
            className="bg-green-600 text-white hover:bg-green-700 rounded-lg px-6 py-3 shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Adicionar Produto
          </button>
        </div>

        {/* Modal para Adicionar Produto */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-96">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {produtoEditando ? "Editar Produto" : "Cadastrar Novo Produto"}
              </h2>

              <form onSubmit={handleCadastroProduto} className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="nomeProduto"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome
                    </label>
                    <input
                      id="nomeProduto"
                      type="text"
                      value={nomeProduto}
                      onChange={(e) => setNomeProduto(e.target.value)}
                      className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="precoProduto"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Preço
                    </label>
                    <input
                      id="precoProduto"
                      type="number"
                      value={precoProduto}
                      onChange={(e) =>
                        setPrecoProduto(parseFloat(e.target.value))
                      }
                      className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tipoProduto"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tipo
                    </label>
                    <select
                      id="tipoProduto"
                      value={tipoProduto}
                      onChange={(e) =>
                        setTipoProduto(e.target.value as "espeto" | "sobremesa" | "acompanhamento")
                      }
                      className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="espeto">Espeto</option>
                      <option value="sobremesa">Sobremesa</option>
                      <option value="acompanhamento">Acompanhamento</option>
                      <option value="bebidas">Bebidas</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="descricaoProduto"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="descricaoProduto"
                      value={descricaoProduto}
                      onChange={(e) => setDescricaoProduto(e.target.value)}
                      className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                >
                  {produtoEditando ? "Atualizar Produto" : "Cadastrar Produto"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-500 text-white py-3 rounded-lg shadow-md mt-4 hover:bg-gray-600 transition-all duration-300"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Produtos Cadastrados
          </h2>
          <table className="min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Descrição</th>
                <th className="px-6 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{produto.nomeProduto}</td>
                  <td className="px-6 py-3">R${produto.preco.toFixed(2)}</td>
                  <td className="px-6 py-3 capitalize">{produto.tipo}</td>
                  <td className="px-6 py-3">{produto.descricao || "-"}</td>
                  <td className="px-6 py-3 space-x-4">
                    <button
                      onClick={() => handleEditProduto(produto)}
                      className="text-blue-500 hover:text-blue-700 transition-all duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduto(produto.id)}
                      className="text-red-500 hover:text-red-700 transition-all duration-200"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProdutosPage;
