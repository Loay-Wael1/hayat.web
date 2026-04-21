import React from 'react';
import { useUpdateAppointmentStatus } from '../../Hooks/useDoctor';
import { useDoctorVisitStore } from '../../store/doctorVisitStore';
import { Megaphone, Check, X } from 'lucide-react';

const QueueSidebar = ({ queue }) => {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const { activeAppointmentId, setActiveAppointment } = useDoctorVisitStore();

  const handleUpdateStatus = (appointmentId, status) => {
    updateStatusMutation.mutate({
      appointmentId,
      payload: { status, reason: '' }
    }, {
      onSuccess: () => {
        if (status === 'Cancelled') {
          // If cancelled, explicitly clear it from draft and state
          useDoctorVisitStore.getState().clearDraft(appointmentId);
          useDoctorVisitStore.getState().setActiveAppointment(null);
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'InProgress':
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">قيد الفحص</span>;
      case 'Waiting':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">في الانتظار</span>;
      case 'Scheduled':
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">مجدول</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {queue.map((item, index) => {
        const isActive = activeAppointmentId === item.appointmentId;
        const isWaiting = item.status === 'Waiting' || item.status === 'Scheduled';

        return (
          <div 
            key={item.appointmentId}
            onClick={() => setActiveAppointment(item.appointmentId)}
            className={`bg-white rounded-lg p-3 border transition-all cursor-pointer shadow-sm relative ${isActive ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
          >
            {/* Active Border Hint */}
            {isActive && <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600 rounded-r-lg"></div>}

            <div className="flex justify-between items-start pl-2">
              <div className="flex-1 pr-2">
                <h4 className="font-bold text-gray-900 text-sm">{item.patientName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(item.appointmentDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
              </div>
              <div className="bg-gray-100 text-gray-600 font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0">
                #{index + 1}
              </div>
            </div>

            {/* Actions (Only show if active and waiting) */}
            {isActive && isWaiting && (
              <div className="mt-4 space-y-2 px-1">
                <button className="w-full bg-[#0052b4] hover:bg-blue-800 text-white py-2 rounded flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                  <Megaphone size={14} />
                  استدعاء المريض
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.appointmentId, 'InProgress'); }}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-green-100/70 hover:bg-green-200 text-green-700 py-1.5 rounded flex items-center justify-center gap-1 text-xs font-bold transition-colors border border-green-200 disabled:opacity-50"
                  >
                    <Check size={14} />
                    حضر
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.appointmentId, 'Cancelled'); }}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-red-100/70 hover:bg-red-200 text-red-600 py-1.5 rounded flex items-center justify-center gap-1 text-xs font-bold transition-colors border border-red-200 disabled:opacity-50"
                  >
                    <X size={14} />
                    تغيب
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {queue.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          لا يوجد مواعيد في الانتظار
        </div>
      )}
    </div>
  );
};

export default QueueSidebar;
