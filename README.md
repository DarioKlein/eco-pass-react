# EcoPass - Sistema de Gestão de Reciclagem Sustentável

EcoPass é uma aplicação web progressiva (PWA) desenvolvida para incentivar e gerenciar processos de reciclagem. O sistema permite que usuários registrem descartes de materiais recicláveis, acumulem créditos e os troquem por benefícios, enquanto administradores podem validar as coletas.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias modernas:

- **React 18**: Biblioteca principal para construção da interface.
- **TypeScript**: Adiciona tipagem estática ao JavaScript para maior segurança e produtividade.
- **Vite**: Bundler ultra-rápido para o desenvolvimento e build.
- **Tailwind CSS**: Framework CSS utilitário para estilização responsiva e moderna.
- **Lucide React**: Biblioteca de ícones elegantes.
- **React Router Dom (v7)**: Gerenciamento de rotas e navegação.
- **Vite Plugin PWA**: Transforma a aplicação em um Progressive Web App, permitindo instalação e cache offline.
- **QRCode.react**: Geração de códigos QR para validação de transações.

## 📁 Estrutura do Projeto

```text
src/
├── components/    # Componentes reutilizáveis (Navegação, etc)
├── context/       # Gerenciamento de estado global (AuthContext)
├── pages/         # Páginas da aplicação
├── types/         # Definições de interfaces TypeScript
└── utils/         # Funções utilitárias e persistência (LocalStorage)
```

## 💻 Funcionalidades e Páginas

### 1. Autenticação (`/login`)
- Sistema de login e cadastro.
- Suporte a diferentes perfis: **Cidadão** (usuário comum) e **Coletor** (administrador).

### 2. Dashboard (`/`)
- Visão geral dos créditos acumulados.
- Resumo das últimas atividades de reciclagem.
- Gráficos/Indicadores de impacto ambiental.

### 3. Nova Reciclagem (`/new-recycling`)
- Formulário para registro de materiais (Papel, Plástico, Metal, Vidro, Eletrônicos).
- Cálculo estimado de valor com base no peso/quantidade.
- Localizador de pontos de coleta próximos.

### 4. Meu Cartão (`/my-card`)
- Exibição de um QR Code único para o usuário.
- Utilizado para identificação rápida em postos de coleta físicos.

### 5. Resgate de Créditos (`/redeem-credits`)
- Marketplace para trocar créditos acumulados por benefícios (descontos em contas, passagens, etc).

### 6. Validação Admin (`/admin-validation`)
- Área exclusiva para Coletores.
- Interface para validar itens pendentes registrados pelos usuários.

## 💾 Persistência de Dados

A aplicação utiliza o **LocalStorage** do navegador para persistir dados de usuários, histórico de reciclagem e sessões, permitindo o funcionamento como um protótipo funcional sem a necessidade de um backend externo imediato.

## 🛠️ Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse em: `http://localhost:5000`

---
Desenvolvido como uma solução para cidades inteligentes e sustentabilidade urbana.