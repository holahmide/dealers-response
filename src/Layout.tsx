import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import EVStock from "./pages/EVStock";

const Layout = () => {
  return (
    <div className="flex h-screen text-black bg-gray-200">
      <div className="w-9/12 rounded-r-md bg-white shadow-[1px_0_8px_rgba(0,0,0,0.5)] z-10 overflow-y-auto pb-10">
        <NavBar />
        <div className="px-4">
          <Outlet />
        </div>
      </div>
      <div className="w-3/12 bg-gray-200 -ml-1 pl-1">
        <EVStock />
      </div>
    </div>
  );
};

export default Layout;
