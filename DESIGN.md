---
name: Spatial Loading Studio
description: "Maquete técnica para edição espacial / A technical maquette for spatial editing"
colors:
  primary: "#235bd4"
  ground: "#f3f6f7"
  surface: "#fff"
  ink: "#202b36"
  muted: "#4b6070"
  data-ink: "#435b6b"
  line: "#d2dce2"
  selected-surface: "#e5edfc"
  selected-ink: "#163e92"
  object: "#dce6ec"
  object-selected: "#a6c0ef"
  object-edge: "#526875"
  projection-object: "#c7d8e2"
typography:
  title:
    fontFamily: "'Public Sans Variable', sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Public Sans Variable', sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "'Public Sans Variable', sans-serif"
    fontSize: "13px"
    fontWeight: 550
  support:
    fontFamily: "'Public Sans Variable', sans-serif"
    fontSize: "12px"
  data:
    fontFamily: "monospace"
    fontSize: "12px"
rounded:
  control: "5px"
spacing:
  compact: "6px"
  related: "8px"
  control: "12px"
  panel: "16px"
  workspace: "20px"
  separated: "24px"
components:
  button-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-pressed:
    backgroundColor: "{colors.selected-surface}"
    textColor: "{colors.selected-ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  object-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "10px 14px"
  object-row-selected:
    backgroundColor: "{colors.selected-surface}"
    textColor: "{colors.selected-ink}"
    rounded: "0"
    padding: "10px 14px"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 10px"
  section-summary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
---

# Design System: Spatial Loading Studio

## Overview

**Creative North Star: "Maquete técnica / Technical maquette"**

**PT-BR.** A direção descreve uma bancada clara para examinar geometria: superfícies neutras, controles delimitados e azul para ações e seleção. O código coloca objetos, medidas e propriedades no centro do trabalho. “Maquete técnica” é uma direção provisória escolhida pelo responsável pela implementação sob delegação; não há confirmação humana dessa escolha estética.

**EN.** The direction describes a daylight desk for examining geometry: neutral surfaces, bounded controls and blue for actions and selection. The code puts objects, measurements and properties at the centre of the task. “Technical maquette” is a provisional direction chosen by the implementation owner under delegated authority; it is not a human-approved visual identity.

**Evidence / Evidência.** This is a source-derived record of `src/style.css`, the React components and the production assets at the frozen source baseline recorded in the private review. No rendered desktop/mobile captures or computed browser styles were available. The fresh finish review returned `recapture`; visual finish, WebGL rendering, responsive behaviour, rendered contrast, touch and assistive-technology checks remain pending. This document does not close that review. / Este registro deriva da fonte; não comprova acabamento visual ou aprovação de acessibilidade.

**Key Characteristics:**

- Bancada neutra e superfícies brancas delimitadas / Neutral workspace and bounded white surfaces.
- Tipografia compacta com medidas estáveis / Compact type with stable numerical readouts.
- Seleção compartilhada entre lista, propriedades, cena e projeções / Shared selection across hierarchy, properties, scene and projections.
- Controles DOM e projeções exatas quando o WebGL falta / DOM controls and exact projections when WebGL is unavailable.

## Colors

**PT-BR.** Um único acento azul acompanha ações, foco e seleção; neutros frios distinguem fundo, superfícies e geometria. Os valores normativos estão no frontmatter.

**EN.** One blue accent accompanies actions, focus and selection; cool neutrals distinguish the ground, surfaces and geometry. The frontmatter owns the normative values.

### Primary

- **Azul de seleção / Selection blue — `primary`:** botão de aplicar, foco visível, caret, seleção de texto, arestas selecionadas e projeções selecionadas / Apply action, visible focus, caret, text selection, selected edges and selected projections.
- **Seleção suave / Soft selection — `selected-surface`, `selected-ink`:** estados pressionados e linha selecionada / Pressed states and the selected hierarchy row.
- **Material selecionado / Selected material — `object-selected`:** o preenchimento da malha recebe um azul mais claro; as arestas mantêm a identificação ativa / Mesh fill becomes lighter blue while its edges retain the active identifier.

### Neutral

- **Fundo de bancada / Desk ground — `ground`:** raiz, fundo da cena e limites das projeções / Root, scene background and projection bounds.
- **Superfície branca / White surface — `surface`:** painéis, campos, botões e barra superior / Panels, fields, buttons and top bar.
- **Tintas / Inks — `ink`, `muted`, `data-ink`:** texto principal; contexto e ajuda; leituras auxiliares e campos somente leitura / Main text; context and help; auxiliary readouts and read-only fields.
- **Divisória / Divider — `line`:** separação dos painéis, grupos, barras e projeções / Separation of panels, groups, toolbars and projections.
- **Geometria neutra / Neutral geometry — `object`, `object-edge`, `projection-object`:** preenchimento e arestas das caixas; preenchimento das projeções não selecionadas / Box fill and edges; unselected projection fill.

**The Linked Selection Rule.** A seleção aceita usa o mesmo identificador na hierarquia, no contexto do inspetor e nas representações geométricas. / Accepted selection uses the same identifier in the hierarchy, inspector context and geometric representations.

As rampas de oito tons no sidecar são prévias sintetizadas em OKLCH para o painel, sem adoção como cores da aplicação. / The sidecar's eight-step ramps are synthesized OKLCH panel previews, not additional application colours. Contrast has not been measured in a browser.

## Typography

**PT-BR.** Public Sans Variable é importada do pacote local em `src/main.tsx`. O fallback é sans-serif. A interface usa uma família com diferenças pequenas de tamanho e peso; não há voz display separada.

**EN.** Public Sans Variable is imported from the local package in `src/main.tsx`, with a sans-serif fallback. The interface uses one family with small size and weight differences; there is no separate display voice.

### Hierarchy

- **Title:** título do produto; o CSS reduz seu tamanho para (16px) até a largura de (1100px) / Product title; CSS reduces its size to (16px) at widths up to (1100px).
- **Body:** base dos controles, mensagens e resumos; os campos declaram explicitamente o tamanho do corpo / Base for controls, messages and section summaries; fields explicitly declare the body size.
- **Label:** rótulos gerais; linhas numéricas do inspetor e legendas de grupos usam a escala de suporte / General labels; numerical inspector rows and group legends use the support scale.
- **Support:** ajuda, estado, legendas e convenções. IDs de apoio e contagem de histórico usam (11px); esse detalhe denso não é uma escala recomendada para novas mensagens / Help, status, captions and conventions. Supporting IDs and history count use (11px); this dense detail is not a recommended scale for new messages.
- **Data:** somente JSON e matriz de orientação usam monospace. A matriz declara entrelinha (1.3) / Only JSON and the orientation matrix use monospace. The matrix declares line height (1.3).

**The Measurement Type Rule.** Algarismos tabulares acompanham medidas, estatísticas e contagens; monospace acompanha dados estruturados. / Tabular numerals accompany measurements, statistics and counts; monospace accompanies structured data.

## Layout

**PT-BR.** O CSS implementa uma barra superior compacta, uma grade de três colunas e um rodapé de operação. A grade padrão reserva (190px) para a hierarquia, `minmax(340px, 1fr)` para o trabalho e (280px) para o inspetor. A (1600px) ou mais, usa (210px), `minmax(400px, 1fr)` e (300px). Até (1100px), usa (160px), `minmax(280px, 1fr)` e (248px). Não há proporção fixa de dois terços para a cena; sua largura é o espaço restante.

**EN.** The CSS implements a compact top bar, a three-column grid and an operating footer. The default grid assigns (190px) to the hierarchy, `minmax(340px, 1fr)` to the workspace and (280px) to the inspector. At (1600px) and above it uses (210px), `minmax(400px, 1fr)` and (300px). Up to (1100px) it uses (160px), `minmax(280px, 1fr)` and (248px). The scene has no fixed two-thirds proportion; it takes the remaining width.

**PT-BR.** Até (800px), a regra de coluna empilha primeiro a área de trabalho, depois Objetos e Propriedades com `details`/`summary` nativos. O palco 3D declara altura de (390px); as projeções usam altura automática. A lista passa a duas colunas e as três rotações ficam em uma linha. A barra de arquivos quebra para uma linha própria. São regras da fonte, ainda sem validação em pixels ou gestos reais.

**EN.** Up to (800px), a column rule stacks the workspace first, then Objects and Properties using native `details`/`summary`. The 3D stage declares a height of (390px); projections use automatic height. The list becomes two columns and the three rotation controls share a row. File actions wrap onto their own line. These are source rules, pending validation with real pixels and gestures.

Use a escala de espaçamento do frontmatter para grupos e separação. Barras e formulários mantêm alinhamento por padding; os painéis compartilham divisórias, sem uma coleção de cartões. Ajuda de projeção e de navegação declara limites de (72ch) e (75ch). / Use the frontmatter spacing scale for grouping and separation. Toolbars and forms align through padding; panels share dividers. Projection and navigation help declare limits of (72ch) and (75ch).

## Elevation & Depth

**PT-BR.** As superfícies DOM são planas: fundo, bordas e divisórias fazem a separação. A linha selecionada tem duas linhas internas de um pixel, não uma elevação. Não há sombra externa, vidro ou gradiente no CSS. A profundidade pertence à geometria real: material neutro, arestas explícitas, luz ambiente e direcional e grade de referência no plano de chão.

**EN.** DOM surfaces are flat: background, borders and dividers provide separation. The selected hierarchy row has two inset one-pixel lines rather than elevation. The CSS contains no outer shadow, glass or gradient. Depth belongs to real geometry: neutral material, explicit edges, ambient and directional light and a reference grid on the floor plane.

O material de malha declara rugosidade (.82) e metalização (0). O brilho e a leitura das luzes não foram observados em WebGL. / Mesh material declares roughness (.82) and metalness (0). Light appearance and material legibility have not been observed in WebGL.

**The Geometry Depth Rule.** Preserve superfícies de controle planas e deixe luz, volume e arestas da cena comunicar a profundidade espacial. / Preserve flat control surfaces and let scene lighting, volume and edges communicate spatial depth.

## Shapes

**PT-BR.** Controles têm cantos discretos conforme o token `control`; linhas da hierarquia são retangulares, sem arredondamento. Campos e botões usam bordas de um pixel; estado inválido de campo usa borda de dois pixels. A seta do resumo é desenhada com bordas CSS, e os ícones de ação vêm de Lucide com traço consistente.

**EN.** Controls have modest corners using the `control` token; hierarchy rows are rectangular with no rounding. Fields and buttons use one-pixel borders; an invalid field uses a two-pixel border. The disclosure arrow is drawn with CSS borders, and action icons come from Lucide with a consistent stroke.

## Components

### Buttons

**PT-BR.** Ações são rotuladas e usam ícones quando presentes na implementação. O botão neutro tem superfície branca; o primário do formulário usa azul e texto branco. A altura mínima declarada é (44px). O hover neutro muda fundo e borda; o estado ativo escurece o fundo. O primário tem hover próprio. Desabilitado usa fundo pálido e cursor de indisponibilidade. Pressionado usa as cores de seleção.

**EN.** Actions are labelled and use icons where implemented. Neutral buttons use a white surface; the form's primary button uses blue with white text. Declared minimum height is (44px). Neutral hover changes the background and border; active state deepens the background. Primary has a separate hover treatment. Disabled uses a pale ground and an unavailable cursor. Pressed uses the selection colours.

O foco visível comum é um contorno azul de (3px) afastado em (3px); não há transição animada declarada. Ícones em botões e resumos declaram (18px), traço (1.8). / Shared visible focus is a (3px) blue outline with (3px) offset; there is no declared animated transition. Button and summary icons declare (18px), stroke (1.8).

### Hierarchy and section summaries

**PT-BR.** Linhas de objeto ocupam toda a largura e declaram altura mínima de (60px), com nome e ID auxiliar. A seleção troca fundo e tinta e acrescenta duas linhas internas. Resumos nativos declaram altura mínima de (48px), peso (650) e uma seta orientada pelo estado aberto. Objetos, importação, propriedades e volume usam esse agrupamento; a importação e o volume começam recolhidos.

**EN.** Object rows span their available width and declare a minimum height of (60px), with name and supporting ID. Selection changes ground and ink and adds two inset lines. Native summaries declare a minimum height of (48px), weight (650) and an arrow controlled by open state. Objects, import, properties and volume use this grouping; import and volume start collapsed.

### Inputs and recovery

**PT-BR.** Campos são brancos, rotulados, com altura mínima de (44px). Medidas ficam alinhadas à direita e usam algarismos tabulares. ID somente leitura recebe fundo e tinta auxiliares. Um erro liga o resumo de alerta ao campo e o link de revisão solicita foco explícito; a mudança rejeitada preserva o documento aceito. Texto de ajuda, alerta e estado tem versões PT-BR e EN.

**EN.** Fields are white, labelled and have a minimum height of (44px). Measurements align right and use tabular numerals. Read-only ID receives auxiliary background and ink. An error links the alert summary to a field and the recovery link explicitly requests focus; a rejected change preserves the accepted document. Help, alert and status text have PT-BR and EN versions.

### File and view toolbars

**PT-BR.** A barra de arquivos agrupa desfazer e exportações; a barra inferior agrupa navegação, modos e câmera. Ambas quebram linhas. Navegação 3D é um modo explícito com botão de encerramento e Escape; fora dele, a fonte mantém `touch-action: pan-y`. A saída solicita retorno do foco ao botão de navegação. Esses mecanismos ainda precisam de ensaio em browser real.

**EN.** The file toolbar groups undo and exports; the lower toolbar groups navigation, modes and camera actions. Both wrap. 3D navigation is an explicit mode with an end button and Escape; outside that mode the source keeps `touch-action: pan-y`. Exiting requests focus on the navigation toggle. These mechanisms still need real browser testing.

### Linked spatial workspace

**PT-BR.** A mesma seleção controla hierarquia, contexto, material e arestas da malha e retângulos das projeções. Os campos mantêm rascunhos separados até aplicar. A cena usa renderização sob demanda e DPR limitado a (1–1.5), sem giro automático ou amortecimento. Na ausência ou perda de WebGL, as projeções exatas e controles DOM usam o mesmo documento; retângulos oferecem seleção por clique, Enter ou Espaço. A hierarquia permite alcançar objetos pequenos ou coincidentes em uma projeção.

**EN.** The same selection drives hierarchy, context, mesh material and edges and projection rectangles. Fields keep separate drafts until apply. The scene uses demand rendering and bounded DPR (1–1.5), with no automatic spin or damping. When WebGL is absent or lost, exact projections and DOM controls use the same document; rectangles offer selection by click, Enter or Space. The hierarchy reaches objects that are small or coincident in a projection.

O CSS de movimento reduzido remove animações e transições. Nenhuma capacidade depende de animação automática na fonte. / Reduced-motion CSS removes animations and transitions. No source capability relies on automatic animation.

## Do's and Don'ts

### Do:

- **Do** reutilizar a seleção compartilhada e os estados de campo existentes / reuse shared selection and existing field states.
- **Do** manter medidas rotuladas em milímetros e algarismos tabulares / keep measurements labelled in millimetres with tabular numerals.
- **Do** preservar controles DOM, foco visível e recuperação após erro / preserve DOM controls, visible focus and error recovery.
- **Do** verificar PT-BR e EN nas larguras declaradas antes de confirmar o acabamento / verify PT-BR and EN at the declared widths before confirming visual finish.

### Don't:

- **Don't** usar cor ou animação como único meio de identificar a seleção / use colour or animation as the only way to identify selection.
- **Don't** substituir a geometria do documento por ilustração decorativa nas vistas de edição / replace document geometry with decorative illustration in editing views.
- **Don't** tratar testes DOM, objetos de cena ou este documento como aprovação visual ou de acessibilidade / treat DOM tests, scene objects or this document as visual or accessibility approval.
