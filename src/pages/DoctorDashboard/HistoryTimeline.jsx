import React from 'react';
import { usePatientMedicalHistory } from '../../Hooks/useDoctor';
import { Calendar, FileText, ClipboardList } from 'lucide-react';

const HistoryTimeline = ({ patientId }) => {
  const { data: history, isLoading, isError } = usePatientMedicalHistory(patientId);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">جاري تحميل التاريخ الطبي...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">حدث خطأ أثناء تحميل السجل الطبي.</div>;
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center flex flex-col items-center shadow-sm">
        <FileText className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">لا يوجد تاريخ طبي</h3>
        <p className="text-gray-500 text-sm">لم يتم تسجيل أي زيارات سابقة لهذا المريض في النظام.</p>
      </div>
    );
  }

  return (
    <div className="relative border-r-2 border-blue-100 pr-6 ml-4 space-y-8 pb-10">
      {history.map((visit, idx) => (
        <div key={visit.visitId || idx} className="relative">
          {/* Timeline Node */}
          <div className="absolute -right-[31px] top-2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm"></div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header info */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
              <div className="flex gap-2 items-center text-sm font-bold text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                {(() => {
                  const dateVal = visit.visitDate || visit.createdAt || visit.date;
                  const d = new Date(dateVal);
                  return isNaN(d.getTime())
                    ? 'تاريخ غير معروف'
                    : d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                })()}
              </div>
              <div className="text-sm font-medium text-gray-500">
                <span className="text-xs text-gray-400 block mb-1">اسم الطبيب</span>
                د. {visit.doctorName}
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-4">

              {visit.patientComplaint && (
                <div>
                  <h4 className="text-xs font-bold text-blue-600 mb-1">الشكوى</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">{visit.patientComplaint}</p>
                </div>
              )}

              {visit.diagnosis && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-blue-600 mb-1">التشخيص</h4>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed">{visit.diagnosis}</p>
                </div>
              )}

              {visit.notes && (
                <div>
                  <h4 className="text-xs font-bold text-blue-600 mb-1">ملاحظات الطبيب</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{visit.notes}</p>
                </div>
              )}

              {visit.prescriptions && visit.prescriptions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <h4 className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" /> الأدوية الموصوفة
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {visit.prescriptions.map((p, pIdx) => (
                      <li key={pIdx} className="text-sm flex gap-2 p-2 bg-blue-50/50 rounded border border-blue-50">
                        <span className="font-bold text-blue-900">{p.drugName}</span>
                        <span className="text-gray-500 text-xs mt-0.5">({p.dosage} - {p.frequency})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;
