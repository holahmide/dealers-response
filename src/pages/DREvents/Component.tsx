import { Link } from "react-router-dom";
import EVParticipation from "../NewDREvent/EVParticipation";
import { EventRecord } from "../../context/interfaces";

const DREventsComponent = ({ events }: { events: EventRecord[] }) => {
  return (
    <div className="p-4">
      <p className="text-2xl font-bold">DR Events</p>

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
        {events.reverse().map((event, index) => (
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