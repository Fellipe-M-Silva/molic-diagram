import { useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { 
  FileSvgIcon,
  FilePdfIcon,
  ImagesIcon,
  DownloadSimpleIcon,
  FileArrowUpIcon
} from '@phosphor-icons/react';
import { useReactFlow, getNodesBounds } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { useStore } from '../stores/useStore';

const Toolbar = () => {
  const { getNodes, fitView } = useReactFlow();
  const setCode = useStore((state) => state.setCode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCanvasImage = async (format: 'png' | 'svg') => {
  const nodes = getNodes();
  if (nodes.length === 0) return null;

  // 1. Calcula os limites exatos de onde existem nós
  const bounds = getNodesBounds(nodes);
  
  // 2. Define uma margem de segurança (padding)
  const padding = 40;
  
  // 3. Seleciona o elemento que contém o desenho (viewport)
  const el = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!el) return null;

  const commonOptions = {
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
    style: {
      width: `${bounds.width + padding * 2}px`,
      height: `${bounds.height + padding * 2}px`,
      transform: `translate(${-(bounds.x - padding)}px, ${-(bounds.y - padding)}px) scale(1)`,
    },
  };

  if (format === 'png') {
    return await toPng(el, {
      ...commonOptions,
      backgroundColor: '#ffffff', 
      pixelRatio: 3,
    });
  } else {
    return await toSvg(el, commonOptions);
  }
  };
  
  const exportPNG = async () => {
    const dataUrl = await getCanvasImage('png');
    if (dataUrl) saveAs(dataUrl, 'molic-diagram.png');
  };

  const exportSVG = async () => {
    const dataUrl = await getCanvasImage('svg');
    if (dataUrl) saveAs(dataUrl, 'molic-diagram.svg');
  };

  const exportPDF = () => {
    fitView({ padding: 0.2, duration: 200 });
    
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="toolbar-container">
      <input
        type="file"
        accept=".molic,.txt"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: 'none' }}
      />

      <button 
        className="icon-btn" 
        title="Importar .molic" 
        onClick={() => fileInputRef.current?.click()}
      >
        <FileArrowUpIcon size={16} weight="bold" />
      </button>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="icon-btn" title="Exportar Diagrama">
            <DownloadSimpleIcon size={16} weight="bold" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content className="popover-content" sideOffset={5} align="end">
            <div className="popover-menu">
              <button className="menu-item" onClick={exportPNG}>
                <ImagesIcon size={16} weight="bold" />
                <span>Exportar PNG</span>
              </button>
              
              <button className="menu-item" onClick={exportSVG}>
                <FileSvgIcon size={16} weight="bold" />
                <span>Exportar SVG</span>
              </button>
              
              <button className="menu-item" onClick={exportPDF}>
                <FilePdfIcon size={16} weight="bold" />
                <span>Gerar PDF (Imprimir)</span>
              </button>
            </div>
            <Popover.Arrow className="popover-arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default Toolbar;