import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppContext } from "../../context";
import { Car } from "../../context/interfaces";
import { ChangeEvent, useState } from "react";
import EVDialog from "./dialog";
import Label from "../../components/Form/Label";
import Input from "../../components/Form/Input";
import { searchCars } from "../../context/utils/functions";

const EVStock = () => {
  const { cars, updateCar, loadCars } = useAppContext();

  const [url, setUrl] = useState<string>("/cars.json");
  const [search, setSearch] = useState<string>("");

  const [activeCar, setActiveCar] = useState<Car | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = (car: Car) => {
    setActiveCar(car);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        loadCars(data);
      });
  };

  const filteredCars = searchCars(cars, search);

  return (
    <>
      <EVDialog car={activeCar} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="py-6 h-screen overflow-y-auto">
        <div className="px-4 text-2xl text-center pb-3">EV STOCK</div>

        {cars.length > 0 ? (
          <div className="mx-4">
            <Input
              type="text"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              required
              placeholder="Search car by Name or ID"
              className="mb-4 bg-gray-300 outline-none"
            />

            <div className="flex flex-col gap-4">
              {filteredCars.map((car, index) => (
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
                        className="cursor-pointer"
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
                        {(
                          car.initialDegradation + car.totalDegradation
                        )?.toFixed(5)}
                        %
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-700">
                        Capacity:
                      </span>
                      <div className="-mt-1">{car.capacity} kWh</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-700">SOC:</span>
                      <div className="-mt-1">{car.soc}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mx-4 mt-4">
            <form
              className="w-full h-full flex items-end gap-2"
              onSubmit={handleSubmit}
            >
              <div className="w-full">
                <Label label="Enter API link" className="text-left" required />
                <Input
                  type="text"
                  value={url}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUrl(e.target.value)
                  }
                  required
                />
              </div>

              <button className="bg-primary text-black py-1.5" type="submit">
                Submit
              </button>
            </form>

            <div className="text-left text-sm">
              To view a test car list, enter "/test.json".
            </div>

            <div className="text-left text-sm mt-4">
              Each car should have the following properties:
              <ul className="list-disc ml-4">
                <li>id</li>
                <li>name</li>
                <li>capacity</li>
                <li>dischargeRate</li>
                <li>initialDegradation</li>
                <li>degradationCoefficient</li>
                <li>soc</li>
                <li>IsAvailable</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EVStock;
