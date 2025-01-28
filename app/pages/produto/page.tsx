"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Produto = {
  id: number;
  nomeProduto: string;
  preco: number;
  tipo: "espeto" | "sobremesa" | "acompanhamento";
  descricao?: string;
  imagemUrl?: string;
};

const ProdutosPage = () => {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState(0);
  const [tipoProduto, setTipoProduto] = useState<"espeto" | "sobremesa" | "acompanhamento">("espeto");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [imagemProduto, setImagemProduto] = useState<File | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemProduto(e.target.files[0]);
    }
  };

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
      imagemUrl: imagemProduto ? URL.createObjectURL(imagemProduto) : undefined,
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
        alert(produtoEditando ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");
        const produtoCadastrado = await response.json();
        setProdutos((prevProdutos) =>
          produtoEditando
            ? prevProdutos.map((prod) =>
                prod.id === produtoEditando.id ? produtoCadastrado : prod
              )
            : [...prevProdutos, produtoCadastrado]
        );
        resetForm();
        setIsModalOpen(false);
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
    setImagemProduto(null);
    setIsModalOpen(true);
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
        <h1 className="text-3xl font-semibold text-center mb-6">Gestão de Produtos</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <button
            onClick={() => router.push("/pages/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 w-full sm:w-auto"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 w-full sm:w-auto"
          >
            Adicionar Produto
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-96">
              <h2 className="text-xl font-semibold mb-4">
                {produtoEditando ? "Editar Produto" : "Novo Produto"}
              </h2>
              <form onSubmit={handleCadastroProduto} className="space-y-4">
                <input
                  type="text"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  placeholder="Nome do Produto"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  value={precoProduto}
                  onChange={(e) => setPrecoProduto(parseFloat(e.target.value))}
                  placeholder="Preço"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <select
                  value={tipoProduto}
                  onChange={(e) =>
                    setTipoProduto(e.target.value as "espeto" | "sobremesa" | "acompanhamento")
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="espeto">Espeto</option>
                  <option value="sobremesa">Sobremesa</option>
                  <option value="acompanhamento">Acompanhamento</option>
                </select>
                <textarea
                  value={descricaoProduto}
                  onChange={(e) => setDescricaoProduto(e.target.value)}
                  placeholder="Descrição"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 w-full sm:w-auto"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 w-full sm:w-auto"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Nome</th>
                <th className="text-left px-4 py-2 font-medium">Preço</th>
                <th className="text-left px-4 py-2 font-medium">Tipo</th>
                <th className="text-left px-4 py-2 font-medium">Descrição</th>
                <th className="text-left px-4 py-2 font-medium">Imagem</th>
                <th className="text-left px-4 py-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{produto.nomeProduto}</td>
                  <td className="px-4 py-2">R${produto.preco.toFixed(2)}</td>
                  <td className="px-4 py-2">{produto.tipo}</td>
                  <td className="px-4 py-2">{produto.descricao || "-"}</td>
                  <td className="px-4 py-2">
                    {produto.imagemUrl && (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nomeProduto}
                        className="w-16 h-16 rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditProduto(produto)}
                      className="text-blue-500 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduto(produto.id)}
                      className="text-red-500 hover:underline"
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
