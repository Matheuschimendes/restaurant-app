-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "mesa" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "nomeItem" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "pedidoId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;
