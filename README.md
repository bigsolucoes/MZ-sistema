
# Advocacia MZ - ERP System

Um sistema ERP para advocacia que seja intuitivo, seguro e visualmente agradável, eliminando a complexidade e focando na produtividade do advogado.

## Visão Geral

Este projeto é um sistema de gestão (ERP) moderno para escritórios de advocacia, construído com foco na experiência do usuário, interatividade e integrações chave. Ele visa simplificar o dia a dia do advogado, oferecendo ferramentas para gerenciamento de agenda, prazos, tarefas, contratos e finanças.

## Stack de Tecnologia (Frontend)

*   **Build Tool**: Vite
*   **Framework**: React 18+ com TypeScript (.tsx)
*   **Autenticação**: Sistema de PIN de 4 dígitos.
*   **Estilização**: Tailwind CSS (com componentes inspirados em Shadcn/UI)
*   **Animação**: Framer Motion
*   **Gestão de Estado Global**: Zustand
*   **Roteamento**: React Router DOM (usando `HashRouter`)
*   **Componentes de Calendário**: `react-big-calendar`
*   **Drag and Drop (Kanban)**: `dnd-kit`
*   **Ícones**: `lucide-react`

*(Nota: O backend (Node.js/NestJS/PostgreSQL/Prisma) e a configuração completa do monorepo (Turborepo/pnpm) são parte da arquitetura geral, mas este README foca na execução do frontend.)*

## Funcionalidades Principais

*   **Autenticação Segura com PIN**: Login simples e seguro com PIN de 4 dígitos.
*   **Dashboard Intuitivo**: Resumos visuais de informações importantes.
*   **Tela de Descanso (Idle Screen)**: Protege informações em tela após inatividade ou clique no logo.
*   **Modo Sigilo (Privacy Mode)**: Oculta valores financeiros (R$) em todo o sistema com um clique.
*   **Integração com Google Calendar**: Visualize e gerencie sua agenda Google diretamente na plataforma (requer autorização separada se o login principal for PIN).
*   **Gestão de Prazos e Tarefas (Kanban)**: Quadros Kanban separados para Prazos Processuais e Tarefas Internas.
*   **Controle de Contratos**: Gerencie contratos de honorários.
*   **Financeiro do Cliente**: Acompanhe a "conta corrente" de cada cliente.
*   **Controle de Repasses (Acordos de Devedores)**: Gerencie o fluxo de recuperação de crédito e repasses.
*   **Layout Responsivo e Moderno**: Interface limpa com navegação intuitiva.

## Configuração do Ambiente

### Pré-requisitos

*   Node.js (versão 18.x ou superior)
*   pnpm (instalado globalmente: `npm install -g pnpm`)

### Variáveis de Ambiente

Nenhuma variável de ambiente específica é necessária para o login com PIN no frontend. Se funcionalidades como a API do Google Calendar forem mantidas, elas podem exigir configuração de chaves de API separadamente.

### Instalação de Dependências

Navegue até o diretório raiz do projeto (ou do pacote frontend, se em um monorepo) e execute:

```bash
pnpm install
```

Este comando instalará todas as dependências listadas no `package.json`.

## Executando o Projeto

Para iniciar o servidor de desenvolvimento Vite:

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver ocupada).

## Build para Produção

Para gerar os arquivos otimizados para produção:

```bash
pnpm build
```

Os arquivos de build serão gerados no diretório `dist/`.

## Implantação na Vercel

Este projeto inclui um arquivo `vercel.json` configurado para implantação na Vercel usando `pnpm`.

1.  Conecte seu repositório à Vercel.
2.  Se houver variáveis de ambiente necessárias para outras integrações (ex: Google Calendar API key), configure-as nas configurações do projeto na Vercel.
3.  A Vercel deve detectar automaticamente as configurações do `vercel.json` e usar `pnpm` para o build.

## Estrutura do Projeto (Frontend)

```
.
├── public/                     # Arquivos estáticos
├── prisma/
│   └── schema.prisma           # Schema do banco de dados (para referência)
├── index.html                  # Ponto de entrada HTML
├── App.tsx                     # Componente principal da aplicação e rotas
├── index.tsx                   # Ponto de entrada React (renderização)
├── components/                 # Componentes reutilizáveis da UI
│   ├── layout/                 # Componentes de layout (Header, Sidebar, Footer)
│   ├── ui/                     # Componentes básicos (Button, Card, Modal - estilo Shadcn)
│   ├── Auth.tsx                # Componente de autenticação com PIN
│   ├── IdleScreen.tsx          # Tela de descanso
│   └── KanbanBoard.tsx         # Componente do quadro Kanban
├── pages/                      # Componentes de página (rotas)
├── hooks/                      # Hooks customizados (ex: useIdleTimer)
├── services/                   # Lógica para interagir com APIs (ex: Google Calendar)
├── store/                      # Gestão de estado global (Zustand)
├── types.ts                    # Definições globais de TypeScript
├── constants.ts                # Constantes globais
├── utils/                      # Funções utilitárias (ex: formatters)
├── tailwind.config.js          # Configuração do Tailwind CSS
├── vite.config.ts              # Configuração do Vite
├── tsconfig.json               # Configuração do TypeScript
├── package.json                # Dependências e scripts
├── vercel.json                 # Configuração de deploy Vercel
└── README.md                   # Este arquivo
```

## Contribuição

Detalhes sobre como contribuir para o projeto serão adicionados futuramente.

## Licença

Este projeto é fictício e gerado para fins de demonstração. Nenhuma licença específica é aplicada.
Desenvolvido por Big Soluções (fictício).
