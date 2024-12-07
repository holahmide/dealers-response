import { Icon } from "@iconify/react/dist/iconify.js";
import { Car, Event } from "../../../context/interfaces";

const EVParticipation = ({
  chargers,
  totalAvailable,
  event,
}: {
  chargers: { evs: Car[] }[];
  totalAvailable: number;
  event: Event;
}) => {
  const carsUsed: Car[] = chargers
    .reduce((acc: Car[], val) => [...acc, ...val.evs], [])
    .filter((ev) => !!ev);

  return (
    <div>
      <p className="text-green-600 font-bold text-2xl">
        Participation Estimate 📈
      </p>

      <div className="mt-4">
        <span>Required Capacity: {event.demand} kWhr</span>
        <br />
        <span>
          Approximate Capacity Available:{" "}
          <span
            className={`${
              totalAvailable < event.demand ? "text-red-500" : "text-green-500"
            }`}
          >
            <b>{totalAvailable} </b>
          </span>
          kWhr
        </span>
        <br />
        <span>
          Total Reward: ${" "}
          {Math.floor(
            (totalAvailable < event.demand ? totalAvailable : event.demand) *
              event.participationPayment
          )}
        </span>
        <br />
        <span>
          Total Degradation for {carsUsed.length} cars:{" "}
          {carsUsed
            .reduce((acc, ev) => acc + ev.currentDegradation, 0)
            ?.toFixed(5)}{" "}
          %
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {chargers
          .filter((charger) => charger.evs.filter((ev) => !!ev).length > 0)
          .map(({ evs: cars }, index) => (
            <div>
              <p className="mb-2">Charger {index + 1}</p>
              {cars
                .filter((ev) => !!ev)
                .map((car, index) => (
                  <div key={index} className="bg-white shadow-md p-2 border-t">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="text-truncate">{car.name}</div>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <div>
                        <span className="text-[11px] text-gray-700">ID:</span>
                        <div className="-mt-1">#{car.id}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">
                          DR Degradation:
                        </span>
                        <div className="-mt-1">
                          {car.currentDegradation?.toFixed(5)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">
                          Total Degradation:
                        </span>
                        <div className="-mt-1">
                          {car.totalDegradation?.toFixed(5)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">
                          Capacity:
                        </span>
                        <div className="-mt-1">{car.capacity} kWh</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">
                          C-Rate:
                        </span>
                        <div className="-mt-1">
                          {(car.dischargeRate / car.capacity)?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">
                          Energy Used:
                        </span>
                        <div className="-mt-1">{car.maxContribution} kWh</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-700">DOD:</span>
                        <div className="-mt-1">
                          {(car.maxContribution / car.capacity)?.toFixed(2) *
                            100}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EVParticipation;