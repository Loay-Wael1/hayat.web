import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialDraftState = {
  patientComplaint: '',
  diagnosis: '',
  notes: '',
  prescriptions: [],
};

// This store associates an active Draft to a specific Appointment ID.
export const useDoctorVisitStore = create(
  persist(
    (set, get) => ({
      activeAppointmentId: null,
      drafts: {}, // { [appointmentId]: { ...initialDraftState } }

      setActiveAppointment: (appointmentId) => {
        set((state) => {
          if (!state.drafts[appointmentId]) {
            return {
              activeAppointmentId: appointmentId,
              drafts: { ...state.drafts, [appointmentId]: { ...initialDraftState } }
            };
          }
          return { activeAppointmentId: appointmentId };
        });
      },

      updateDraft: (appointmentId, data) => set((state) => ({
        drafts: {
          ...state.drafts,
          [appointmentId]: { ...state.drafts[appointmentId], ...data }
        }
      })),

      addPrescription: (appointmentId, prescription) => set((state) => {
        const currentDraft = state.drafts[appointmentId] || initialDraftState;
        return {
          drafts: {
            ...state.drafts,
            [appointmentId]: {
              ...currentDraft,
              prescriptions: [...currentDraft.prescriptions, prescription]
            }
          }
        };
      }),

      removePrescription: (appointmentId, index) => set((state) => {
        const currentDraft = state.drafts[appointmentId];
        if (!currentDraft) return state;
        const newPrescriptions = [...currentDraft.prescriptions];
        newPrescriptions.splice(index, 1);
        return {
          drafts: {
            ...state.drafts,
            [appointmentId]: {
              ...currentDraft,
              prescriptions: newPrescriptions
            }
          }
        };
      }),

      clearDraft: (appointmentId) => set((state) => {
        const newDrafts = { ...state.drafts };
        delete newDrafts[appointmentId];
        return {
          drafts: newDrafts,
          activeAppointmentId: state.activeAppointmentId === appointmentId ? null : state.activeAppointmentId
        };
      }),
    }),
    {
      name: 'doctor-visit-storage',
    }
  )
);
