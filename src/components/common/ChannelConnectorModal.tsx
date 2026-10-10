import React, { useState } from 'react';
import { ChannelType, ChannelInfo } from '../../types.ts';
import {
  QrCode,
  CheckCircle2,
  X,
  RefreshCw,
  Smartphone,
  Shield,
  Layers,
  Key,
  Globe,
  Mail,
  MessageSquare,
  Bot,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface ChannelConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelConnected: (newChannel: ChannelInfo) => void;
  initialChannelType?: ChannelType;
}

export const ChannelConnectorModal: React.FC<ChannelConnectorModalProps> = ({
  isOpen,
  onClose,
  onChannelConnected,
  initialChannelType = 'whatsapp_baileys',
}) => {
  const [selectedType, setSelectedType] = useState<ChannelType>(initialChannelType);
  const [pairingMode, setPairingMode] = useState<'qr' | 'code'>('qr');
  const [pairingCodeInput, setPairingCodeInput] = useState('+971 50 ');
  const [generatedPairCode, setGeneratedPairCode] = useState('7421-9843');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form states for API channels
  const [wabaId, setWabaId] = useState('109283749201948');
  const [phoneId, setPhoneId] = useState('982341209384910');
  const [botFatherToken, setBotFatherToken] = useState('7481920194:AAHF-demoTokenWhatsOmni');
  const [smsSid, setSmsSid] = useState('AC98127391823901284');

  if (!isOpen) return null;

  const handleSimulateConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionSuccess(true);
      setTimeout(() => {
        const newChan: ChannelInfo = {
          id: `ch-${Date.now()}`,
          type: selectedType,
          name:
            selectedType === 'whatsapp_baileys'
              ? 'WhatsApp Baileys Worker (+971 50 882 1928)'
              : selectedType === 'whatsapp_cloud'
              ? 'WhatsApp Cloud API Official'
              : selectedType === 'telegram'
              ? 'Telegram Enterprise Bot'
              : selectedType === 'instagram'
              ? 'Instagram Business Direct'
              : 'Omnichannel Gateway',
          accountHandle:
            selectedType === 'whatsapp_baileys'
              ? '+971 50 882 1928'
              : selectedType === 'telegram'
              ? '@WhatsOmniLiveBot'
              : '@whatsomni_connected',
          status: 'connected',
          badgeColor: 'emerald',
          iconName: 'MessageSquare',
          assignedAgents: ['Demo User'],
          unreadCount: 0,
        };
        onChannelConnected(newChan);
        setConnectionSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Connect Omnichannel Gateway</h2>
            <p className="text-xs text-slate-400">
              Integrate messaging networks with real-time bidirectional synchronization
            </p>
          </div>
        </div>

        {/* Channel Type Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-800/80">
          {[
            { id: 'whatsapp_baileys', label: 'WhatsApp Baileys (QR)' },
            { id: 'whatsapp_cloud', label: 'WhatsApp Cloud API' },
            { id: 'instagram', label: 'Instagram Direct' },
            { id: 'telegram', label: 'Telegram Bot' },
            { id: 'sms', label: 'SMS (Twilio/Vonage)' },
            { id: 'email', label: 'Two-Way Email' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedType(item.id as any);
                setConnectionSuccess(false);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedType === item.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content based on channel type */}
        {connectionSuccess ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">Gateway Connected Successfully!</h3>
            <p className="text-xs text-slate-300">
              Session tokens encrypted and stored. WebSocket listener mounted on Port 8080.
            </p>
          </div>
        ) : (
          <div>
            {/* WhatsApp Baileys QR Code Pairing */}
            {selectedType === 'whatsapp_baileys' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2 mb-2">
                  <button
                    onClick={() => setPairingMode('qr')}
                    className={`text-xs px-3 py-1 rounded-lg ${
                      pairingMode === 'qr' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    onClick={() => setPairingMode('code')}
                    className={`text-xs px-3 py-1 rounded-lg ${
                      pairingMode === 'code' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Pairing Code with Phone Number
                  </button>
                </div>

                {pairingMode === 'qr' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950 p-5 rounded-xl border border-slate-800">
                    {/* Simulated Animated QR Box */}
                    <div className="w-48 h-48 bg-white p-3 rounded-xl flex flex-col items-center justify-center relative shadow-lg">
                      <div className="grid grid-cols-6 gap-1 w-full h-full bg-slate-900 p-2 rounded">
                        {Array.from({ length: 36 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`rounded-sm ${
                              (idx % 2 === 0 || idx % 5 === 0) && idx % 7 !== 0
                                ? 'bg-emerald-400'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="absolute bottom-1 text-[9px] font-mono text-slate-800 font-bold">
                        WhatsOmni Worker v3.0
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="font-bold text-white text-sm">How to Connect:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                        <li>Open WhatsApp on your mobile phone</li>
                        <li>Tap Settings ➔ Linked Devices ➔ Link a Device</li>
                        <li>Point your phone camera to this QR Code to pair</li>
                      </ol>

                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                        🔒 Persistent socket session maintained on Node.js microservice. Zero template fees.
                      </div>

                      <button
                        onClick={handleSimulateConnection}
                        disabled={isConnecting}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                        <span>{isConnecting ? 'Establishing WebSocket Pair...' : 'Simulate Phone Scanned QR'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">
                      Enter Phone Number with Country Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pairingCodeInput}
                        onChange={(e) => setPairingCodeInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(generatedPairCode)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 border border-slate-700"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Code</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Pairing Code:</span>
                      <span className="text-lg font-mono font-extrabold text-emerald-400 tracking-wider">
                        {generatedPairCode}
                      </span>
                    </div>

                    <button
                      onClick={handleSimulateConnection}
                      disabled={isConnecting}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                    >
                      {isConnecting ? 'Authorizing Session...' : 'Verify Pairing Code'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp Cloud API */}
            {selectedType === 'whatsapp_cloud' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Meta Official Embedded Signup</h4>
                    <p className="text-[11px] text-slate-400">Connect WABA in 1 click via Meta popup login</p>
                  </div>
                  <button
                    onClick={handleSimulateConnection}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>Launch Meta Popup</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">WhatsApp Business Account ID</label>
                    <input
                      type="text"
                      value={wabaId}
                      onChange={(e) => setWabaId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Phone Number ID</label>
                    <input
                      type="text"
                      value={phoneId}
                      onChange={(e) => setPhoneId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSimulateConnection}
                  disabled={isConnecting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                >
                  {isConnecting ? 'Validating Webhook Tokens...' : 'Save & Verify Cloud API Credentials'}
                </button>
              </div>
            )}

            {/* Telegram Bot */}
            {selectedType === 'telegram' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Telegram Bot Token (from @BotFather)
                  </label>
                  <input
                    type="text"
                    value={botFatherToken}
                    onChange={(e) => setBotFatherToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    WhatsOmni will automatically call <code>setWebhook</code> on Telegram API.
                  </span>
                </div>

                <button
                  onClick={handleSimulateConnection}
                  disabled={isConnecting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                >
                  {isConnecting ? 'Registering Webhook...' : 'Connect Telegram Bot'}
                </button>
              </div>
            )}

            {/* SMS Gateways */}
            {selectedType === 'sms' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    value={smsSid}
                    onChange={(e) => setSmsSid(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Twilio Auth Token</label>
                  <input
                    type="password"
                    defaultValue="d9a8b12c890123"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                  />
                </div>
                <button
                  onClick={handleSimulateConnection}
                  disabled={isConnecting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {isConnecting ? 'Testing SMS Handshake...' : 'Verify SMS Provider'}
                </button>
              </div>
            )}

            {/* Other Channels */}
            {(selectedType === 'instagram' || selectedType === 'email') && (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-slate-300">
                  Ready to link {selectedType === 'instagram' ? 'Instagram Direct' : 'Two-Way Email (IMAP/SMTP)'} with automatic sync.
                </p>
                <button
                  onClick={handleSimulateConnection}
                  disabled={isConnecting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {isConnecting ? 'Authorizing...' : 'Authorize Gateway'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
