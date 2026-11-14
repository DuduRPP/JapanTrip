# Contexto do JapanTrip

## Objetivo

O JapanTrip acompanha uma viagem pelo Japão como diário ilustrado e álbum de fotos. Durante a viagem, o dono do roteiro pode pedir a um agente para alterar a programação ou registrar uma visita pelo repositório. Todos os visitantes veem o mesmo progresso publicado. O site é estático e as permissões do GitHub controlam quem pode editar.

A primeira versão traz 12 dias demonstrativos entre Tóquio e Kyoto, de 10 a 21 de abril de 2027, com um deslocamento entre as duas cidades. A branch [`example`](https://github.com/DuduRPP/JapanTrip/tree/example) guarda essa referência, incluindo exemplos de passeios opcionais, preços por unidade e por pessoa, pratos vinculados aos dias e descrições em três idiomas. Datas, hospedagens, valores e marcações da demonstração são ilustrativos. Alguns estabelecimentos são reais e incluem links para as fontes.

## Experiência e decisões de conteúdo

- **Marca e capa.** A aba do navegador se chama **JapanTrip** em todas as rotas. O cabeçalho e a capa mostram **Viagem ao Japão**, **日本の旅日記** ou **Japan Travel Journal** conforme o idioma. A capa tem uma única foto grande e centralizada do torii de Itsukushima, o botão **Começar viagem** e a lista das cidades logo abaixo da foto.
- **Cabeçalho e roteiro.** A barra superior ocupa toda a largura, com o botão **Roteiro** à esquerda, o título centralizado e os controles de PDF e idioma à direita. O painel desliza horizontalmente a partir da esquerda. Dentro dele, a linha do tempo é vertical, agrupa dias consecutivos por cidade e insere os deslocamentos na ordem do roteiro. Cada grupo tem links para a cidade, hotéis, comidas e compras. Em telas estreitas, os controles compactos conservam seus nomes acessíveis.
- **Navegação pelo dia atual.** A marca **Hoje** usa a data local do aparelho e é independente do destaque da página aberta. Quando existe uma etapa para a data, a capa e o painel oferecem **Ir para hoje**. A etapa aberta tem prioridade ao posicionar a rolagem do painel. As setas de anterior e próximo seguem a ordem de `journey`, incluindo deslocamentos.
- **Identidade por cidade.** Cor, símbolo e selo com o nome japonês identificam as páginas de cada cidade. O título usa a cor local, acompanhada de uma divisória. Em telas largas, texto e checklists ficam à esquerda, com as fotos do dia e da visão geral à direita. No celular, as fotos vêm antes do texto. A navegação para os guias da cidade também fica no final das páginas pertinentes.
- **Paradas.** A sequência de `stops` representa a ordem planejada. A página exibe duração aproximada, descrição, progresso e mapa quando esses dados existem. As paradas opcionais aparecem após as principais, em **Se der tempo**, sem numeração e com destaque menor. O roteiro usa estimativas de duração sem horário de início.
- **Comidas e compras.** A página de comidas agrupa salgados e doces, com foto quando disponível, lugares para provar, endereço, mapas e preços cadastrados. A página de compras reúne as lojas sugeridas da cidade. Nos dias, as sugestões apontam para as fichas desses mesmos itens. A proximidade das lojas é definida ao montar o dia.
- **Idiomas e voz.** O seletor usa bandeiras para português brasileiro, japonês e inglês e mantém a rota e o item em foco ao trocar de idioma. Os textos do diário são informais. Em japonês, Tóquio usa uma voz coloquial e Kyoto usa expressões regionais como 「今日は何食べよか？」. Os nomes de pratos e lugares continuam identificáveis em japonês e os endereços preservam a escrita local.
- **Imagens e ícones.** Fotos de lugares e pratos são reais, com autoria, fonte, licença e texto alternativo. Os SVGs identificam cidades e seções e substituem textos em ações como mapa e avançar de etapa. Essas ações conservam rótulos para leitores de tela.

## Rotas

Os exemplos usam português. Troque `pt` por `ja` ou `en` para abrir a mesma página em outro idioma. A URL sem fragmento abre a capa em português.

| Página | Exemplo |
| --- | --- |
| Capa | `#/pt/inicio` |
| Visão geral com foto, apresentação e dias na cidade | `#/pt/cidade/tokyo` |
| Hotéis e valores iniciais por noite | `#/pt/hoteis/tokyo` |
| Paradas, fotos, comidas e lojas do dia | `#/pt/dia/asakusa` |
| Comidas da cidade, com link direto opcional para um prato | `#/pt/sabores/tokyo?prato=taiyaki` |
| Compras da cidade, com link direto opcional para uma loja | `#/pt/compras/tokyo?loja=loft` |
| Deslocamento entre cidades, com tempo, preço e operadora quando cadastrada | `#/pt/trajeto/tokyo-kyoto` |
| Roteiro completo para impressão | `#/pt/pdf` |

## Estrutura técnica

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` e `src/main.jsx` | Entrada do site, título da aba, navegação por fragmento, troca de idioma, formatação via `Intl` e composição das páginas. |
| `src/Timeline.jsx` e `src/LanguagePicker.jsx` | Painel do roteiro, agrupamento das etapas, data local e seleção de idioma com bandeiras. |
| `src/CityHeading.jsx`, `src/TripContent.jsx` e `src/TripPrint.jsx` | Cabeçalhos, conteúdo reutilizado e montagem do roteiro completo para impressão. |
| `src/labels.js`, `src/Icons.jsx` e `src/style.css` | Textos da interface e voz de Kyoto, ícones SVG, layout responsivo e estilo de impressão. |
| `src/data/trip.json` e `src/data/photos.json` | Roteiro, progresso e catálogo de fotos. O Vite inclui os dados no build. |
| `public/manifest.webmanifest`, `src/pwa.jsx` e `src/service-worker.js` | Identidade instalável, controles de instalação e cache offline. |
| `vite.config.js` e `.github/workflows/pages.yml` | Build estático com base relativa, geração do service worker e publicação de `dist/` no GitHub Pages. |

A interface usa React 19, Vite 7, JavaScript com JSX e CSS. O projeto usa npm, com Node.js 22 na publicação. As famílias Crimson Text e Source Sans 3 são distribuídas localmente com suas licenças em `public/fonts/`. Os caracteres japoneses usam as fontes disponíveis no dispositivo.

## Dados do roteiro

### `src/data/trip.json`

- **Raiz.** `demo: true` mostra o aviso de demonstração. `coverPhoto` é um ID do catálogo de fotos. `cities` define as cidades na ordem em que aparecem na capa e no guia impresso. `journey` contém as etapas em ordem de visita.
- **Cidade.** Use `id` estável, `name`, `accent` com uma cor CSS, `symbol` com um ícone de `src/Icons.jsx` e os arrays `stays` e `foods`. `description`, `photo` e `shops` completam o guia. A visão geral usa a primeira foto de um dia da cidade se ela estiver sem `photo`. `"japaneseVoice": "kyoto"` ativa os títulos e rótulos regionais em japonês. Títulos de dias e descrições regionais ficam no campo `ja` de cada item.
- **Hospedagem.** Em `stays`, informe `name` e `fromYen`, que é o valor inicial por noite em ienes. `id` e `url` são opcionais.
- **Dia.** Uma etapa com `type: "day"` tem `id`, `city` com o ID da cidade, `number`, `date` em `AAAA-MM-DD`, `title` e o array `stops`. `photo`, `foodIds` e `shopIds` são opcionais. As referências de prato e loja são IDs da mesma cidade e aparecem na ordem cadastrada.
- **Parada.** Use `id`, `name` e `done` (`true` para visitada). Acrescente `description`, `minutes`, `addressJa` e `mapQuery` conforme a informação disponível. `mapQuery` é a pesquisa usada pelo botão de mapa. `optional: true` move o item para a seção de opcionais, preservando sua ordem entre os opcionais.
- **Deslocamento.** Uma etapa com `type: "transfer"` tem `id`, `from` e `to` com os IDs das cidades e o array `options`. Cada opção tem `id`, `name`, `minutes`, `yen` por pessoa e pode incluir `url` da operadora.
- **Prato.** Em `foods`, informe `id`, `kind` (`savory` ou `sweet`), `name`, `description` e `done` (`true` para experimentado). Pode ter `photo` e `venues`. O prato é a fonte da marcação para a cidade, todos os dias que o sugerem e o PDF.
- **Restaurante ou confeitaria.** Em `venues`, informe `id`, `name`, `description` e `addressJa`. `url` abre a ficha do estabelecimento. Quando houver preço, use `price.yen`, `price.unit` (`person` por pessoa, `piece` por unidade ou `box` por caixa de 10), `price.source` para o link do valor e `price.estimated: true` para exibir o sinal de aproximação. A demonstração inclui preços de estabelecimentos consultados em 14/11/2026.
- **Loja de compras.** Em `shops`, informe `id`, `name`, `description`, `addressJa` e `url` quando houver. A pesquisa do mapa de lojas e restaurantes combina o nome em japonês com o endereço.

Nomes, títulos, descrições e textos alternativos são objetos com chaves `pt`, `ja` e `en`. Português é o fallback quando faltar uma tradução. Preserve IDs em edições de conteúdo, pois as URLs e referências entre listas dependem deles. Todos os preços usam ienes. Ao atualizar preços, guarde a fonte, a unidade de cobrança e a data de consulta. Use dados adequados ao site público.

### `src/data/photos.json`

Cada chave é um ID de foto. O registro contém `url` relativa (por exemplo, `photos/taiyaki.jpg`), `source` para a página de origem, `author`, `license`, `licenseUrl` e `alt` nos idiomas do diário. Coloque as fotos em `public/photos/` para que o build as inclua no cache offline. As capturas de documentação ficam em `docs/screenshots/`.

## PDF e uso offline

- **PDF.** O botão na barra abre o roteiro completo no idioma atual. Na tela do roteiro completo, o botão **Salvar em PDF** aguarda fotos e fontes e abre a impressão do navegador. Escolha a opção de PDF oferecida pelo navegador. A versão de impressão reutiliza os títulos, cores, selos, descrições e checklists do site. Gere um novo PDF para incluir alterações feitas após a exportação anterior.
- **PWA.** Abra a versão publicada com internet e aguarde **Disponível offline** no rodapé. Use **Instalar diário** ou o menu do navegador. No iPhone, abra o menu Compartilhar do Safari e escolha **Adicionar à Tela de Início**. O service worker, registrado no build de produção, guarda a aplicação, dados, fotos locais e fontes. Quando uma versão nova é instalada, ela substitui o cache anterior. Reabra ou recarregue o diário conectado para consultar a versão atualizada. Destinos externos, como mapas e operadoras, dependem de conexão.

## Fluxo de trabalho

- **`dev`** é a branch para continuar o desenvolvimento e revisar mudanças do app e do roteiro.
- **`example`** preserva a primeira versão e seus dados demonstrativos.
- **`main`** é a branch padrão e alimenta o [site público](https://dudurpp.github.io/JapanTrip/). O workflow roda no push de `main` e pode ser acionado manualmente nessa branch.

Durante a viagem, um pedido como “marca o taiyaki de Tóquio como experimentado” vira uma alteração em `cities[].foods[]`, com `done: true` no prato `taiyaki` da cidade `tokyo`. Faça a mudança na branch de trabalho, confira a rota afetada e rode `npm run build`. Faça commit apenas dos arquivos envolvidos e envie para o GitHub. Quando a alteração for para o site, integre-a em `main` e confirme a conclusão da publicação no GitHub Actions. O proprietário já autorizou o agente a fazer commits e pushes para que as atualizações possam ser vistas no celular e no computador.

As instruções para rodar localmente e configurar o Pages estão no [README](README.md).
