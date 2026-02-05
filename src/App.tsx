// import { useState } from 'react'
import { useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, ConnectionMode, Controls, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import Editor from './components/editor'
import { useStore, type Theme } from './stores/useStore';
import { parseMolic } from './parser/molicParser';
import SceneNode from './components/nodes/SceneNode';
import UbiqNode from './components/nodes/UbiqNode';
import ProcessNode from './components/nodes/ProccessNode';

const nodeTypes: NodeTypes = {
  scene: SceneNode,
  ubiq: UbiqNode,
  process: ProcessNode,
};

function App() {
  // const [count, setCount] = useState(0)
  const { theme } = useStore();

  const activeColorMode = theme === 'system' 
  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    
    const activeTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.style.colorScheme = activeTheme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);

  const { code, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } = useStore();

  useEffect(() => {
    const { nodes: parsedNodes, edges: parsedEdges } = parseMolic(code);
    setNodes(parsedNodes);
    setEdges(parsedEdges);
  }, [code, setNodes, setEdges]);

  return (
    <>
      <header>
        <h6>MoLIC.dg</h6>
        <div className="theme-switcher">
          {(['light', 'dark', 'system'] as Theme[]).map((t) => (
            <button 
              key={t}
              onClick={() => useStore.getState().setTheme(t)}
              className={theme === t ? 'active' : ''}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <main className="main-content">

      <aside className='editor-panel'>
        <Editor />
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
