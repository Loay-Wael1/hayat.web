import React, { useEffect, useState } from 'react';
import QueueSidebar from './QueueSidebar';
import ActiveVisitForm from './ActiveVisitForm';
import HistoryTimeline from './HistoryTimeline';
import { useDoctorQueue } from '../../Hooks/useDoctor';
import { useDoctorVisitStore } from '../../store/doctorVisitStore';
import { useAuthStore } from '../../store/authStore';
import { History, FileText, User } from 'lucide-react';

const DoctorDashboard = () => {
  const { data: queueData, isLoading } = useDoctorQueue();
  const { activeAppointmentId, setActiveAppointment } = useDoctorVisitStore();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'

  const queue = queueData || [];

  // Find the currently active patient object from the queue
  const activePatient = queue.find(p => p.appointmentId === activeAppointmentId);

  // Auto-select the first 'InProgress' or 'Waiting' or 'Scheduled' patient if none is selected
  // We check !activePatient so that if the currently selected one is removed from queue (e.g. cancelled), it auto-advances.
  useEffect(() => {
    if (!activePatient && queue.length > 0) {
      const nextP = queue.find(p => p.status === 'InProgress' || p.status === 'Waiting' || p.status === 'Scheduled');
      if (nextP) {
        setActiveAppointment(nextP.appointmentId);
      }
    }
  }, [queue, activePatient, setActiveAppointment]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-65px)] overflow-hidden bg-[#f4f7f9] relative" dir="rtl">

      {/* Right Sidebar: Queue (Placed first in the DOM for RTL rendering on the right) */}
      <div className="md:w-[450px] bg-white border-l border-gray-200 flex flex-col md:h-[calc(100vh-65px)] overflow-hidden shrink-0 z-10 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col items-center">
          <h3 className="text-md font-bold text-gray-500 mt-1 font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-center">
            {user?.displayName || 'طبيب'}
          </h3>
          <h3 className="text-md font-bold text-gray-500 mt-1 font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-center">
            ID: {user?.userId?.split('-')[0] || '-'}
          </h3>
          <h3 className="font-bold text-gray-900 text-lg">قائمة الانتظار اليوم</h3>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400 text-sm">جاري التحميل...</div>
          ) : (
            <QueueSidebar queue={queue} />
          )}
        </div>
      </div>

      {/* Main Area (Left side) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f7f9]">

        {activePatient ? (
          <div className="max-w-4xl mx-auto">
            {/* Patient Header Block */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <User className="text-orange-600 w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activePatient.patientName}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>ID: {activePatient.patientId.split('-')[0]}</span>
                    <span>•</span>
                    <span>{activePatient.gender === 'Female' ? 'أنثى' : 'ذكر'}</span>
                    <span>•</span>
                    <span>العمر: {activePatient.age || 'غير مدرج'}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setActiveTab('current')}
                  className={`px-6 py-2 rounded-md font-semibold text-sm transition-all focus:outline-none ${activeTab === 'current' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  الزيارة الحالية
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-2 rounded-md font-semibold text-sm transition-all focus:outline-none ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  التاريخ الطبي
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'current' ? (
                <ActiveVisitForm activePatient={activePatient} />
              ) : (
                <HistoryTimeline patientId={activePatient.patientId} />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-500">العيادة فارغة حالياً</h3>
            <p className="text-sm">لا يوجد مرضى في قائمة الانتظار</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
