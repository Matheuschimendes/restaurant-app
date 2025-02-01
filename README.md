# 🍢 Sistema de Pedidos - Restaurante  

Este é um sistema de pedidos para restaurantes, desenvolvido com **Next.js**, **TypeScript**, e **ShadCN UI**. Ele permite que clientes escolham seus itens do menu, adicionem ao pedido e finalizem com um alerta interativo. Além disso, há um **dashboard** para visualizar os pedidos e um **sistema de login** para administradores.  

## 🚀 Tecnologias Utilizadas  

- **React (Next.js)** - Estrutura para aplicações web modernas  
- **TypeScript** - Tipagem estática para melhor manutenção  
- **Tailwind CSS** - Estilização rápida e eficiente  
- **ShadCN UI** - Componentes prontos para uso  
- **Sonner** - Sistema de notificações elegante  

## 📌 Funcionalidades  

✅ **Login de Administrador** com autenticação simples  
✅ **Menu Interativo** - Seleção de mesa, categorias e adição de itens ao pedido  
✅ **Cálculo automático do total**  
✅ **Envio do pedido para API**  
✅ **Alerta de sucesso no canto inferior direito**  
✅ **Dashboard para gerenciamento de pedidos**  

## 🔐 Login do Administrador  

Acesso ao dashboard protegido por login.  

**Credenciais padrão:**  
- **Usuário:** `admin`  
- **Senha:** `123`  

Após login bem-sucedido, o sistema armazena um token no **localStorage** e redireciona para o dashboard.  

## 🔧 Como Executar o Projeto  


📂 Estrutura do Projeto
bash
Copia
Modifica

📂 src/
 ├── 📁 components/    # Componentes reutilizáveis  
 ├── 📁 pages/         # Páginas principais  
 │   ├── menu.tsx      # Página do menu  
 │   ├── dashboard.tsx # Página do dashboard  
 │   ├── login.tsx     # Página de login  
 ├── 📁 styles/        # Estilos globais  
 ├── 📁 api/           # Simulação de API  
 └── README.md         # Documentação  



## 📊 Dashboard
O Dashboard permite visualizar todos os pedidos em andamento. Ele exibe:

Número da mesa
Itens do pedido
Total do pedido
Status (pendente/concluído)
Para acessar o Dashboard, faça login em /login e você será redirecionado.

##
🤝 Contribuição
Sinta-se à vontade para contribuir! Faça um fork, crie um branch e envie um pull request.

📜 Licença
Este projeto está sob a licença MIT.




### 1️⃣ Clone o repositório  
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```cd nome-do-repositorio
npm install
npm run dev

