import { ReactNode, useEffect, useMemo, useState } from "react";
import { AppContext } from ".";
import { AppData, Car } from "./interfaces";
import CARS from "./cars.json";

const localStorageItemKey = "dealer-response";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppData>({ cars: CARS, events: [] });

  useEffect(() => {
    const data = localStorage.getItem(localStorageItemKey);
    if (data) {
      setAppData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
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

  const data = useMemo(
    () => ({
      cars: appData.cars,
      updateCar,
    }),
    [appData.cars]
  );

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};
