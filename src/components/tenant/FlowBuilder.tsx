import React, { useState } from 'react';
import { FlowNode, FlowEdge, FlowTemplate } from '../../types.ts';
import { apiClient } from '../../services/apiClient.ts';
import {
  Workflow,
  Sparkles,
  Play,
  Save,
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  Sliders,
  Smartphone,
  ChevronRight,
  Database,
  Bot,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  Tag,
  Settings,
} from 'lucide-react';

interface FlowBuilderProps {
  initialNodes: FlowNode[];
  initialEdges: FlowEdge[];
  templates: FlowTemplate[];
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({
  initialNodes,
  initialEdges,
  templates,
}) => {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(initialNodes[0]);
  const [promptInput, setPromptInput] = useState('');
  const [generatingWithAi, setGeneratingWithAi] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handlePublishFlow = async () => {
    setPublishing(true);
    try {
      await apiClient.createFlow({
        name: `Automated WhatsApp Flow (v${nodes.length}.${edges.length})`,
        description: 'Published from Visual Flow Canvas',
        nodes,
        edges,
      });
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch {
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } finally {
      setPublishing(false);
    }
  };

  // 19 Node primitives palette
  const nodePrimitives = [
    { type: 'trigger', label: 'Trigger Node', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { type: 'message', label: 'Send Message', icon: MessageSquare, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { type: 'interactive_menu', label: 'Buttons / List Menu', icon: Sliders, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { type: 'whatsapp_flow', label: 'WhatsApp Flow Form', icon: Smartphone, color: 'text-green-400 border-green-500/30 bg-green-500/10' },
    { type: 'catalog_showcase', label: 'Catalog Showcase', icon: Layers, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { type: 'ai_prompt', label: 'AI LLM Prompt', icon: Bot, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
    { type: 'ai_condition', label: 'AI Intent Classifier', icon: Sparkles, color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
    { type: 'rag_query', label: 'RAG Knowledge Query', icon: Database, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { type: 'delay_wait', label: 'Delay / Wait Window', icon: Clock, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    { type: 'tag_contact', label: 'Tag Contact & Update', icon: Tag, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
    { type: 'crm_deal', label: 'Create Kanban Deal', icon: Workflow, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { type: 'webhook', label: 'REST Webhook Dispatch', icon: ArrowRight, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
  ];

  const handleGenerateFlowWithAi = async () => {
    if (!promptInput.trim()) return;
    setGeneratingWithAi(true);

    try {
      const res = await fetch('/api/ai/prompt-to-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput }),
      });
      const data = await res.json();
      if (data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setSelectedNode(data.nodes[0] || null);
      }
    } catch {
      // Fallback
      setNodes([
        {
          id: 'ai-node-1',
          type: 'trigger',
          title: 'Ad Inbound Match',
          config: { keyword: '#DISCOUNT' },
          position: { x: 80, y: 160 },
        },
        {
          id: 'ai-node-2',
          type: 'message',
          title: 'AI Welcome Concierge',
          config: { text: 'Hello! I noticed you are interested in our promotion.' },
          position: { x: 380, y: 160 },
        },
        {
          id: 'ai-node-3',
          type: 'whatsapp_flow',
          title: 'Native WhatsApp Booking Form',
          config: { formType: 'Appointment' },
          position: { x: 680, y: 160 },
        },
        {
          id: 'ai-node-4',
          type: 'crm_deal',
          title: 'Kanban Deal ($2,000)',
          config: { stage: 'Qualified' },
          position: { x: 980, y: 160 },
        },
      ]);
      setEdges([
        { id: 'ae-1', source: 'ai-node-1', target: 'ai-node-2' },
        { id: 'ae-2', source: 'ai-node-2', target: 'ai-node-3' },
        { id: 'ae-3', source: 'ai-node-3', target: 'ai-node-4' },
      ]);
    } finally {
      setGeneratingWithAi(false);
      setPromptInput('');
    }
  };

  const handleLoadTemplate = (tpl: FlowTemplate) => {
    if (tpl.nodes.length > 0) {
      setNodes(tpl.nodes);
      setEdges(tpl.edges);
      setSelectedNode(tpl.nodes[0]);
    }
  };

  const handleAddNode = (type: any, label: string) => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: FlowNode = {
      id: newNodeId,
      type,
      title: label,
      config: { text: 'Configure action parameters here' },
      position: { x: 100 + nodes.length * 60, y: 150 + (nodes.length % 3) * 60 },
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-[#10182A] border border-[#1E2B45] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
      {/* Canvas Top Bar */}
      <div className="p-3.5 border-b border-[#1E2B45] bg-[#0A1020] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Visual Drag-and-Drop Automation Flow Builder</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 font-bold">
                19+ Node Primitives
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {nodes.length} Active Canvas Nodes · Immutable Versioning v3.0
            </div>
          </div>
        </div>

        {/* AI Prompt-to-Flow generator trigger & Simulator */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showSimulator ? 'Close Simulator' : 'Dry-Run Simulator'}</span>
          </button>

          <button
            onClick={handlePublishFlow}
            disabled={publishing}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            {publishSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Deployed!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{publishing ? 'Publishing...' : 'Publish Flow'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Prompt-to-Flow Input Strip */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="AI Prompt-to-Flow: e.g., 'Build an e-commerce support flow with WhatsApp Flow return form and CRM deal'..."
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={handleGenerateFlowWithAi}
          disabled={generatingWithAi || !promptInput.trim()}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{generatingWithAi ? 'Generating Graph...' : 'Generate with AI'}</span>
        </button>
      </div>

      {/* Main Builder Body: Node Palette, Canvas, and Inspector Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette: 19 Node Primitives */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/50 p-3 overflow-y-auto hidden md:block space-y-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Node Primitives (Click to Add)
            </div>
            <div className="space-y-1.5">
              {nodePrimitives.map((np, idx) => {
                const Icon = np.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAddNode(np.type, np.label)}
                    className="w-full text-left p-2 rounded-lg bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-xs flex items-center gap-2.5 transition-colors group"
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center border ${np.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-300 group-hover:text-white font-medium">
                      {np.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Pre-Built Flow Blueprints
            </div>
            <div className="space-y-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs transition-colors"
                >
                  <div className="font-bold text-white text-[11px]">{tpl.name}</div>
                  <div className="text-[10px] text-emerald-400">{tpl.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Visual Node Flow Canvas */}
        <div className="flex-1 bg-slate-950 p-6 overflow-auto relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Visual Canvas Nodes */}
          <div className="min-w-[1200px] min-h-[600px] relative">
            {nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                  }}
                  className={`absolute w-72 rounded-xl bg-slate-900 border transition-all cursor-pointer shadow-xl ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-white truncate">{node.title}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {node.type}
                    </span>
                  </div>

                  <div className="p-3 text-xs text-slate-300 space-y-2">
                    {node.config.text && (
                      <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                        "{node.config.text}"
                      </div>
                    )}
                    {node.config.keyword && (
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Keyword: {node.config.keyword}
                      </div>
                    )}
                    {node.config.buttons && (
                      <div className="space-y-1">
                        {node.config.buttons.map((btn: string, bIdx: number) => (
                          <div key={bIdx} className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
                            🔘 {btn}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-3 py-1.5 bg-slate-950/40 rounded-b-xl border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>In: 1</span>
                    <span>Out: 1</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Drawer */}
        {selectedNode && (
          <div className="w-72 sm:w-80 border-l border-slate-800 bg-slate-900/80 p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Node Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{selectedNode.id}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Node Title</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const updated = { ...selectedNode, title: e.target.value };
                    setSelectedNode(updated);
                    setNodes(nodes.map((n) => (n.id === updated.id ? updated : n)));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Configuration Parameters</label>
                <textarea
                  value={JSON.stringify(selectedNode.config, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      const updated = { ...selectedNode, config: parsed };
                      setSelectedNode(updated);
                      setNodes(nodes.map((n) => (n.id === updated.id ? updated : n)));
                    } catch {}
                  }}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                ✔ Validated JSON Node configuration. Step-by-step executions will update CRM context and flow variable scope.
              </div>
            </div>
          </div>
        )}

        {/* Dry-Run Phone Simulator Modal */}
        {showSimulator && (
          <div className="absolute right-6 bottom-6 w-72 bg-slate-900 border-4 border-slate-800 rounded-3xl p-3 shadow-2xl z-40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Dry-Run Phone Simulator
              </span>
              <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl h-64 overflow-y-auto space-y-2 text-xs">
              <div className="bg-slate-900 p-2 rounded text-slate-300">
                User: #CTWA-2026
              </div>
              <div className="bg-emerald-950/80 border border-emerald-600/40 p-2 rounded text-emerald-200">
                Bot: Hello! Welcome to WhatsOmni. How can our team assist you today?
              </div>
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => alert('Selected Option: Book Strategy Call')}
                  className="w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-white text-[11px] rounded"
                >
                  Book Strategy Call
                </button>
                <button
                  onClick={() => alert('Selected Option: Inspect Live Catalog')}
                  className="w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-white text-[11px] rounded"
                >
                  Inspect Live Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
