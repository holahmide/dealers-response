import { useEffect, useState } from "react";
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
  const [rewardPerHour, setRewardPerHour] = useState(1.1);
  const [eventDate, setEventDate] = useState("");
  const [chargePoints, setChargePoints] = useState<number>(10);
  const [maxDOD, setMaxDOD] = useState<number>(80);

  const [currentParticipation, setCurrentParticipation] = useState<null | {
    chargers: { evs: Car[] };
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
                  type="text"
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Duration (Hours)" />
                <Input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Reward / kWh ($)" />
                <Input
                  type="number"
                  value={rewardPerHour}
                  onChange={(e) => setRewardPerHour(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <Label label="No. of Charge points" />
                <Input
                  type="number"
                  value={chargePoints}
                  onChange={(e) => setChargePoints(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <Label label="Date" />
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Label label="Maximum DOD (%)" />
                <Input
                  type="number"
                  value={maxDOD}
                  onChange={(e) => setMaxDOD(e.target.value)}
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
              chargers={currentParticipation.chargers}
              totalAvailable={currentParticipation.totalAvailable}
              event={currentParticipation.event}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NewDREvent;
