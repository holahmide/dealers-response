import { ChangeEvent, useState } from "react";
import Input from "../../components/Form/Input";
import EVParticipationContainer from "./EVParticipation/Container";
import { useAppContext } from "../../context";
import { Car, Event } from "../../context/interfaces";
import Label from "../../components/Form/Label";
import { selectEVs } from "./EVParticipation/optimization";
import dayjs from "dayjs";

const NewDREvent = () => {
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

    const { totalAvailableEnergy, chargers } = selectEVs(
      cars.filter((car) => car.isAvailable),
      Number(eventCapacity),
      Number(duration),
      Number(chargePoints),
      Number(maxDOD) / 100
    );

    setCurrentParticipation({
      chargers,
      totalAvailable: totalAvailableEnergy,
      event: {
        demand: Number(eventCapacity),
        timeInHrs: Number(duration),
        participationPayment: Number(rewardPerHour),
        maxDOD: Number(maxDOD) / 100,
        chargePoints: Number(chargePoints),
        capacityPayment: 0,
        date: eventDate ? dayjs(eventDate).format("DD/MM/YYYY") : "",
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
            <EVParticipationContainer
              chargers={currentParticipation.chargers}
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
