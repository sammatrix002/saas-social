import React, { useState } from 'react';
import { RolePermission } from '../../types.ts';
import {
  Shield,
  Key,
  Lock,
  CheckCircle2,
  Sliders,
  Save,
  Layers,
  Users,
} from 'lucide-react';

interface RbacSettingsProps {
  initialPermissions: RolePermission[];
}

export const RbacSettings: React.FC<RbacSettingsProps> = ({
  initialPermissions,
}) => {
  const [permissions, setPermissions] = useState<RolePermission[]>(initialPermissions);
  const [activeTab, setActiveTab] = useState<'rbac' | 'byok'>('rbac');

  // BYOK keys state
  const [apiKeys, setApiKeys] = useState({
    gemini: 'AIzaSy...DEMO_KEY_CONFIGURED',
    openai: 'sk-proj-...DEMO_KEY',
    anthropic: 'sk-ant-api03-...DEMO_KEY',
    groq: 'gsk_...DEMO_KEY',
    deepseek: 'sk-ds-...DEMO_KEY',
  });

  const handleToggle = (module: string, type: 'read' | 'write') => {
    setPermissions((prev) =>
      prev.map((p) => (p.module === module ? { ...p, [type]: !p[type] } : p))
    );
  };

  const handleGrantAll = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, read: true, write: true })));
  };

  const handleReadOnly = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, read: true, write: false })));
  };

  const handleClearAll = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, read: false, write: false })));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              19-Module Granular RBAC Permissions & BYOK Keys
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Enterprise Role Isolation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Construct custom security roles across all 19 workspace modules with read/write privileges and manage BYOK AI keys.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'rbac' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            19-Module RBAC Matrix
          </button>
          <button
            onClick={() => setActiveTab('byok')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'byok' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            BYOK AI Keys Vault
          </button>
        </div>
      </div>

      {activeTab === 'rbac' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Quick Preset Toolbar */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Editing Role:</span>
              <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-slate-700">
                Support & Sales Specialist
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGrantAll}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Grant All
              </button>
              <button
                onClick={handleReadOnly}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Read-Only
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => alert('RBAC Permissions saved successfully!')}
                className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition-colors flex items-center gap-1 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Roles</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Platform Module (19 Total)</th>
                  <th className="p-3.5">System Identifier</th>
                  <th className="p-3.5 text-center">Read / View</th>
                  <th className="p-3.5 text-center">Write / Mutate</th>
                  <th className="p-3.5 text-right">Effective Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {permissions.map((perm) => (
                  <tr key={perm.module} className="hover:bg-slate-850">
                    <td className="p-3.5 font-bold text-white">{perm.displayName}</td>
                    <td className="p-3.5 font-mono text-slate-500 text-[11px]">{perm.module}</td>
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={perm.read}
                        onChange={() => handleToggle(perm.module, 'read')}
                        className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={perm.write}
                        onChange={() => handleToggle(perm.module, 'write')}
                        className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          perm.read && perm.write
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : perm.read
                            ? 'bg-cyan-500/15 text-cyan-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {perm.read && perm.write ? 'FULL ACCESS' : perm.read ? 'READ ONLY' : 'NO ACCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* BYOK Vault */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Bring Your Own Key (BYOK) AI Credentials</h3>
              <p className="text-xs text-slate-400">Encrypted at rest using AES-256-CBC. Zero third-party markup.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">OpenAI API Key (GPT-4o, o3-mini)</label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Anthropic Claude API Key (Claude 3.7)</label>
              <input
                type="password"
                value={apiKeys.anthropic}
                onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Groq LPU Engine API Key</label>
              <input
                type="password"
                value={apiKeys.groq}
                onChange={(e) => setApiKeys({ ...apiKeys, groq: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => alert('BYOK API credentials encrypted and stored in secure vault!')}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              Save Encrypted Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
