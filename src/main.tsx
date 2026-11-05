import React, { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/public-sans/wght.css';
import './style.css';
import { App } from './App';
class ApplicationBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="fatal"><h1>Spatial Loading Studio</h1><p lang="pt-BR">Não foi possível abrir o editor. Recarregue a página. Nenhuma alteração é salva remotamente.</p><p lang="en">The editor could not open. Reload the page. No changes are saved remotely.</p><button onClick={() => location.reload()}>Recarregar / Reload</button><a href="https://lofranotecnologia.com.br">Lofrano Tecnologia</a></main>;
    return this.props.children;
  }
}
const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
createRoot(root).render(<ApplicationBoundary><App /></ApplicationBoundary>);
