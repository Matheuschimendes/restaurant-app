export type Item = {
  nome: string;
  preco: number;
};

export type Pedido = {
  mesa: string;
  itens: Item[];
};
