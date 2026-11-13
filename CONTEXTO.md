# Contexto do Diário do Japão

## Objetivo

Criar um diário de viagem que misture um álbum de fotos com um livro ilustrado. Durante a viagem, o site precisa facilitar a consulta do roteiro e mostrar aos visitantes o mesmo progresso das visitas e das comidas experimentadas. A edição pode ser feita no repositório ou por um agente com permissão para enviar alterações, inclusive a partir de pedidos feitos pelo celular.

## Decisões acordadas

- React para montar as páginas, Vite para gerar o site estático e CSS para o visual responsivo.
- GitHub Pages para hospedagem e GitHub Actions para reconstruir e publicar a cada atualização da branch de publicação.
- Arquivos JSON como fonte do roteiro e das marcações. O site exibe o estado publicado, com acesso de escrita controlado pelo GitHub. A publicação pode demorar alguns minutos.
- Interface e conteúdo em português e japonês, com inglês como opção adicional. Textos do roteiro usam chaves `pt`, `ja` e `en`. Português é a alternativa quando faltar uma tradução. Nomes e endereços japoneses podem aparecer junto da tradução.
- Cada cidade tem cor, ícone e nome próprios. Cada dia tem título e foto de abertura próprios. No computador, a foto pode aparecer acima do roteiro ou na coluna à direita. No celular, aparece acima do conteúdo associado.
- Fotografias reais para lugares e pratos, com autoria, fonte e licença registradas. Ícones desenhados em SVG identificam cidades e seções.

## Páginas

| Página | Conteúdo |
| --- | --- |
| Visão geral | Ordem do percurso e opções de hospedagem com preços iniciais por noite e links quando disponíveis. |
| Dia | Foto, título, cidade, data, paradas, horários, duração estimada, progresso e links para mapa. |
| Sabores da cidade | Comidas salgadas e doces, com fotos quando disponíveis e estado de cada item. |
| Deslocamento | Origem, destino, opções de transporte, tempo estimado, preço por pessoa e link da operadora quando disponível. |

O primeiro esqueleto usa Tóquio e Kyoto como cidades de exemplo. Datas, valores e marcações servem para demonstrar a interface. A viagem real será adicionada quando o roteiro estiver disponível. Para preços reais, registrar a moeda, a unidade de cobrança, a fonte e a data da consulta. Usar apenas informações adequadas a um site público.

## Onde editar

- `src/data/trip.json` reúne as cidades, suas estadias e comidas, além da sequência `journey`. Essa sequência intercala dias (`day`) e deslocamentos (`transfer`) na ordem da viagem.
- `src/data/photos.json` associa identificadores de fotos a URL, texto alternativo por idioma, autoria e licença. As fotos de exemplo vêm do Wikimedia Commons. É possível referenciar imagens do próprio projeto usando uma URL relativa à raiz do site publicado.
- `src/labels.js` guarda os textos fixos da interface.

Para registrar uma visita ou comida, altere `done` para `true` no item correspondente. Use `false` para desfazer a marcação. Mantenha os identificadores quando corrigir nomes ou horários, pois as URLs usam o ID da etapa. Em um pedido como “marca o taiyaki de Tóquio como experimentado”, o agente deve editar o item na cidade correta, validar com `npm run build` e enviar a alteração conforme as permissões do repositório.

Para um novo dia, escolha `layout: "top"` para foto acima do roteiro ou `layout: "side"` para foto à direita em telas largas. Um horário de visita pode ser omitido. Use `minutes` para duração aproximada e `mapQuery` para o destino pesquisável no mapa. Informe `addressJa` quando tiver o endereço em japonês.

As instruções de execução e publicação estão no [README](README.md).
