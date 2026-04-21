import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receptionService } from '../services/receptionService';

export const useTodayAppointments = (filters) => {
  return useQuery({
    queryKey: ['appointments', 'today', filters],
    queryFn: () => receptionService.getTodayAppointments(filters),
  });
};

export const useQuickBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: receptionService.quickBook,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['appointments', 'today'] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, payload }) => receptionService.updateAppointmentStatus(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'today'] });
    },
  });
};

export const useSearchPatients = (term) => {
  return useQuery({
    queryKey: ['patients', 'search', term],
    queryFn: () => receptionService.searchPatients(term),
    enabled: !!term && term.length > 2, // only search if term has > 2 chars
  });
};

export const useClinicsWithSchedules = () => {
  return useQuery({
    queryKey: ['clinics', 'schedules'],
    queryFn: receptionService.getClinicsWithSchedules,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useDoctors = (searchTarget) => {
  return useQuery({
    queryKey: ['doctors', 'list', searchTarget],
    queryFn: () => receptionService.getDoctors(searchTarget),
  });
};

export const useDoctorSpecializations = () => {
  return useQuery({
    queryKey: ['doctors', 'specializations'],
    queryFn: receptionService.getDoctorSpecializations,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });
};

export const useRegisterPatient = () => {
  return useMutation({
    mutationFn: receptionService.registerPatient,
  });
};
