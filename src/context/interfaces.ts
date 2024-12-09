export interface Event {
  demand: number;
  timeInHrs: number;
  participationPayment: number;
  capacityPayment: number;
  maxDOD: number;
  chargePoints: number;
  date?: string;
}

export interface EventRecord {
  totalAvailable: number;
  event: Event;
  chargers: { evs: Car[] }[];
}

export interface AppState {
  cars: Car[];
  events: EventRecord[];
  updateCar: (carId: string, newCar: Partial<Car>) => void;
  loadCars: (carJson: any) => void;
  recordEvent: (event: any) => void;
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

  maxContribution: number;
  currentDegradation?: number;
}

export interface AppData {
  cars: Car[];
  events: EventRecord[];
  initialLoad: boolean;
}
