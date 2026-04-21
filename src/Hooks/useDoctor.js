import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../services/doctorService';

export const useDoctorQueue = () => {
  return useQuery({
    queryKey: ['doctor', 'queue'],
    queryFn: doctorService.getQueue,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, payload }) => doctorService.updateAppointmentStatus(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'queue'] });
    },
  });
};

export const useSubmitMedicalHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }) => doctorService.submitMedicalHistory(patientId, payload),
    onSuccess: (_, variables) => {
        // Also invalidate queue to reflect completed status
        queryClient.invalidateQueries({ queryKey: ['doctor', 'queue'] });
        queryClient.invalidateQueries({ queryKey: ['doctor', 'history', variables.patientId] });
    },
  });
};

export const usePatientMedicalHistory = (patientId) => {
  return useQuery({
    queryKey: ['doctor', 'history', patientId],
    queryFn: () => doctorService.getMedicalHistory(patientId),
    enabled: !!patientId,
  });
};
