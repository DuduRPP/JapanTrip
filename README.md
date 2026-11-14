# Viagem ao Japão

Esqueleto de um diário ilustrado de viagem com React, Vite, CSS e conteúdo em JSON. Leia [CONTEXTO.md](CONTEXTO.md) para conhecer as decisões do projeto e saber como atualizar o roteiro durante a viagem.

## Rodar localmente

Use Node.js 22.12 ou mais recente em uma versão LTS.

```sh
npm ci
npm run dev
```

Abra o endereço exibido no terminal. Para verificar a versão de produção, rode `npm run build` e depois `npm run preview`.

## Publicar no GitHub Pages

1. Envie o projeto para seu repositório GitHub com branch principal `main`.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. Em **Actions**, execute **Publicar no GitHub Pages** ou envie um novo commit para `main`.

O workflow gera a pasta `dist` e publica seu conteúdo. As rotas usam fragmentos de URL, como `#/pt/dia/asakusa`, para permitir links diretos dentro do GitHub Pages. Veja o [guia do Vite](https://vite.dev/guide/static-deploy.html#github-pages).
