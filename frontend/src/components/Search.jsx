import { FiSearch } from "react-icons/fi";
export default function Search() {
  return (
    <div className="flex justify-center items-center gap-2 border-yellow-700 border-2 py-1.5 px-4 rounded-full text-white">
      <FiSearch />
      <input
        className="outline-none font-thin"
        type="text"
        placeholder="Search questions"
      />
    </div>
  );
}
