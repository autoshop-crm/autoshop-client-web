import { useMemo, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import { mapBookingSuccessToClientViewModel } from '../domain/client/mappers';
import { ClientBookingSuccessViewModel } from '../domain/client/view-models';

export type BookingStep = 'vehicle' | 'services' | 'problem' | 'slot' | 'confirm' | 'success';

interface SelectedSlotDraft {
  id: string;
  startAt: string;
  slotMinutes: number;
}

export const useBookingDraft = () => {
  const [step, setStep] = useState<BookingStep>('vehicle');
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [problem, setProblem] = useState('');
  const [comment, setComment] = useState('');
  const [slot, setSlot] = useState<SelectedSlotDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ClientBookingSuccessViewModel | null>(null);

  const steps: BookingStep[] = ['vehicle', 'services', 'problem', 'slot', 'confirm'];
  const currentIndex = steps.indexOf(step);

  const canContinue = useMemo(() => {
    switch (step) {
      case 'vehicle':
        return vehicleId !== null;
      case 'services':
        return selectedServiceIds.length > 0;
      case 'problem':
        return problem.trim().length >= 5;
      case 'slot':
        return Boolean(slot);
      case 'confirm':
        return true;
      default:
        return false;
    }
  }, [step, vehicleId, selectedServiceIds, problem, slot]);

  const next = () => {
    if (!canContinue || step === 'confirm' || step === 'success') {
      return;
    }
    setStep(steps[currentIndex + 1]);
  };

  const back = () => {
    if (step === 'success' || currentIndex <= 0) {
      return;
    }
    setStep(steps[currentIndex - 1]);
  };

  const toggleService = (serviceId: number) => {
    setSelectedServiceIds((current) => (current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]));
  };

  const submit = async () => {
    if (!vehicleId || !slot) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await bookingApi.create({
        vehicleId,
        plannedVisitAt: slot.startAt,
        plannedSlotMinutes: slot.slotMinutes,
        problem,
        intakeNotes: comment,
        selectedServiceIds
      });
      setSuccess(mapBookingSuccessToClientViewModel(result));
      setStep('success');
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось оформить запись. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    steps,
    currentIndex,
    canContinue,
    vehicleId,
    setVehicleId,
    selectedServiceIds,
    toggleService,
    problem,
    setProblem,
    comment,
    setComment,
    slot,
    setSlot,
    submitting,
    error,
    success,
    next,
    back,
    submit
  };
};
