// import { useEffect } from "react";

// export default function ConfirmationModal({ text, onCancel, onConfirm }) {
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 z-30 flex justify-center items-center">
//       <div className="absolute inset-0 bg-black opacity-90"></div>

//       <div className="relative bg-light-dark px-6 py-10 rounded-md shadow-lg w-[90%] max-w-md text-white z-40">
//         <h2 className="text-lg font-semibold mb-4 text-center">{text}</h2>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onCancel}
//             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition text-sm font-semibold cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition text-sm font-semibold cursor-pointer"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";

export default function ConfirmationModal({ text, onCancel, onConfirm }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex justify-center items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark opacity-90"></div>

      {/* Modal Box */}
      <div className="relative bg-light-dark px-6 py-8 rounded-2xl shadow-xl w-[90%] max-w-md text-white z-40">
        <h2 className="text-xl font-semibold mb-6 text-center">{text}</h2>
        <div className="flex justify-center gap-5">
          <button
            onClick={onCancel}
            className=" cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
