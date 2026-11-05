# Spatial Loading Studio

Versão de desenvolvimento **0.1.0** · Software original da [Lofrano Tecnologia](https://lofranotecnologia.com.br) · MIT

[English](README.md)

Editor local de ocupação espacial com caixas delimitadas. Examine seis caixas sintéticas em uma cena real React Three Fiber / Three.js, selecione um objeto, edite milímetros inteiros, gire em quartos de volta nos eixos do mundo, desfaça e exporte um plano determinístico. A interface abre em português e possui seletor completo para inglês.

É uma ferramenta conceitual em desenvolvimento, não uma ferramenta de certificação de carga, apoio, segurança, fabricação ou engenharia. Não há conta, armazenamento remoto, telemetria, API externa nem serviço de assets em execução.

## Instalar e executar

Use Node 22.23.4 e npm 10.9.9 para reproduzir o ambiente de dependências registrado. As dependências diretas têm versões exatas em `package.json`; em uma cópia com o lockfile gerado pelo npm:

```sh
npm ci --ignore-scripts
npm run dev
```

Abra o endereço local informado pelo Vite. A instalação precisa dos pacotes npm; depois dela, aplicação e CLI não precisam de API nem conexão de rede. A fonte variável Public Sans e todo o código são empacotados localmente.

```sh
npm test
npm run demo -- --assert
npm run demo -- --assert --json
npm run build
npm run preview
```

`npm test` verifica TypeScript estrito, incluindo declarações de bibliotecas, gera a aplicação estática, confere o comentário inicial do HTML e executa testes de núcleo, objetos de cena e interações ReactDOM. As verificações da CLI são executadas separadamente com `npm run demo -- --assert`.

O base padrão do Vite é `./`, compatível com subdiretórios de repositório. Também é possível defini-lo explicitamente:

```sh
APP_BASE=/spatial-loading-studio/ npm run build
```

A saída é estática, sem service worker. Abrir uma página anteriormente não garante funcionamento sem servidor local ou cache do navegador. Não há workflow de publicação ou implantação.

## Experimente uma edição

1. Selecione **B06** na lista ou em uma projeção. Seu canto mínimo é `[0,800,0]` mm.
2. Defina a posição mínima X como `100` e aplique. A caixa permanece acima da camada inferior, sem cálculo de apoio.
3. Tente X `12000`. O erro aponta para o campo; geometria aceita, seleção e histórico permanecem intactos.
4. Restaure X `100`, gire +90° em X e desfaça. A orientação exata muda mesmo quando as dimensões orientadas são iguais.
5. Exporte JSON ou SVG independente com três vistas. Os arquivos usam sempre a geometria aceita, nunca os rascunhos.

A câmera tem ativação explícita: escolha **Navegar em 3D** para orbitar, deslocar ou aproximar. **Encerrar navegação** ou Esc desconecta os controles e devolve o foco ao botão. Fora desse modo, a rolagem da página permanece disponível. Enquadramento/restauração e seleção continuam acessíveis. O ciclo dos controles é testado em DOM simulado; gestos e roda reais ainda exigem QA em navegador.

O inspetor edita dimensões **base**, posição e rótulo. A leitura das dimensões orientadas reflete a matriz atual. O redimensionamento do espaço está em **Volume delimitador**. Uma caixa nova possui dimensões e posição editáveis; a adição não procura espaço livre automaticamente. A importação aceita arquivo ou JSON colado. Cada importação válida é uma substituição desfazível, mesmo se idêntica ao documento atual.

Sem WebGL, após falha ou perda de contexto, o mesmo documento continua editável pelas três projeções ortográficas exatas e pelos controles DOM rotulados. Retângulos das projeções aceitam Enter ou Espaço para seleção. A lista continua disponível quando objetos pequenos ou sobrepostos na projeção são difíceis de selecionar.

## Saída de exemplo

Prefixo legível de `npm run demo -- --assert`:

```text
Spatial Loading Studio — development 0.1.0
Synthetic boxes: 6 | occupied: 3840000000 mm³
Container: 34560000000 mm³ | occupancy (rounded): 11.1%
Assertions: passed
```

Depois vem uma linha `JSON:` com o resultado e o documento completos e determinísticos. `--json` remove o prefixo humano e emite um único objeto JSON. Alguns campos esperados são `occupied_mm3: 3840000000`, `container_mm3: 34560000000` e `rounded_occupancy: "11.1%"`. São expectativas aritméticas de dados sintéticos, não alegações de desempenho ou implantação. A CLI termina com código diferente de zero se uma verificação falhar.

## Pequeno exemplo do núcleo

```ts
import { createSession, demoDocument, rotate, toJSON, undo } from './src/core';

const inicial = createSession(demoDocument());
const girado = rotate(inicial, 'box-006', 'X');
const restaurado = undo(girado);
console.log(toJSON(restaurado.document));
```

`validate(unknown)` captura campos próprios de dados e devolve um documento profundamente congelado. `change(session, candidate)` valida antes de substituir qualquer coisa e lança um `Fault` estruturado em caso de rejeição. `importText` limita bytes UTF-8 antes da decodificação. Consulte o [contrato exato](docs/contract.md) antes de chamar essas funções.

## Decisões

O espaço técnico claro coloca a geometria entre uma lista estável e um inspetor numérico. O azul de seleção conecta malha real, lista, inspetor e projeções. A autoridade é um núcleo inteiro sem dependências, não o teste de interseção de um renderizador. Contatos de face, aresta e vértice são legais; apenas interseção interior positiva nos três eixos é rejeitada.

[Projeto e limites de verificação](docs/design.md) descreve câmera, descarte, fallback, idioma e testes. [Avisos de terceiros](docs/third-party.md) distinguem as licenças das dependências do código original MIT.

## Limitações e evidências

- Até 200 caixas; dimensões de 1 a 12000 mm; JSON de até 256 KiB; vinte estados anteriores de comandos bem-sucedidos. Sem refazer ou persistência automática.
- Apenas 24 orientações ortogonais direitas. Sem ângulos arbitrários, malhas importadas, otimização, gravidade, peso ou modelo de apoio.
- Ocupação significa volume geométrico. A interface portuguesa exibe `11,1%`; os planos exportados usam `11.1%`, independente de idioma.
- O JSON segue um subconjunto estrito documentado, com rejeição de chaves repetidas. Não há alegação de implementação de todos os padrões de intercâmbio ou engenharia.
- Os testes DOM usam JSDOM em VM outside-only; os testes de cena inspecionam objetos Three.js reais sem GPU. Não comprovam renderização WebGL real, responsividade, uso de ponteiro ou acessibilidade em navegador.
- QA real de navegador, WebGL, ponteiro, responsividade e acessibilidade ainda não foi realizado. Não há capturas de tela ou revisão visual renderizada fornecidas; o projeto visual não é declarado concluído.
- Leitura e download de arquivos podem falhar; o último estado válido é preservado. Recarregar perde edições não exportadas. O validador público não isola objetos Proxy.

Segurança: [relato privado de vulnerabilidade no GitHub](https://github.com/martinlofranodeoliveira/spatial-loading-studio/security/advisories/new). Contato geral: [site oficial](https://lofranotecnologia.com.br).

## Adicionar com prévia

**Adicionar caixa** procura uma posição inicial validada na origem e nas três faces positivas de cada caixa aceita: no máximo 601 candidatos, sem otimização de empacotamento. Na cena inicial, a sugestão é `[3000,0,0]` mm. As dimensões iniciais são limitadas ao volume. Não encontrar uma sugestão não prova falta de espaço; ajuste os campos. A prévia translúcida identificada (tracejada nas projeções) só aparece para um rascunho válido. Contagem, histórico e exportações continuam usando as caixas aplicadas. **Aplicar alterações** adiciona a caixa em uma operação; **Cancelar adição** preserva o documento.
