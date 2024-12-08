import { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/Form/Input";
import EVParticipation from "./EVParticipation";
import { useAppContext } from "../../context";
import { Car, Event } from "../../context/interfaces";
import { selectEVs } from "./EVParticipation/optimization";

const Label = ({ label, required }: { label: string; required?: boolean }) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
  );
};

const NewDREvent = () => {
  // State management for each input field
  const [eventCapacity, setEventCapacity] = useState<number>(400);
  const [duration, setDuration] = useState<number>(3);
  const [rewardPerHour, setRewardPerHour] = useState(2);
  const [eventDate, setEventDate] = useState("");
  const [chargePoints, setChargePoints] = useState<number>(10);
  const [maxDOD, setMaxDOD] = useState<number>(80);

  const [currentParticipation, setCurrentParticipation] = useState<null | {
    chargers: { evs: Car[] }[];
    totalAvailable: number;
    event: Event;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, for example:

    const { selectedEvs, totalAvaialbleEnergy, chargers } = selectEVs(
      cars.filter((car) => car.isAvailable),
      Number(eventCapacity),
      Number(duration),
      Number(chargePoints),
      Number(maxDOD) / 100
    );

    setCurrentParticipation({
      chargers,
      totalAvailable: totalAvaialbleEnergy,
      event: {
        demand: Number(eventCapacity),
        timeInHrs: Number(duration),
        participationPayment: Number(rewardPerHour),
        maxDOD: Number(maxDOD) / 100,
        chargePoints: Number(chargePoints),
        capacityPayment: 0,
      },
    });
  };

  const { cars } = useAppContext();

  return (
    <>
      <div className="mx-auto max-w-2xl mt-12">
        <p className="text-primary-500 font-bold text-2xl mb-10">
          New Demand Response Event 🎉
        </p>
        <div className="flex justify-center items-center">
          <form className="w-full h-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <Label label="Event Capacity (kWhr)" />
                <Input
                  type="number"
                  value={eventCapacity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEventCapacity(Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Duration (Hours)" />
                <Input
                  type="number"
                  value={duration}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDuration(Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Reward / kWh ($)" />
                <Input
                  type="number"
                  value={rewardPerHour}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRewardPerHour(Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="w-full">
                <Label label="No. of Charge points" />
                <Input
                  type="number"
                  value={chargePoints}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setChargePoints(Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Date" />
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEventDate(e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Label label="Maximum DOD (%)" />
                <Input
                  type="number"
                  value={maxDOD}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMaxDOD(Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <button className="mt-6 bg-primary text-black" type="submit">
              Submit
            </button>
          </form>
        </div>

        {currentParticipation && (
          <div className="mt-16">
            <EVParticipation
              chargers={currentParticipation.chargers || []}
              totalAvailable={currentParticipation.totalAvailable}
              event={currentParticipation.event}
              isNewRecord={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NewDREvent;
