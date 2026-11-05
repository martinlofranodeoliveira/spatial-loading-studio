import { Fault } from './core';
export type Locale = 'pt' | 'en';
export const pt = {
  draftPreview: 'Rascunho não aplicado', draftInvalid: 'Sem prévia válida. Ajuste dimensões, posição ou ID; o documento aplicado está preservado. A sugestão inicial usa uma busca limitada, sem otimização de encaixe.', draftHelp: 'Prévia translúcida: ainda fora da contagem, do histórico e das exportações. Aplique para adicionar ou cancele.',
  title: 'Spatial Loading Studio', version: 'Desenvolvimento 0.1.0', language: 'Idioma',
  objects: 'Objetos', properties: 'Propriedades', volume: 'Volume delimitador',
  add: 'Adicionar caixa', remove: 'Remover caixa', undo: 'Desfazer', apply: 'Aplicar alterações',
  id: 'ID da caixa', label: 'Rótulo', sizeX: 'Largura base X (mm)', sizeY: 'Altura base Y (mm)', sizeZ: 'Profundidade base Z (mm)',
  positionX: 'Posição mínima X (mm)', positionY: 'Posição mínima Y (mm)', positionZ: 'Posição mínima Z (mm)',
  containerX: 'Volume X (mm)', containerY: 'Volume Y (mm)', containerZ: 'Volume Z (mm)',
  resize: 'Aplicar volume', rotateX: 'Girar +90° em X', rotateY: 'Girar +90° em Y', rotateZ: 'Girar +90° em Z',
  baseDimensions: 'Dimensões de base', orientation: 'Matriz de orientação', extents: 'Dimensões orientadas', newBox: 'Nova caixa', cancel: 'Cancelar adição',
  empty: 'Nenhuma caixa. Adicione uma caixa ou importe um documento.', noSelection: 'Selecione uma caixa para editar.',
  importTitle: 'Importar JSON', importText: 'Documento JSON', importFile: 'Abrir arquivo JSON (até 256 KiB)', importApply: 'Substituir pelo JSON',
  importHelp: 'A importação válida substitui todo o documento e pode ser desfeita. Nada é salvo remotamente.',
  exportJSON: 'Exportar JSON', exportSVG: 'Exportar SVG', fit: 'Enquadrar volume', reset: 'Restaurar câmera',
  view3d: 'Vista 3D', view2d: 'Projeções 2D', projection: 'Projeção', scene: 'Editor espacial 3D',
  fallback: 'WebGL indisponível. Use as projeções exatas e os controles numéricos.', loading: 'Preparando a vista 3D…',
  occupied: 'Volume ocupado', occupancy: 'Ocupação arredondada', count: 'Caixas',
  convention: 'x largura · y para cima · z profundidade · mm',
  limits: 'Exemplo sintético. Sem cálculo de suporte, peso, gravidade ou segurança física.',
  navigation: 'Navegar em 3D', endNavigation: 'Encerrar navegação', controlsInactive: 'Selecione uma caixa ou ative a navegação para orbitar. A rolagem da página permanece livre.',
  controls: 'Navegação ativa: arraste para orbitar; roda para aproximar; botão direito para deslocar. Esc ou Encerrar navegação devolve a rolagem da página.',
  idle: 'Documento atual preservado.', ready: 'Documento sintético carregado.', applied: 'Alterações aceitas.', added: 'Caixa adicionada.', removed: 'Caixa removida.',
  imported: 'Documento importado.', undone: 'Última alteração desfeita.', noChange: 'Sem alteração geométrica.', exported: 'Arquivo preparado para download.', reading: 'Lendo arquivo…',
  errorHeading: 'Não foi possível aplicar', review: 'Revisar o campo', contact: 'Lofrano Tecnologia',
  planHelp: 'Vistas ortográficas exatas. Contatos de face, aresta e vértice são permitidos. Objetos sobrepostos na projeção podem estar separados no terceiro eixo.',
  operationStatus: 'Estado da operação', selected: 'Selecionada', measurement: 'Dimensões do volume', fileActions: 'Arquivos e histórico'
};
export const en: typeof pt = {
  draftPreview: 'Unapplied draft', draftInvalid: 'No valid preview. Adjust dimensions, position, or ID; the applied document is preserved. The initial suggestion uses a bounded search, not packing optimization.', draftHelp: 'Translucent preview: excluded from counts, history, and exports. Apply to add or cancel.',
  title: 'Spatial Loading Studio', version: 'Development 0.1.0', language: 'Language',
  objects: 'Objects', properties: 'Properties', volume: 'Bounding volume',
  add: 'Add box', remove: 'Remove box', undo: 'Undo', apply: 'Apply changes',
  id: 'Box ID', label: 'Label', sizeX: 'Base width X (mm)', sizeY: 'Base height Y (mm)', sizeZ: 'Base depth Z (mm)',
  positionX: 'Minimum X (mm)', positionY: 'Minimum Y (mm)', positionZ: 'Minimum Z (mm)',
  containerX: 'Volume X (mm)', containerY: 'Volume Y (mm)', containerZ: 'Volume Z (mm)',
  resize: 'Apply volume', rotateX: 'Rotate +90° about X', rotateY: 'Rotate +90° about Y', rotateZ: 'Rotate +90° about Z',
  baseDimensions: 'Base dimensions', orientation: 'Orientation matrix', extents: 'Oriented dimensions', newBox: 'New box', cancel: 'Cancel addition',
  empty: 'No boxes. Add a box or import a document.', noSelection: 'Select a box to edit.',
  importTitle: 'Import JSON', importText: 'JSON document', importFile: 'Open JSON file (up to 256 KiB)', importApply: 'Replace with JSON',
  importHelp: 'A valid import replaces the entire document and can be undone. Nothing is saved remotely.',
  exportJSON: 'Export JSON', exportSVG: 'Export SVG', fit: 'Fit volume', reset: 'Reset camera',
  view3d: '3D view', view2d: '2D projections', projection: 'Projection', scene: '3D spatial editor',
  fallback: 'WebGL unavailable. Use the exact projections and numerical controls.', loading: 'Preparing the 3D view…',
  occupied: 'Occupied volume', occupancy: 'Rounded occupancy', count: 'Boxes',
  convention: 'x width · y up · z depth · mm',
  limits: 'Synthetic example. No support, weight, gravity or physical safety calculation.',
  navigation: 'Navigate in 3D', endNavigation: 'End navigation', controlsInactive: 'Select a box or enable navigation to orbit. Page scrolling remains available.',
  controls: 'Navigation active: drag to orbit; wheel to zoom; right button to pan. Escape or End navigation returns page scrolling.',
  idle: 'Current document preserved.', ready: 'Synthetic document loaded.', applied: 'Changes accepted.', added: 'Box added.', removed: 'Box removed.',
  imported: 'Document imported.', undone: 'Last change undone.', noChange: 'No geometry change.', exported: 'File prepared for download.', reading: 'Reading file…',
  errorHeading: 'Could not apply', review: 'Review the field', contact: 'Lofrano Tecnologia',
  planHelp: 'Exact orthographic views. Face, edge and corner contact is allowed. Objects overlapping in a projection may be separated along the third axis.',
  operationStatus: 'Operation status', selected: 'Selected', measurement: 'Volume dimensions', fileActions: 'Files and history'
};
const errors: Record<Locale, Record<string, string>> = {
  pt: {
    type: 'Use os tipos de dados indicados no contrato.', keys: 'Há campos ausentes, extras ou índices inválidos. Use apenas o esquema documentado.',
    accessor: 'Use campos de dados próprios, sem getters, lacunas ou iteradores personalizados.', range: 'Use milímetros inteiros: dimensões de 1 a 12000; posições de 0 a 12000.',
    number: 'Digite apenas algarismos inteiros, sem sinal, separador ou espaço.', id: 'Use um ID único de 1 a 64 caracteres ASCII: letras, números, sublinhado ou hífen.',
    label: 'Use um rótulo Unicode válido de até 128 bytes UTF-8, sem NUL.', orientation: 'Use uma das 24 matrizes de rotação ortogonais direitas do contrato.',
    bounds: 'A caixa ultrapassa o volume. Reduza as dimensões ou ajuste a posição.', overlap: 'Há interseção interior entre caixas. Ajuste a posição, dimensões ou rotação.',
    duplicate: 'Há IDs repetidos. Dê um ID diferente a cada caixa.', count: 'Confira o tamanho dos vetores e o limite de 200 caixas.',
    schema: 'O documento deve usar version 1 e unit mm.', bytes: 'O arquivo excede 256 KiB. Reduza o JSON antes de importar.',
    json: 'JSON inválido. Confira aspas, vírgulas e valores.', duplicateKey: 'Há chaves JSON repetidas. Remova as duplicatas.', depth: 'JSON excessivamente aninhado. Use o esquema plano documentado.',
    document: 'Use somente documentos aceitos pelo núcleo.', io: 'Não foi possível ler ou baixar o arquivo. Tente novamente ou use o campo JSON.'
  },
  en: {
    type: 'Use the data types specified in the contract.', keys: 'Fields are missing, extra, or have invalid indices. Use only the documented schema.',
    accessor: 'Use own data fields without getters, holes or custom iterators.', range: 'Use integer millimetres: dimensions 1 to 12000; positions 0 to 12000.',
    number: 'Enter integer digits only, without signs, separators or spaces.', id: 'Use a unique 1–64 character ASCII ID: letters, digits, underscore or hyphen.',
    label: 'Use a valid Unicode label of at most 128 UTF-8 bytes without NUL.', orientation: 'Use one of the contract’s 24 right-handed orthogonal rotation matrices.',
    bounds: 'The box exceeds the volume. Reduce dimensions or adjust its position.', overlap: 'Boxes have an interior intersection. Adjust position, dimensions or rotation.',
    duplicate: 'IDs are repeated. Give each box a different ID.', count: 'Check vector lengths and the limit of 200 boxes.',
    schema: 'The document must use version 1 and unit mm.', bytes: 'The file exceeds 256 KiB. Reduce the JSON before importing.',
    json: 'Invalid JSON. Check quotes, commas and values.', duplicateKey: 'JSON members are repeated. Remove duplicate keys.', depth: 'JSON is nested too deeply. Use the documented flat schema.',
    document: 'Use only core-accepted documents.', io: 'Could not read or download the file. Try again or use the JSON field.'
  }
};
export function errorText(error: unknown, locale: Locale): string {
  const fault = error instanceof Fault ? error : new Fault('io');
  return (errors[locale][fault.code] ?? errors[locale].type) + (fault.details.length ? ` (${fault.details.join(', ')})` : '');
}
