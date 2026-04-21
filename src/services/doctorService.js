import api from './api';

export const doctorService = {
  getQueue: async () => {
    const response = await api.get('/api/doctor/queue');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, data) => {
    // data: { status: 'InProgress' | 'Completed' | 'Cancelled', reason: '' }
    const response = await api.patch(`/api/doctor/appointments/${appointmentId}/status`, data);
    return response.data;
  },

  submitMedicalHistory: async (patientId, data) => {
    // data: { patientComplaint, diagnosis, notes, prescriptions: [] }
    const response = await api.post(`/api/doctor/patients/${patientId}/medical-history`, data);
    return response.data;
  },

  getMedicalHistory: async (patientId) => {
    const response = await api.get(`/api/doctor/patients/${patientId}/medical-history`);
    return response.data;
  }
};
