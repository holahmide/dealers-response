import { useAppContext } from "../../context";
import DREventsComponent from "./Component";

/*
 * This component uses Display Component pattern for better testing
 */

const DREventsContainer = () => {
  const { events } = useAppContext();

  return <DREventsComponent events={events} />;
};

export default DREventsContainer;
