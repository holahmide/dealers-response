// import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const NavBar = () => {
  return (
    <div className="w-full py-4 px-4 border-b">
      <div className="flex w-full justify-between items-center">
        <img src={logo} alt="logo" className="w-14 h-14" />
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-primary-500">
            Events
          </Link>

          <Link to="/events/create">
            <button className="flex gap-2 items-center text-black bg-primary">
              <Icon icon="typcn:plus" className="" />
              <span>New DR Event</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
