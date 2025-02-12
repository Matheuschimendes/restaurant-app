"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Produto = {
  id: number;
  nomeProduto: string;
  preco: number;
  tipo: "espeto" | "sobremesa" | "acompanhamento";
  descricao?: string;
  imagemUrl?: string;
};

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState(0);
  const [tipoProduto, setTipoProduto] = useState<
    "espeto" | "sobremesa" | "acompanhamento"
  >("espeto");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [imagemProduto, setImagemProduto] = useState<string | null>(null);

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a exibição do modal

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/pages/api/produto/[id]");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data: Produto[] = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

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
      imagemUrl: imagemProduto, // URL da imagem
    };

    try {
      const response = produtoEditando
        ? await fetch(`/pages/api/produto/${produtoEditando.id}`, {
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
        setIsModalOpen(false); // Fecha o modal após o cadastro
      } else {
        alert("Erro ao cadastrar/atualizar produto.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar/atualizar produto:", error);
      alert("Erro ao cadastrar/atualizar produto.");
    }
  };

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

  const handleEditProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNomeProduto(produto.nomeProduto);
    setPrecoProduto(produto.preco);
    setTipoProduto(produto.tipo);
    setDescricaoProduto(produto.descricao || "");
    setImagemProduto(produto.imagemUrl || null);
    setIsModalOpen(true); // Abre o modal ao editar um produto
  };

  const resetForm = () => {
    setProdutoEditando(null);
    setNomeProduto("");
    setPrecoProduto(0);
    setTipoProduto("espeto");
    setDescricaoProduto("");
    setImagemProduto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Cadastro de Produtos</h1>

        {/* Botão para abrir o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Cadastrar Novo Produto
        </button>
      </div>

      {/* Modal para cadastro/edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {produtoEditando ? "Editar Produto" : "Cadastrar Produto"}
            </h2>
            <form onSubmit={handleCadastroProduto}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Preço
                </label>
                <input
                  type="number"
                  value={precoProduto}
                  onChange={(e) => setPrecoProduto(parseFloat(e.target.value))}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={tipoProduto}
                  onChange={(e) =>
                    setTipoProduto(
                      e.target.value as
                        | "espeto"
                        | "sobremesa"
                        | "acompanhamento"
                    )
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                >
                  <option value="espeto">Espeto</option>
                  <option value="sobremesa">Sobremesa</option>
                  <option value="acompanhamento">Acompanhamento</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={descricaoProduto}
                  onChange={(e) => setDescricaoProduto(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>

           

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  {produtoEditando ? "Atualizar Produto" : "Cadastrar Produto"}
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsModalOpen(false)} // Fecha o modal
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      

      {/* Exibindo a lista de produtos */}

      <div className="max-w-6xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Produtos</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Imagem
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Nome do Produto
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Preço
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Tipo
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Descrição
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {produto.imagemUrl && (
                    <Image
                      src={produto.imagemUrl}
                      alt={produto.nomeProduto}
                      width={50}
                      height={50}
                      className="object-cover rounded-md"
                    />
                  )}
                </td>
                <td className="py-3 px-6">{produto.nomeProduto}</td>
                <td className="py-3 px-6">{produto.preco.toFixed(2)} BRL</td>
                <td className="py-3 px-6">{produto.tipo}</td>
                <td className="py-3 px-6">{produto.descricao}</td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    onClick={() => handleEditProduto(produto)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduto(produto.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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
  );
};

export default ProdutosPage;