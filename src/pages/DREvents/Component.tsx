import { Link } from "react-router-dom";
import EVParticipation from "../NewDREvent/EVParticipation/Container";
import { EventRecord } from "../../context/interfaces";

const DREventsComponent = ({ events }: { events: EventRecord[] }) => {
  const totalReward = events.reduce((acc, record) => {
    let totalAvailable = record.totalAvailable;
    if (record.totalAvailable < record.event.demand) {
      totalAvailable = record.totalAvailable;
    } else totalAvailable = record.event.demand;

    return acc + Number(record.event.participationPayment * totalAvailable);
  }, 0);

  const records = [...events];

  return (
    <div className="p-4">
      <p className="text-2xl font-bold">DR Events</p>

      <p>Total Participation Reward: ${totalReward}</p>

      <hr className="mb-4 mt-4" />

      {events.length === 0 && (
        <div>
          No events recorded. Create event{" "}
          <Link to="/events/create" className="text-primary-500 underline">
            here
          </Link>
          .
        </div>
      )}

      <div className="mt-4" aria-label="ev-participation">
        {records.reverse().map((event, index) => (
          <div key={index}>
            <div className="mb-10">
              <EVParticipation {...event} />
            </div>

            <hr className="mb-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DREventsComponent;
