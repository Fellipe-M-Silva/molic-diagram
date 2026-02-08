import { useCallback, useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, ConnectionMode, Controls, type NodeTypes, useNodesState, useEdgesState, type Node, type Edge, type ColorMode, ReactFlowProvider, useReactFlow, reconnectEdge } from '@xyflow/react';
import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import Editor from './components/editor'
import { useStore } from './stores/useStore';
import { parseMolic } from './parser/molicParser';
import SceneNode from './components/nodes/SceneNode';
import UbiqNode from './components/nodes/UbiqNode';
import ProcessNode from './components/nodes/ProcessNode';
import Toolbar from './components/toolbar';

const nodeTypes: NodeTypes = {
  scene: SceneNode,
  ubiq: UbiqNode,
  process: ProcessNode,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, fitView } = useReactFlow(); // Agora funciona!
  const { edgeConfigs, updateEdgeConfig } = useStore();
  
  const { 
    code, setCode, theme, setTheme, 
    nodePositions, updateNodePositions, viewport 
  } = useStore();

  // 1. Parser: Roda quando o código ou as posições salvas mudam
  useEffect(() => {
  // Passamos code, nodePositions E edgeConfigs para o parser
  const { nodes: newNodes, edges: newEdges } = parseMolic(code, nodePositions, edgeConfigs);
  
  setNodes(newNodes);
  setEdges(newEdges);
}, [code, nodePositions, edgeConfigs, setNodes, setEdges]);

  // 2. Restaurar Câmera: Roda uma vez ao carregar
  useEffect(() => {
    if (viewport) {
      setViewport(viewport);
    }
  }, [setViewport]); 

  // 3. Gerenciar Temas (CSS Classes)
  useEffect(() => {
    const root = window.document.documentElement;
    const activeTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.style.colorScheme = activeTheme;
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);

  const activeColorMode = (
    theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
  ) as ColorMode;

  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);
    // Salva apenas quando o usuário solta o nó (dragging === false)
    const hasPositionChange = changes.some((c: any) => c.type === 'position' && !c.dragging);
    if (hasPositionChange) {
      updateNodePositions(nodes);
    }
  };

  const onReconnect = (oldEdge: any, newConnection: Connection) => {
  // 1. Atualiza visualmente (opcional, pois o parser rodará em seguida)
  setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  
  // 2. Salva a nova configuração de "portas" no Store persistido
  updateEdgeConfig(oldEdge.id, {
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle
  });
};

  const themeIcons = {
    light: <SunIcon size={16} weight={theme === 'light' ? "fill" : "bold"} />,
    dark: <MoonIcon size={16} weight={theme === 'dark' ? "fill" : "bold"} />,
    system: <DesktopIcon size={16} weight={theme === 'system' ? "fill" : "bold"} />,
  };

  return (
    <div className="app-container">
      <header>
        <h6>MoLIC.dg</h6>
        <div className="theme-switcher">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button 
              key={t}
              onClick={() => setTheme(t)}
              className={`icon-btn ${theme === t ? 'active' : ''}`}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            >
              {themeIcons[t]}
            </button>
          ))}
        </div>
        <Toolbar />
      </header>
      
      <main className="main-content">
        <aside className='editor-panel'>
          <Editor onChange={(val) => setCode(val || "")} />
        </aside>
        
        <section className="canvas-panel">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onMoveEnd={(_, vp) => useStore.getState().setViewport(vp)}
            onReconnect={onReconnect} 
            preventScrolling={true} 
            zoomOnScroll={true}
            deleteKeyCode={null}
            selectionKeyCode={null} 
            multiSelectionKeyCode={null} 
            connectionMode={ConnectionMode.Loose}
            colorMode={activeColorMode}
            snapToGrid={true}
            snapGrid={[12, 12]}
            fitView={false}
          >
            <Background gap={12} size={1} variant={BackgroundVariant.Cross} />
            <Controls />
          </ReactFlow>
        </section>
      </main>
    </div>
  );
}

// O App apenas provê o contexto
export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}