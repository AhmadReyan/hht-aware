import { create } from 'zustand';

const defaultEmergencyData = {
  name: '',
  dob: '',
  bloodType: 'Unknown',
  drugAllergies: '',
  specialist: '',
  specialistPhone: '',
  contactName: '',
  contactPhone: '',
  notes: '',
  manifestations: [] // array of string keys
};

export const useAppStore = create((set, get) => {
  // Load initial state from localStorage
  const localEmergency = localStorage.getItem('hht_emergency_card');
  const localCompletedChallenges = localStorage.getItem('hht_completed_challenges');

  const initialEmergency = localEmergency ? JSON.parse(localEmergency) : defaultEmergencyData;
  const initialCompleted = localCompletedChallenges ? JSON.parse(localCompletedChallenges) : [];

  return {
    // Emergency Card State
    emergencyData: initialEmergency,
    
    setEmergencyData: (data) => {
      set((state) => {
        const updated = { ...state.emergencyData, ...data };
        localStorage.setItem('hht_emergency_card', JSON.stringify(updated));
        return { emergencyData: updated };
      });
    },

    resetEmergencyCard: () => {
      localStorage.removeItem('hht_emergency_card');
      set({ emergencyData: defaultEmergencyData });
    },

    // Challenges State
    completedChallenges: initialCompleted, // array of challenge IDs (1 to 10)

    toggleChallenge: (id) => {
      set((state) => {
        let updated = [...state.completedChallenges];
        if (updated.includes(id)) {
          updated = updated.filter(item => item !== id);
          // If any of 1-9 are unchecked, we must uncheck 10 as well
          if (id !== 10) {
            updated = updated.filter(item => item !== 10);
          }
        } else {
          updated.push(id);
          // If all 1-9 are now checked, automatically check 10
          const has1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(num => updated.includes(num));
          if (has1to9 && !updated.includes(10)) {
            updated.push(10);
          }
        }

        localStorage.setItem('hht_completed_challenges', JSON.stringify(updated));
        return { completedChallenges: updated };
      });
    },

    // Total points calculation helper
    getPoints: () => {
      const completed = get().completedChallenges;
      // We can count points from data
      // For speed, let's hardcode point values based on ID:
      // 1: 10, 2: 10, 3: 20, 4: 10, 5: 30, 6: 15, 7: 25, 8: 20, 9: 20, 10: 50
      const pointMap = {
        1: 10, 2: 10, 3: 20, 4: 10, 5: 30, 6: 15, 7: 25, 8: 20, 9: 20, 10: 50
      };
      return completed.reduce((total, id) => total + (pointMap[id] || 0), 0);
    },

    // Check if a specific challenge is completed
    isCompleted: (id) => {
      return get().completedChallenges.includes(id);
    },

    // PWA Install Prompt State
    deferredPrompt: null,
    isInstallable: false,
    
    setDeferredPrompt: (prompt) => {
      set({ deferredPrompt: prompt, isInstallable: !!prompt });
    },
    
    clearDeferredPrompt: () => {
      set({ deferredPrompt: null, isInstallable: false });
    }
  };
});
