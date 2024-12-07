import { Icon } from "@iconify/react/dist/iconify.js";
import { Dialog, DialogClose, DialogContent } from "../../components/ui/Modal";
import EVForm from "./form";
import { Car } from "../../context/interfaces";

const EVDialog = ({
  isOpen,
  setIsOpen,
  car,
}: {
  isOpen: boolean;
  setIsOpen: any;
  car: Car | null;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[500px] h-[380px] max-w-full p-0 border-0 bg-gray-100 text-black">
        <DialogClose asChild>
          <div className="absolute -mt-10 right-0 flex items-center gap-4 cursor-pointer hover:text-primary text-white">
            <span>Close</span>

            <div className="bg-primary p-2 rounded-full text-black">
              <Icon icon="iconamoon:close-bold" />
            </div>
          </div>
        </DialogClose>

        <div className="relative h-full p-4 overflow-auto">
          <div className="flex items-center w-full justify-between">
            <div className="text-xl font-bold">Manage EV - #{car?.id}</div>

            <div className="flex items-center gap-2 underline text-red-400 cursor-pointer">
              <span className="text-sm">Delete</span>
              <Icon icon="mi:delete" className=" text-md" />
            </div>
          </div>

          <div className="mt-5">
            <EVForm car={car} closeModal={() => setIsOpen(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EVDialog;
