import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context";
import { Car, Event } from "../../../context/interfaces";
import EVParticipationComponent from "./Component";

const EVParticipationContainer = ({
  ...params
}: {
  chargers: { evs: Car[] }[];
  totalAvailable: number;
  event: Event;
  isNewRecord?: boolean;
  timestamp?: string;
}) => {
  const { recordEvent } = useAppContext();

  const navigate = useNavigate();

  return (
    <EVParticipationComponent
      recordEvent={recordEvent}
      navigate={navigate}
      {...params}
    />
  );
};

export default EVParticipationContainer;
