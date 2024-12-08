import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // redirect to /events
    navigate("/events");
  }, [navigate]);
  return <div>Home</div>;
};

export default HomePage;
