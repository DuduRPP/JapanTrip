# Guia para pesquisar e preencher o roteiro do JapanTrip

Use este documento junto com os arquivos e as ideias do dono da viagem. Ele orienta a pesquisa e a tradução dessas informações em dados do site. O [contexto da aplicação](../CONTEXTO.md) descreve as decisões de produto e o [roteiro de exemplo](https://github.com/DuduRPP/JapanTrip/blob/example/src/data/trip.json) mostra o formato em uso.

## Mensagem para passar ao agente

> Use este guia, o `CONTEXTO.md` e os materiais que anexei para montar ou atualizar a parte do JapanTrip que estou pedindo. Comece pelas cidades, datas, deslocamentos, reservas e prioridades que eu já defini. A partir daí, pesquise o que falta para montar dias viáveis, com paradas em ordem, estimativas de duração, hospedagens, transporte, comidas salgadas e doces, restaurantes e lojas próximas. Use os meus interesses e restrições para escolher o que entra. Indique quando algo é uma sugestão sua, uma estimativa ou uma decisão que ainda depende de mim.
>
> Escreva em português brasileiro, japonês e inglês com tom de diário. Em japonês, use expressões locais que soem naturais quando combinarem com a cidade. Proponha também uma cor, um símbolo e uma foto representativa por cidade. Preencha o formato que o site já usa, confira as referências e mostre as fontes que sustentam as escolhas. Se você tiver acesso ao repositório, trabalhe na branch de trabalho e valide o resultado. Se você tiver somente os documentos, entregue os dados no formato descrito neste guia para que eu possa repassá-los a quem vai integrar.

## 1. Ler o plano antes de pesquisar

- Leia os documentos, listas, reservas e ideias como partes do mesmo roteiro. Para cada trecho, identifique a data local, a cidade-base, as noites de hospedagem, a origem e o destino de cada deslocamento e os compromissos com horário ou ingresso.
- Registre preferências expressas, como lugares e pratos prioritários, interesses de compras, orçamento, ritmo, restrições alimentares, mobilidade e tolerância a filas. Aproveite o que o viajante já decidiu. Se uma fonte atual indicar que um plano ficou inviável, indique a razão e apresente uma alternativa próxima.
- Trate reservas e escolhas explícitas como confirmadas. Trate ideias como candidatas. Em documentos conflitantes, identifique a divergência e veja se há uma decisão mais recente. Quando houver ambiguidade material sobre datas, destino, reserva ou orçamento, peça a confirmação específica e avance nas partes independentes.
- Separe cidade-base, bate-volta e mudança de hospedagem. Um dia aceita uma única cidade em `city`. Se for um bate-volta, escolha qual guia deve reunir as sugestões desse dia. Quando o destino tiver conteúdo próprio suficiente para um guia, cadastre-o como cidade e atribua o dia a ele. Se o dia continuar na cidade-base, descreva a excursão e seus trajetos nas paradas. Use etapas `transfer` para deslocamentos relevantes que merecem uma página própria.
- Se o pedido cobrir só um trecho, preserve as demais etapas reais já cadastradas. Use a branch `example` como modelo de estrutura. Ao migrar a demonstração, mantenha `demo: true` enquanto houver conteúdo ilustrativo apresentado como parte daquele conjunto. Quando o itinerário exibido representar a viagem, ajuste para `demo: false`.

Uma tabela de trabalho pode reunir **data**, **cidade-base**, **compromisso fixo**, **prioridade**, **bairro ou estação**, **pendência** e **referência ao material original**. Use datas absolutas quando elas estiverem definidas. O site precisa de `date` em `AAAA-MM-DD` para exibir a etapa e destacar **Hoje**. Quando uma data estiver em aberto, mantenha o dia como proposta nas notas até ter um valor para o JSON.

## 2. Pesquisar o que muda a decisão

Priorize as páginas oficiais em japonês ou inglês de cada local, loja, hotel, operadora e órgão de turismo. Confirme se a página se refere à filial certa e se vale para a data ou temporada da visita. Use mapas para conferir localização, estação, ordem das paradas e estimativas de caminhada. Use avaliações e guias locais para complementar o contexto, com a fonte oficial como referência para funcionamento, ingressos e tarifas quando disponível.

| Área | O que verificar | Como usar no roteiro |
| --- | --- | --- |
| **Atrações e experiências** | Nome oficial em japonês, endereço, entrada correta, estação, horários na data planejada, dia de fechamento, ingresso, reserva, fila, condições sazonais e tempo razoável de visita. | Escreva o que fazer ou observar ali. Inclua uma condição prática quando ela mudar a visita, como reservar antes, chegar antes da última entrada ou acessar por uma saída específica. |
| **Ordem e ritmo do dia** | Caminhadas, linhas de metrô ou ônibus, conexões, tempo de espera e deslocamento até o hotel. Veja se a sequência respeita os compromissos e deixa tempo para comer, descansar e se orientar. | Agrupe por região e organize na ordem de visita. Use `minutes` para a permanência estimada na parada. Considere o tempo de trajeto separadamente e mencione-o na descrição apenas se ajudar a navegar. |
| **Hospedagem** | Reserva existente, estação e bairro, facilidade para a chegada e a saída, valor para as datas e ocupação da viagem, impostos e condições que afetem o preço. | Selecione opções adequadas ao roteiro e ao orçamento. Use `fromYen` como preço inicial por noite com base clara. Em caso de reserva existente, publique apenas as informações necessárias para o diário. |
| **Transporte entre cidades** | Terminais ou estações reais, operador, tempo de viagem e conexões, tarifa por pessoa, classe ou assento, necessidade de reserva e condições para bagagem ou passes quando relevantes. | Compare as opções que o viajante realmente consideraria. Use a mesma base de tarifa e identifique a estação, a modalidade ou o serviço no nome da opção quando isso distinguir alternativas. |
| **Comidas regionais** | Pratos salgados e doces ligados à cidade, especialidades que combinam com a época e os gostos do viajante, nome japonês e o que torna cada item interessante. | Cadastre cada prato uma vez na cidade. No dia, sugira os que têm opções realistas perto do passeio. Um mesmo prato pode aparecer em mais de um dia. |
| **Restaurantes e confeitarias** | Filial, endereço em japonês, especialidade, horário de almoço ou jantar, fila, reserva, restrições alimentares e preço no cardápio oficial. | Cadastre em `venues` do prato, com uma descrição curta de por que vale parar ali. Use uma estimativa por pessoa para a refeição ou um preço por unidade para o produto, conforme a fonte. |
| **Compras** | Lojas úteis para os interesses do viajante, filial, endereço, produtos procurados e distância das paradas. | Cadastre a loja no guia da cidade e vincule aos dias em que ela cabe na rota. Use `venues` para uma confeitaria sugerida para provar um doce. Use `shops` para uma parada de compras com interesse próprio. |
| **Fotografias** | Local ou prato retratado, autoria, licença de reutilização e página de origem. | Use fotos reais com licença adequada. Escolha uma imagem representativa por cidade e uma foto para os dias e pratos em que encontrar bons arquivos. |

### Registrar preços, evidências e incertezas

- Para fatos que mudam o plano, anote o que foi verificado, o link direto, a data da consulta e a condição relevante. Por exemplo, uma tarifa pode valer só para determinada classe, data ou ocupação. Quando houver dado futuro indisponível, indique a base da estimativa ou deixe a decisão em aberto.
- Use ienes como unidade no JSON. Em `food.venues[].price`, `estimated: true` mostra o símbolo de aproximação e `source` deve apontar para o cardápio ou página do valor. O formato tem as unidades `person`, `piece` e `box`. Esta última aparece como **por caixa de 10**, então use-a somente para esse tamanho.
- Hotéis e opções de transporte exibem valores numéricos quando cadastrados. Se ainda não houver uma estimativa com base suficiente, deixe a opção pendente no resumo da pesquisa. Informações como horário, reserva, data da consulta, faixa de preço e contexto da estimativa podem ficar nas notas da pesquisa. Acrescente à descrição da parada, do prato ou do estabelecimento somente o que couber no formato e ajudar durante a viagem.
- Guarde referências às notas privadas durante a preparação. Para a publicação, use os nomes, endereços públicos e detalhes de visita necessários ao roteiro. Mantenha dados de reserva, contatos pessoais e comprovantes com o viajante.

## 3. Montar dias que funcionem no celular

1. Comece pelos compromissos fixos e pela região principal do dia. Escolha uma sequência que faça sentido a partir da chegada e até a saída. Em dias com transferência ou voo, considere a bagagem e o tempo de conexão antes de acrescentar passeios.
2. Coloque em `stops` as paradas principais na ordem planejada. Use `optional: true` para desvios, alternativas flexíveis ou paradas que cabem se sobrar tempo. O site separa esses itens em **Se der tempo**. A página se orienta por duração e sequência. Quando houver uma reserva com horário que seja essencial para a visita, inclua essa informação na descrição com a precisão que o viajante confirmou.
3. Escreva uma descrição de uma ou duas frases que ajude a decidir o que fazer naquele lugar. Use `mapQuery` para a entrada ou o ponto correto e `addressJa` quando for útil. Se o nome for ambíguo, combine nome japonês com cidade, bairro ou endereço na consulta.
4. Relacione comidas e compras pelo trajeto e pelo tempo disponível. Dê prioridade a sugestões que façam sentido antes ou depois das paradas. Se um restaurante funciona só no almoço, leve isso em conta ao recomendar o prato para o dia.
5. Inicialize `done: false` em novos passeios e pratos, salvo quando o viajante já tiver informado que concluiu o item. Para atualizar depois, edite a parada ou o prato canônico. O mesmo `done` do prato aparece em todos os dias que o referenciam.

## 4. Escrever em português, japonês e inglês

- **Português brasileiro.** Use títulos curtos com algo reconhecível da visita, como o bairro ou a experiência. “Nishiki de barriga vazia” dá o tom e situa o dia. Nas descrições, dê uma ideia concreta do que fazer.
- **Japonês.** Preserve o nome oficial do lugar, da loja e do prato. Dê personalidade aos títulos e às descrições. Em Kyoto, expressões como 「今日は何食べよか？」 funcionam como voz de diário. 「食べ倒す」 cabe num título gastronômico mais brincalhão. Para outra região, confirme o uso local e use japonês coloquial quando a expressão regional ficar incerta. Endereços permanecem na grafia japonesa.
- **Inglês.** Adapte a ideia do título com naturalidade e mantenha os detalhes práticos equivalentes. Use o nome em inglês do próprio local quando houver. Datas, reservas, duração, condições de visita e preços precisam ser coerentes entre os idiomas.

Os campos de texto usam objetos com `pt`, `ja` e `en`. Português é a alternativa do site quando uma tradução falta. A voz regional dos títulos e descrições editáveis vai diretamente no campo `ja`. A opção `japaneseVoice: "kyoto"` muda também alguns rótulos da interface. Para outra voz de interface, implemente-a em `src/labels.js` quando houver uma cidade e expressões definidas.

## 5. Definir cor, símbolo e foto de cada cidade

A identidade pode ser escolhida ao preencher os dados. Cada cidade traz `accent` para a cor e `symbol` para a chave do ícone. O site aplica a cor ao título, à divisória, ao selo e a detalhes da linha do tempo. O selo combina o ícone com `name.ja`. A capa, o painel **Roteiro** e o PDF também reutilizam a identidade cadastrada.

- Escolha uma cor com contraste sobre o fundo claro do diário e que ajude a distinguir a cidade das vizinhas na linha do tempo. Tóquio usa `#913e50` e Kyoto usa `#376451`. Use um hexadecimal no campo `accent`.
- Escolha um motivo fácil de reconhecer em tamanho pequeno, associado à cidade ou a uma experiência importante da viagem. Para trabalhar só com os dados, use uma chave que já exista em [`src/Icons.jsx`](../src/Icons.jsx), como `torii`, `tower` ou `book`. `symbol` espera uma chave registrada.
- Se a cidade merecer um desenho próprio, adicione uma entrada SVG em `src/Icons.jsx` no mesmo commit em que a cidade for preenchida. Use a grade `24 × 24`, as linhas do componente existente e uma silhueta simples que funcione em uma cor. Depois coloque a nova chave em `symbol`. Confira o selo ao lado de um título longo no celular e no PDF.
- Escolha uma foto que ajude a reconhecer a cidade, de preferência com enquadramento que ainda funcione no recorte do site. Em `photos.json`, registre o arquivo, a fonte, o autor, a licença, o link da licença e o texto alternativo em cada idioma.

## 6. Preencher os arquivos existentes

| Dados | Onde registrar |
| --- | --- |
| Identidade, descrição e guias | `src/data/trip.json` em `cities[]`, com `id`, `name`, `description`, `accent`, `symbol`, `photo` e as listas `stays`, `foods` e `shops`. Use `stays: []` ou `foods: []` se o guia ainda estiver sem itens. |
| Hotéis | `cities[].stays[]`, com `name`, `fromYen` e `url` quando disponível. |
| Pratos | `cities[].foods[]`, com `id`, `kind` (`savory` ou `sweet`), `name`, `description`, `done` e, quando houver, `photo` e `venues`. |
| Lugares para comer e lojas | `foods[].venues[]` ou `cities[].shops[]`, com `id`, `name`, `description`, `addressJa` e `url` quando houver. Acrescente `price` quando tiver valor e fonte para exibir. |
| Dias e passeios | `journey[]` com `type: "day"`, `id`, `city`, `number`, `date`, `title`, `stops` e, se couber, `photo`, `foodIds` e `shopIds`. Em cada parada, use `id`, `name`, `done` e os campos de visita descritos acima. |
| Transferências | `journey[]` com `type: "transfer"`, `id`, `from`, `to` e `options[]`. Cada opção usa `id`, `name`, `minutes`, `yen` e, se disponível, `url` da operadora. |
| Fotos | Arquivos em `public/photos/` e catálogo em `src/data/photos.json`. Use `url` relativa como `photos/kiyomizu.jpg`. `coverPhoto` e cada `photo` apontam para chaves desse catálogo. JPG, PNG e WebP são incluídos pelo build no cache offline. |

Para novos IDs, use letras minúsculas, números e hífens. Mantenha os IDs existentes quando atualizar um item. `journey` é a ordem da linha do tempo, e `number` é o número exibido no dia. Confira se `from`, `to` e `city` apontam para cidades cadastradas. `foodIds` e `shopIds` precisam apontar para itens da cidade indicada em `city`. O site usa esses IDs para abrir a ficha exata do prato ou da loja no guia.

O dia de [Higashiyama](https://dudurpp.github.io/JapanTrip/#/pt/dia/higashiyama) mostra como isso funciona. A etapa `higashiyama` aponta para `kyoto`, traz a foto `kiyomizu`, sugere `yudofu` e `yatsuhashi` e vincula a loja `asahido`. O prato `yatsuhashi` também pode aparecer em outros dias de Kyoto e mantém uma única marcação no guia da cidade.

Este objeto, extraído da demonstração, é um dia completo para inserir em `journey` quando os IDs referenciados já estiverem cadastrados.

```json
{
  "id": "higashiyama",
  "type": "day",
  "city": "kyoto",
  "number": 8,
  "date": "2027-04-17",
  "title": {
    "pt": "Ladeira acima em Higashiyama",
    "ja": "東山の坂、ぼちぼち上ろか",
    "en": "Uphill in Higashiyama"
  },
  "photo": "kiyomizu",
  "stops": [
    {
      "id": "higashiyama-visit",
      "name": {
        "pt": "Templo Kiyomizu-dera",
        "ja": "清水寺",
        "en": "Kiyomizu-dera Temple"
      },
      "description": {
        "pt": "Suba pelas ruas de Higashiyama até o templo e aproveite a vista da encosta.",
        "ja": "東山の坂を上って清水寺へ。上まで来たら、景色を眺めてひと息つこか。",
        "en": "Climb the streets of Higashiyama to the temple and enjoy the hillside view."
      },
      "minutes": 90,
      "mapQuery": "清水寺 京都",
      "done": false
    }
  ],
  "foodIds": ["yudofu", "yatsuhashi"],
  "shopIds": ["asahido"]
}
```

## 7. Validar e entregar

- Confira a ordem das datas, o tempo disponível por dia, o encadeamento dos transportes e a consistência com os compromissos definidos pelo viajante. Verifique os IDs, os arquivos de fotos e as referências aos guias.
- Execute `npm run build`. Abra `npm run preview` e confira a capa, o painel, os guias e pelo menos um dia de cada cidade alterada. Teste a troca de idioma, os links de prato e loja, o mapa de uma parada e a versão de impressão. Se houver novas fotos, confira se carregam também após preparar o modo offline.
- Se trabalhar sem acesso ao repositório, entregue JSON válido em blocos separados para `cities[]`, `journey[]` e `photos.json`. Indique a posição das novas etapas e quais IDs existentes devem ser atualizados. Para fotos, entregue os arquivos ou as páginas de origem com os metadados e o nome de arquivo sugerido.
- Entregue um resumo com o que foi preenchido, as escolhas editoriais ou de ordem que você fez, as principais fontes e as decisões pendentes. Quando trabalhar no repositório, informe a branch e o commit. `dev` é a base de trabalho, `example` é a referência demonstrativa e a integração em `main` publica a versão no GitHub Pages.
