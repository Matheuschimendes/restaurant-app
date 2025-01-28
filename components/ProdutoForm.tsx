import React, { useState } from 'react';

const ProdutoForm = () => {
  const [imagemProduto, setImagemProduto] = useState<File | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemProduto(file); // Armazena o arquivo no estado

      // Valida o tipo de arquivo
      if (!file.type.startsWith('image')) {
        console.error('Arquivo não é uma imagem');
        return;
      }

      // Cria o FormData com a imagem
      const formData = new FormData();
      formData.append('imagemProduto', file);

      try {
        console.log('Iniciando o upload...');
        const response = await fetch('/pages/api/imagen/', {
          method: 'POST',
          body: formData,
        });

        // Verifica a resposta da API
        if (response.ok) {
          const data = await response.json();
          console.log('Upload bem-sucedido', data);
          setImagemUrl(data.url); // Recebe a URL gerada pelo Cloudinary
        } else {
          console.error('Erro ao fazer upload da imagem. Status:', response.status);
        }
      } catch (error) {
        console.error('Erro ao enviar imagem', error);
      }
    }
  };

  return (
    <div>
      <form>
        <label htmlFor="imagemProduto">Imagem do Produto</label>
        <input
          type="file"
          id="imagemProduto"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />
        {imagemProduto && <p>Imagem selecionada: {imagemProduto.name}</p>}
        {imagemUrl && <img src={imagemUrl} alt="Produto" />}
      </form>
    </div>
  );
};

export default ProdutoForm;
