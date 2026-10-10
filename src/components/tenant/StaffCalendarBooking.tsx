import React, { useState } from 'react';
import { StaffMember } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ExternalLink,
  User,
  Plus,
  Globe,
  Sliders,
} from 'lucide-react';

interface StaffCalendarBookingProps {
  staffList?: StaffMember[];
  staff?: StaffMember[];
  onOpenPublicBooking?: () => void;
}

export const StaffCalendarBooking: React.FC<StaffCalendarBookingProps> = ({
  staffList,
  staff,
}) => {
  const effectiveStaff = staffList || staff || [];
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(effectiveStaff[0]);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const availableSlots = [
    '09:30 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '04:30 PM',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Staff Directory & Calendar Booking System
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Multi-Host Round-Robin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Manage staff availability matrices, Google Calendar sync, and public booking portals (/book/[slug]).
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Staff Members List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Host Staff Directory & Meeting Providers
            </h2>
            <span className="text-[11px] text-slate-400">{effectiveStaff.length} Active Hosts</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {effectiveStaff.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStaff(st)}
                className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                  selectedStaff.id === st.id ? 'bg-slate-800/70 border-l-2 border-emerald-500' : 'hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{st.name}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {st.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>{st.timezone}</span>
                      <span>·</span>
                      <span className="text-cyan-400 font-mono">/book/{st.bookingSlug}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStaff(st);
                      setShowPublicModal(true);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1 border border-slate-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Link</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Staff Profile Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Host Availability Matrix
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Google Calendar Synced</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
              <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-bold text-white">{selectedStaff.name}</div>
                <div className="text-slate-400 text-[11px]">{selectedStaff.email}</div>
                <div className="text-emerald-400 text-[10px] mt-0.5 flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>Provider: {selectedStaff.meetingProvider}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Available Working Days</label>
              <div className="flex flex-wrap gap-1">
                {selectedStaff.availableDays.map((d, didx) => (
                  <span key={didx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>Meeting Duration:</span>
                <span className="font-bold text-white">30 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Buffer Between Calls:</span>
                <span className="font-bold text-white">15 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Notice:</span>
                <span className="font-bold text-white">2 Hours</span>
              </div>
            </div>

            <button
              onClick={() => setShowPublicModal(true)}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Simulate Public Booking Page (/book/{selectedStaff.bookingSlug})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Public Booking Link Modal */}
      {showPublicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPublicModal(false);
                setBookingConfirmed(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-800"
            >
              Close
            </button>

            {!bookingConfirmed ? (
              <div className="space-y-4">
                <div className="text-center pb-3 border-b border-slate-800">
                  <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-emerald-500 mb-2" />
                  <h3 className="text-sm font-bold text-white">Book 1-on-1 with {selectedStaff.name}</h3>
                  <p className="text-xs text-slate-400">30 Min Consultation · {selectedStaff.meetingProvider}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Select Date</div>
                  <input
                    type="date"
                    defaultValue="2026-10-15"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Select Available Time Slot</div>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-lg text-xs font-semibold text-center transition-colors border ${
                          selectedSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setBookingConfirmed(true)}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Confirm Appointment ({selectedSlot})
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Booking Confirmed!</h4>
                <p className="text-xs text-slate-300">
                  Appointment scheduled with {selectedStaff.name}. Google Meet video invitation and WhatsApp reminder sent to your contact.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
