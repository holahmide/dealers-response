import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import Layout from "./Layout";
import NewDREvent from "./pages/NewDREvent";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/events/create" element={<NewDREvent />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
