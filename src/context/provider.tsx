import { ReactNode, useEffect, useMemo, useState } from "react";
import { AppContext } from ".";
import { AppData, Car } from "./interfaces";
import { validateJson } from "./utils/functions";
import { toast } from "react-toastify";

const localStorageItemKey = "dealer-response";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppData>({
    cars: [],
    events: [],
    initialLoad: true,
  });

  useEffect(() => {
    const data = localStorage.getItem(localStorageItemKey);
    if (data) {
      return setAppData({ ...JSON.parse(data), initialLoad: false });
    }

    setAppData((prev) => ({ ...prev, initialLoad: false }));
  }, []);

  useEffect(() => {
    if (!appData.initialLoad)
      localStorage.setItem(localStorageItemKey, JSON.stringify(appData));
  }, [appData]);

  const updateCar = (carId: string, newCar: Partial<Car>) => {
    setAppData((prev) => ({
      ...prev,
      cars: prev.cars.map((car) =>
        car.id === carId ? { ...car, ...newCar } : car
      ),
    }));
  };

  const loadCars = (carJson: any) => {
    const { isValid, errors } = validateJson(carJson);

    if (!isValid) {
      errors?.map((error: string) => toast.error(error));
    }

    setAppData((prev) => ({
      ...prev,
      cars: carJson,
    }));
  };

  const recordEvent = (event: any) => {
    setAppData((prev) => ({
      ...prev,
      events: [...prev.events, { ...event, timestamp: new Date() }],
    }));
  };

  const data = useMemo(
    () => ({
      cars: appData.cars,
      events: appData.events,
      updateCar,
      loadCars,
      recordEvent,
    }),
    [appData.cars, appData.events]
  );

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};
