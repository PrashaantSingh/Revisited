import BackdropOverlay from "./BackdropOverlay";
import { useEffect } from "react";

export default function ConfirmationModal({
  text,
  onCancel,
  onConfirm,
  operation,
  isOperationPerforming,
  onClose,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <BackdropOverlay onClose={onClose}>
      <div className="relative bg-light-dark px-6 py-8 rounded-2xl shadow-xl w-[90%] max-w-md text-white z-40">
        <h2 className="text-xl font-semibold mb-6 text-center">{text}</h2>
        <div className="flex justify-center gap-5">
          <button
            disabled={isOperationPerforming}
            onClick={onCancel}
            className=" cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all"
          >
            Cancel
          </button>
          <button
            disabled={isOperationPerforming}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer"
          >
            {operation === "DELETE" ? "Delete" : `Confirm`}
          </button>
        </div>
      </div>
    </BackdropOverlay>
  );
}
