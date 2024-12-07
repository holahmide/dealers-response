export interface AppState {
  cars: Car[];
  updateCar: (carId: string, newCar: Partial<Car>) => void;
}

export interface Car {
  capacity: number;
  name: string;
  id: string;
  dischargeRate: number;
  initialDegradation: number;
  totalDegradation: number;
  degradationCoefficient: number;
  isAvailable: boolean;
  soc: number;
}

export interface Event {
  demand: number;
  timeInHrs: number;
  participationPayment: number;
  capacityPayment: number;
  maxDOD: number;
  chargePoints: number;
}

export interface AppData {
  cars: Car[];
  events: Event[];
}
