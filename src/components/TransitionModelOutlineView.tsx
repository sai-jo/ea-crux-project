// Outline view for AI Transition Model
import { useMemo } from 'react';
import './CauseEffectGraph.css';
import { OutlineView, generateOutlineText } from './CauseEffectGraph/components';
import { parameterNodes } from '../data/parameter-graph-data';
import TransitionModelNav from './TransitionModelNav';

const typeLabels = {
  cause: 'Root Factors',
  intermediate: 'Ultimate Scenarios',
  effect: 'Ultimate Outcomes',
};

const subgroups = {
  'ai': { label: 'AI System Factors' },
  'society': { label: 'Societal Factors' },
};

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; width: 100%; overflow: hidden; background: #ffffff; font-family: system-ui, -apple-system, sans-serif; }
  .tm-page { width: 100vw; height: 100vh; display: flex; flex-direction: column; }
  .tm-content { flex: 1; overflow: auto; min-height: 0; }
  .tm-copy-btn {
    position: fixed;
    top: 56px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    color: #374151;
    z-index: 100;
  }
  .tm-copy-btn:hover { background: #f9fafb; }
`;

export default function TransitionModelOutlineView() {
  const outlineText = useMemo(() => generateOutlineText(parameterNodes, typeLabels, subgroups), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outlineText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="tm-page">
        <TransitionModelNav activeTab="outline" />
        <button className="tm-copy-btn" onClick={handleCopy}>Copy</button>
        <div className="tm-content">
          <OutlineView
            nodes={parameterNodes}
            typeLabels={typeLabels}
            subgroups={subgroups}
          />
        </div>
      </div>
    </>
  );
}
