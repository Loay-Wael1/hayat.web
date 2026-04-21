import React, { useState } from 'react';
import { useDoctorVisitStore } from '../../store/doctorVisitStore';
import { useSubmitMedicalHistory, useUpdateAppointmentStatus, useDoctorQueue } from '../../Hooks/useDoctor';
import { Users, FileText, ClipboardList, PenTool, CheckCircle, ArrowRight, Plus, Trash2 } from 'lucide-react';

const ActiveVisitForm = ({ activePatient }) => {
  const { drafts, updateDraft, addPrescription, removePrescription, clearDraft, setActiveAppointment } = useDoctorVisitStore();
  const submitMedicalHistory = useSubmitMedicalHistory();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const { data: queueData } = useDoctorQueue();

  const appointmentId = activePatient.appointmentId;
  const patientId = activePatient.patientId;
  
  // Get active draft or fallback to empty structure
  const draft = drafts[appointmentId] || { patientComplaint: '', diagnosis: '', notes: '', prescriptions: [] };

  const [prescriptionForm, setPrescriptionForm] = useState({ drugName: '', dosage: '', frequency: '', duration: '', instructions: '' });

  const handleTextChange = (e) => {
    updateDraft(appointmentId, { [e.target.name]: e.target.value });
  };

  const handleAddPrescription = () => {
    if (!prescriptionForm.drugName) return;
    addPrescription(appointmentId, prescriptionForm);
    setPrescriptionForm({ drugName: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };

  const handleEndVisit = async () => {
    if (!draft.diagnosis && !draft.patientComplaint) {
        alert('يرجى إدخال الشكوى أو التشخيص على الأقل');
        return;
    }

    // 1. Submit form data
    submitMedicalHistory.mutate({
        patientId,
        payload: draft
    }, {
        onSuccess: () => {
            // 2. Mark appointment as complete
            updateStatusMutation.mutate({
                appointmentId,
                payload: { status: 'Completed', reason: '' }
            }, {
                onSuccess: () => {
                    // 3. Clear draft
                    clearDraft(appointmentId);
                    
                    // 4. Select next patient
                    if (queueData) {
                        const remaining = queueData.filter(p => (p.status === 'InProgress' || p.status === 'Waiting') && p.appointmentId !== appointmentId);
                        if (remaining.length > 0) {
                            setActiveAppointment(remaining[0].appointmentId);
                        } else {
                            setActiveAppointment(null);
                        }
                    }
                }
            });
        }
    });

  };

  if (activePatient.status === 'Waiting') {
      return (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center flex flex-col items-center">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">في الانتظار</h3>
              <p className="text-gray-500 mb-6 max-w-md">يجب تحويل حالة المريض إلى "حضر" من قائمة الانتظار الجانبية لبدء تسجيل البيانات الطبية والزيارة الحالية.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
        {/* Complaint */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Users className="text-blue-600 w-5 h-5" />
                <h3 className="font-bold text-gray-900">الشكوى الرئيسية</h3>
            </div>
            <div className="p-4 bg-white">
                <textarea 
                    name="patientComplaint"
                    value={draft.patientComplaint}
                    onChange={handleTextChange}
                    className="w-full text-sm outline-none resize-none h-24 text-gray-700 bg-transparent placeholder-gray-300"
                    placeholder="دوّن سبب زيارة المريض أو شكواه الأساسية هنا..."
                ></textarea>
            </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FileText className="text-blue-600 w-5 h-5" />
                <h3 className="font-bold text-gray-900">التشخيص</h3>
            </div>
            <div className="p-4 bg-white">
                <textarea 
                    name="diagnosis"
                    value={draft.diagnosis}
                    onChange={handleTextChange}
                    className="w-full text-sm outline-none resize-none h-24 text-gray-700 bg-transparent placeholder-gray-300"
                    placeholder="أدخل التشخيص المبدئي أو النهائي..."
                ></textarea>
            </div>
        </div>

      </div>

      {/* Notes & Prescriptions Section */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <ClipboardList className="text-blue-600 w-5 h-5" />
            <h3 className="font-bold text-gray-900">الملاحظات والوصفة الطبية</h3>
        </div>
        <div className="p-4">
            <textarea 
                name="notes"
                value={draft.notes}
                onChange={handleTextChange}
                className="w-full text-sm outline-none resize-vertical min-h-[100px] text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 placeholder-gray-400"
                placeholder="دوّن الملاحظات السريرية، خطة العلاج، والأدوية الموصوفة..."
            ></textarea>

            {/* Prescriptions Dynamic List */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <PenTool className="text-gray-400 w-4 h-4" />
                   الأدوية والوصفات (Prescriptions)
                </h4>

                {/* Added Prescriptions Table */}
                {draft.prescriptions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2 font-medium">اسم الدواء</th>
                                    <th className="px-4 py-2 font-medium">الجرعة</th>
                                    <th className="px-4 py-2 font-medium">التكرار</th>
                                    <th className="px-4 py-2 font-medium">المدة</th>
                                    <th className="px-4 py-2 font-medium text-center">حذف</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {draft.prescriptions.map((p, idx) => (
                                    <tr key={idx} className="bg-white">
                                        <td className="px-4 py-2 font-bold text-blue-700">{p.drugName}</td>
                                        <td className="px-4 py-2 text-gray-600">{p.dosage}</td>
                                        <td className="px-4 py-2 text-gray-600">{p.frequency}</td>
                                        <td className="px-4 py-2 text-gray-600">{p.duration}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button 
                                                onClick={() => removePrescription(appointmentId, idx)}
                                                className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add New Prescription Row */}
                <div className="flex gap-2 flex-wrap">
                    <input 
                        type="text" 
                        placeholder="اسم الدواء..." 
                        value={prescriptionForm.drugName}
                        onChange={e => setPrescriptionForm({...prescriptionForm, drugName: e.target.value})}
                        className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="الجرعة (مثال: 500mg)" 
                        value={prescriptionForm.dosage}
                        onChange={e => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                        className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="التكرار (مثال: مرتين يومياً)" 
                        value={prescriptionForm.frequency}
                        onChange={e => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                        className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="المدة (مثال: 5 أيام)" 
                        value={prescriptionForm.duration}
                        onChange={e => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                        className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                    />
                    <button 
                        onClick={handleAddPrescription}
                        disabled={!prescriptionForm.drugName}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
         <button 
            onClick={handleEndVisit}
            disabled={submitMedicalHistory.isPending || updateStatusMutation.isPending}
            className="flex-shrink-0 bg-[#0052b4] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-3 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
         >
             {submitMedicalHistory.isPending ? 'جاري الحفظ...' : 'إنهاء الزيارة واستدعاء التالي'}
             {!submitMedicalHistory.isPending && <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />}
         </button>
         <div className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium flex items-center gap-2">
            تم حفظ المسودة تلقائياً
            <CheckCircle className="w-4 h-4 text-green-500" />
         </div>
      </div>

    </div>
  );
};

export default ActiveVisitForm;
