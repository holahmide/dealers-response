import { ChangeEvent, useState } from "react";
import { Car } from "../../context/interfaces";
import Input from "../../components/Form/Input";
import { useAppContext } from "../../context";
import Label from "../../components/Form/Label";

const EVForm = ({ car, closeModal }: { car: Car | null; closeModal: any }) => {
  const [name, setName] = useState<string>(car?.name || "");
  const [capacity, setCapacity] = useState<number>(car?.capacity || 0);
  const [dischargeRate, setDischargeRate] = useState(car?.dischargeRate);
  const [initialDegradation, setInitialDegradation] = useState(
    car?.initialDegradation
  );
  const [totalDegradation, setTotalDegradation] = useState(
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
      totalDegradation,
      soc,
    });

    updateCar(car?.id || "", {
      name,
      dischargeRate: Number(dischargeRate),
      capacity: Number(capacity),
      initialDegradation: Number(initialDegradation),
      totalDegradation: Number(totalDegradation),
      soc: Number(soc),
    });

    closeModal();
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
                setCapacity(Number(e.target.value))
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="Discharge Rate (KW)" />
            <Input
              type="number"
              value={dischargeRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDischargeRate(Number(e.target.value))
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="Initial Degradation (%)" />
            <Input
              type="number"
              value={initialDegradation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInitialDegradation(Number(e.target.value))
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="Current Degradation (%)" />
            <Input
              type="number"
              value={totalDegradation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTotalDegradation(Number(e.target.value))
              }
              required
            />
          </div>
          <div className="w-full">
            <Label label="SOC (%)" />
            <Input
              type="number"
              value={soc}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSoc(Number(e.target.value))
              }
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
