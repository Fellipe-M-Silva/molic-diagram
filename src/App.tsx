import { useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, ConnectionMode, Controls, type NodeTypes, useNodesState, useEdgesState, type Node, type Edge, type ColorMode } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import Editor from './components/editor'
import { useStore } from './stores/useStore';
import { parseMolic } from './parser/molicParser';
import SceneNode from './components/nodes/SceneNode';
import UbiqNode from './components/nodes/UbiqNode';
import ProcessNode from './components/nodes/ProcessNode';

const nodeTypes: NodeTypes = {
  scene: SceneNode,
  ubiq: UbiqNode,
  process: ProcessNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const { theme, code, setCode, setTheme } = useStore();

  const activeColorMode = (
  theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
) as ColorMode;

  useEffect(() => {
    const root = window.document.documentElement;
    
    const activeTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.style.colorScheme = activeTheme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);


  useEffect(() => {
  const { nodes: newNodes, edges: newEdges } = parseMolic(code, nodes);
  
  setNodes(newNodes);
  setEdges(newEdges);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  return (
    <>
      <header>
        <h6>MoLIC.dg</h6>
        <div className="theme-switcher">
          {(['light', 'dark', 'system'] as Theme[]).map((t) => (
            <button 
              key={t}
              onClick={() => setTheme(t)}
              className={theme === t ? 'active' : ''}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <main className="main-content">

      <aside className='editor-panel'>
          <Editor
          onChange={handleEditorChange}
        />
      </aside>
      <section className="canvas-panel">
          <ReactFlow
            connectionMode={ConnectionMode.Loose}
            nodes={nodes}
            edges={edges}
            colorMode={activeColorMode}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={[12, 12]}
            fitView
          >
            <Background 
              id="1" 
              gap={12}  
              size={1} 
              variant={BackgroundVariant.Cross}
              
            />
            <Controls />
          </ReactFlow>
        </section>
      </main>
    </>
  )
}

export default App
