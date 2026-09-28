# DoceCusto

MVP acadêmico de formação de custos para confeitaria.

## Tecnologias
- React + Vite
- React Router
- Supabase / PostgreSQL
- CSS + Flexbox
- GitHub + Vercel

## Requisitos demonstrados
- Componentização pai/filho
- Props
- `.map()` com `key`
- `useState` e `onClick`
- Navegação SPA
- Formulários e CRUD de itens
- Persistência no Supabase
- Cálculo proporcional de custos
- Simulação de produção, faturamento, lucro e margem

## Rodar localmente
```bash
npm install
npm run dev
```

Crie `.env.local` com:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Execute `supabase/schema.sql` no SQL Editor do Supabase antes de usar o CRUD.
