import api from './api';

export const receptionService = {
  searchPatients: async (term) => {
    const response = await api.get('/api/reception/patients/search', {
      params: { term },
    });
    return response.data;
  },

  getTodayAppointments: async (params) => {
    const response = await api.get('/api/reception/appointments/today', { params });
    return response.data;
  },

  getClinicsWithSchedules: async () => {
    const response = await api.get('/api/reception/clinics-with-schedules');
    return response.data;
  },

  quickBook: async (data) => {
    const response = await api.post('/api/reception/appointments/book', data);
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, data) => {
    const response = await api.patch(`/api/reception/appointments/${appointmentId}/status`, data);
    return response.data;
  },

  getDoctors: async (search) => {
    const response = await api.get('/api/reception/doctors', {
      params: { search }
    });
    return response.data;
  },

  getDoctorSpecializations: async () => {
    const response = await api.get('/api/reception/doctors/specializations');
    return response.data;
  },

  registerPatient: async (data) => {
    const response = await api.post('/api/reception/patients', data);
    return response.data;
  }
};
