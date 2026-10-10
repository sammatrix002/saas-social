import React, { useState } from 'react';
import { StaffMember } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Share2,
} from 'lucide-react';

interface PublicBookingPageProps {
  staff: StaffMember[];
  onBackToApp: () => void;
}

export const PublicBookingPage: React.FC<PublicBookingPageProps> = ({
  staff,
  onBackToApp,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(staff[0]);
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [clientName, setClientName] = useState('Tariq Mansoor');
  const [clientEmail, setClientEmail] = useState('tariq.mansoor@emiratesgroup.ae');
  const [clientPhone, setClientPhone] = useState('+971 50 123 4567');
  const [topic, setTopic] = useState('Enterprise Omnichannel Setup & CTWA Strategy');
  const [meetingProvider, setMeetingProvider] = useState<'Google Meet' | 'Zoom' | 'MS Teams'>('Google Meet');
  const [isBooked, setIsBooked] = useState(false);

  const availableSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="min-h-full bg-[#070B14] text-slate-100 flex flex-col p-4 sm:p-8">
      {/* Top Bar with Back Button */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 pb-4 border-b border-[#1E2B45]">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to WhatsOmni Platform</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
            /book/{selectedStaff.bookingSlug}
          </span>
          <span className="text-slate-600">·</span>
          <span>Public Booking Portal</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full bg-[#10182A] border border-[#1E2B45] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60">
        {!isBooked ? (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Host Profile Info */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedStaff.avatar}
                  alt={selectedStaff.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
                />
                <div>
                  <h2 className="text-base font-bold text-white">{selectedStaff.name}</h2>
                  <p className="text-xs text-slate-400">{selectedStaff.role}</p>
                </div>
              </div>

              {/* Host Selector for demo */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Select Host Specialist:
                </label>
                <select
                  value={selectedStaff.id}
                  onChange={(e) => {
                    const st = staff.find((s) => s.id === e.target.value);
                    if (st) setSelectedStaff(st);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>30 Minutes Strategy Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span>Video Conference: {meetingProvider}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Timezone: {selectedStaff.timezone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                ✨ Free diagnostic call with automatic calendar invitation and WhatsApp meeting reminder.
              </div>
            </div>

            {/* Booking Form & Slot Picker */}
            <div className="md:col-span-7 space-y-5">
              <form onSubmit={handleConfirm} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Select Available Time Slot ({selectedStaff.timezone})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                          selectedSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meeting Platform</label>
                  <div className="flex gap-2">
                    {(['Google Meet', 'Zoom', 'MS Teams'] as const).map((prov) => (
                      <button
                        type="button"
                        key={prov}
                        onClick={() => setMeetingProvider(prov)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                          meetingProvider === prov
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all mt-4"
                >
                  Confirm Strategy Consultation with {selectedStaff.name}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Confirmation Receipt */
          <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Your Meeting is Confirmed!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have booked your 30-minute session with <strong>{selectedStaff.name}</strong> on{' '}
              <strong>{selectedDate} at {selectedSlot}</strong> ({selectedStaff.timezone}).
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
              <div className="text-emerald-400 font-bold">📅 Calendar Link Created</div>
              <div className="text-slate-300">Attendee: {clientName} ({clientEmail})</div>
              <div className="text-cyan-400">Video Link: https://meet.google.com/omni-v3-call</div>
              <div className="text-slate-400 text-[11px]">WhatsApp SMS confirmation dispatched to {clientPhone}</div>
            </div>

            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => setIsBooked(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Schedule Another Call
              </button>
              <button
                onClick={onBackToApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
