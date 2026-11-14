# Contexto de Japão em Capítulos

## Objetivo

Criar um diário de viagem que misture um álbum de fotos com um livro ilustrado. Durante a viagem, o site precisa facilitar a consulta do roteiro e mostrar aos visitantes o mesmo progresso das visitas e das comidas experimentadas. A edição pode ser feita no repositório ou por um agente com permissão para enviar alterações, inclusive a partir de pedidos feitos pelo celular.

## Decisões acordadas

- React para montar as páginas, Vite para gerar o site estático e CSS para o visual responsivo.
- GitHub Pages para hospedagem e GitHub Actions para reconstruir e publicar a cada atualização da branch de publicação.
- Arquivos JSON como fonte do roteiro e das marcações. O site exibe o estado publicado, com acesso de escrita controlado pelo GitHub. A publicação pode demorar alguns minutos.
- Interface e conteúdo em português e japonês, com inglês como opção adicional. Textos do roteiro usam chaves `pt`, `ja` e `en`. Português é a alternativa quando faltar uma tradução. Nomes e endereços japoneses podem aparecer junto da tradução.
- Cada cidade tem cor, ícone e nome próprios. O cabeçalho das páginas da cidade usa o acento no título e na divisória, com um selo do símbolo e do nome em japonês. No computador, texto e checklists ficam à esquerda, com as fotos à direita. No celular, o roteiro vira uma coluna e a galeria do dia aparece acima das paradas.
- Fotografias reais para lugares e pratos, com autoria, fonte e licença registradas. Ícones desenhados em SVG identificam cidades e seções.
- A capa tem uma foto central do torii de Itsukushima, um botão “Começar viagem” que leva à primeira etapa e uma seção de cidades abaixo da foto.
- O botão “Percurso” abre um painel que desliza pela esquerda. A lista dentro dele vai de cima para baixo, com os deslocamentos entre as cidades e atalhos para visão geral, hotéis, comidas e compras.
- Quando um dia tem a mesma data local do dispositivo, ele recebe a marca “Hoje”. O atalho “Ir para hoje” leva direto a ele. A página que está aberta tem seu próprio destaque, inclusive ao consultar outras datas.

## Páginas

| Página | Conteúdo |
| --- | --- |
| Capa | Foto de abertura, link para começar a viagem e links para as cidades. |
| Visão geral da cidade | Foto, apresentação, links para hotéis e comidas e lista de dias na cidade. |
| Hotéis da cidade | Opções de hospedagem com preços iniciais por noite e links quando disponíveis. |
| Dia | Fotos, título, cidade, data, paradas em ordem com descrição e duração estimada, progresso, mapas, sugestões de comida e lojas próximas. |
| Comidas da cidade | Comidas salgadas e doces, com fotos quando disponíveis, estado de cada item e lugares onde provar. |
| Compras da cidade | Lojas sugeridas, com descrição, endereço em japonês, mapa e link da loja. |
| Deslocamento | Origem, destino, opções de transporte, tempo estimado, preço por pessoa e link da operadora quando disponível. |
| Roteiro completo | Versão de impressão, no idioma selecionado, com capa, fotos, dias, transportes, hospedagens e comidas. |

O esqueleto usa 12 dias entre Tóquio e Kyoto para exercitar a linha do tempo. Datas, valores e marcações são ilustrativos. Para preços reais, registrar a moeda, a unidade de cobrança, a fonte e a data da consulta. Usar apenas informações adequadas a um site público.

## Onde editar

- `src/data/trip.json` reúne as cidades, suas estadias e comidas, além da sequência `journey`. Essa sequência intercala dias (`day`) e deslocamentos (`transfer`) na ordem da viagem.
- Em `trip.json`, `coverPhoto` indica a foto da capa. Cada cidade pode definir `photo`, `description`, `accent` e `symbol`. As rotas de cidade usam os formatos `#/pt/cidade/tokyo`, `#/pt/hoteis/tokyo` e `#/pt/sabores/tokyo`.
- `src/data/photos.json` associa identificadores de fotos a caminhos relativos, texto alternativo por idioma, autoria e licença. Coloque os arquivos em `public/photos/` para incluí-los no cache offline do site.
- `src/labels.js` guarda os textos fixos da interface.
- Em `trip.json`, `city.shops` lista sugestões de compras e `food.venues` lista lugares onde provar um prato. Esses dados aparecem também no PDF. Guarde o endereço em `addressJa` e a fonte da loja em `url`.

Para registrar uma visita ou comida, altere `done` para `true` no item correspondente. Use `false` para desfazer a marcação. Mantenha os identificadores ao editar nomes ou durações, pois as URLs usam o ID da etapa. Em um pedido como “marca o taiyaki de Tóquio como experimentado”, o agente deve editar o item na cidade correta, validar com `npm run build` e enviar a alteração conforme as permissões do repositório.

Coloque as paradas em `stops` na ordem em que pretende visitá-las. A página numera essa sequência e exibe `minutes` como duração aproximada. Use `mapQuery` para o destino pesquisável no mapa, `addressJa` para o endereço em japonês e `description` para os textos da parada. `foodIds` lista os pratos sugeridos da cidade. `shopIds` lista lojas da cidade escolhidas para aquele dia por proximidade.

## PDF e uso offline

O botão “Salvar em PDF” abre o roteiro completo. Na página de impressão, use “Salvar em PDF” e selecione a opção de PDF oferecida pelo navegador. O arquivo é uma cópia da versão exibida e pode ser compartilhado ou lido sem internet.

Para usar como aplicativo, abra o site com internet e aguarde a indicação “Disponível offline” no rodapé. Use “Instalar diário” ou o menu do navegador. No iPhone, use o menu Compartilhar do Safari e selecione “Adicionar à Tela de Início”. O service worker guarda a versão do roteiro, fotos e fontes no aparelho. Mapas, operadoras e outros links externos dependem da conexão.

As instruções de execução e publicação estão no [README](README.md).

## Fluxo de atualização

Ao concluir uma alteração neste projeto, valide o resultado, faça um commit apenas dos arquivos envolvidos e envie para `origin/main`. Confira o resultado do GitHub Pages e informe o link ou o motivo de qualquer falha. Assim, a mesma versão fica disponível no computador e no celular.
