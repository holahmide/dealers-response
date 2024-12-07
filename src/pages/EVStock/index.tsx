import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppContext } from "../../context";
import { Car } from "../../context/interfaces";
import { useState } from "react";
import EVDialog from "./dialog";

const EVStock = () => {
  const { cars, updateCar } = useAppContext();

  const [activeCar, setActiveCar] = useState<Car | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = (car: Car) => {
    setActiveCar(car);
    setIsOpen(true);
  };

  return (
    <>
      <EVDialog car={activeCar} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="py-6 h-screen overflow-y-auto">
        <div className="px-4 text-2xl text-center pb-3">EV STOCK</div>
        <div className="px-4 my-2">Search here..</div>
        <div className="px-4 flex flex-col gap-4">
          {cars.map((car, index) => (
            <div
              key={index}
              className={`bg-white shadow-sm p-2 rounded-md ${
                car.isAvailable ? "bg-white" : "bg-gray-100 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="text-truncate">{car.name}</div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:calendar-x"
                    onClick={() =>
                      updateCar(car.id, { isAvailable: !car.isAvailable })
                    }
                  />
                  <Icon
                    icon="akar-icons:gear"
                    onClick={() => openModal(car)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <div>
                  <span className="text-[11px] text-gray-700">ID:</span>
                  <div className="-mt-1">#{car.id}</div>
                </div>
                <div>
                  <span className="text-[11px] text-gray-700">
                    Degradation:
                  </span>
                  <div className="-mt-1">
                    {(car.initialDegradation + car.totalDegradation)?.toFixed(
                      5
                    )}
                    %
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-gray-700">Capacity:</span>
                  <div className="-mt-1">{car.capacity} kWh</div>
                </div>
                <div>
                  <span className="text-[11px] text-gray-700">C-Rate:</span>
                  <div className="-mt-1">
                    {(car.dischargeRate / car.capacity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EVStock;
