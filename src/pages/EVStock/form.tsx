import { ChangeEvent, useState } from "react";
import { Car } from "../../context/interfaces";
import Input from "../../components/Form/Input";
import { useAppContext } from "../../context";

const Label = ({ label, required }: { label: string; required?: boolean }) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
  );
};

const EVForm = ({ car, closeModal }: { car: Car | null; closeModal: any }) => {
  const [name, setName] = useState<string>(car?.name || "");
  const [capacity, setCapacity] = useState<number>(car?.capacity || 0);
  const [dischargeRate, setDischargeRate] = useState(car?.dischargeRate);
  const [initialDegradation, setInitialDegradation] = useState(
    car?.initialDegradation
  );
  const [currentDegradation, setCurrentDegradation] = useState(
    car?.totalDegradation
  );
  const [soc, setSoc] = useState<number>(car?.soc || 0);

  const { updateCar } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      name,
      dischargeRate,
      capacity,
      initialDegradation,
      currentDegradation,
      soc,
    });

    updateCar(car?.id || "", {
      // name,
      // dischargeRate: Number(dischargeRate),
      // capacity: Number(capacity),
      // initialDegradation: Number(initialDegradation),
      // currentDegradation: Number(currentDegradation),
      soc: Number(soc),
    });

    closeModal();

    // Handle form submission logic here, for example:
  };

  return (
    <div>
      <form className="w-full h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <Label label="Name" />
            <Input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="Capacity (kWh)" />
            <Input
              type="text"
              value={capacity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCapacity(e.target.value)
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="Discharge Rate (KW)" />
            <Input
              type="number"
              value={dischargeRate}
              onChange={(e) => setDischargeRate(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <Label label="Initial Degradation (%)" />
            <Input
              type="number"
              value={initialDegradation}
              onChange={(e) => setInitialDegradation(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <Label label="Current Degradation (%)" />
            <Input
              type="number"
              value={currentDegradation}
              onChange={(e) => setCurrentDegradation(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <Label label="SOC (%)" />
            <Input
              type="number"
              value={soc}
              onChange={(e) => setSoc(e.target.value)}
            />
          </div>
        </div>

        <button className="mt-6 bg-primary text-black" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EVForm;
