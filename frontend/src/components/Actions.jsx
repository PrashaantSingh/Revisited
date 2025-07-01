import { useState } from "react";
import { FaTags, FaSortAmountDownAlt, FaPlus } from "react-icons/fa";

export default function Actions({
  onFilterChange,
  onSortChange,
  onCreateClick,
}) {
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest");

  const handleFilterChange = (e) => {
    setSelectedTag(e.target.value);
    if (onFilterChange) onFilterChange(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    if (onSortChange) onSortChange(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <FaTags className="text-gray-600" />
        <select
          value={selectedTag}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All Tags</option>
          <option value="dp">Dynamic Programming</option>
          <option value="array">Array</option>
          <option value="graph">Graph</option>
          <option value="tree">Tree</option>
          <option value="binary-search">Binary Search</option>
          {/* Add more tags dynamically later */}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <FaSortAmountDownAlt className="text-gray-600" />
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="oldest">Oldest Unrevised First</option>
          <option value="newest">Recently Revised First</option>
        </select>
      </div>

      {/* Create */}
      <div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Add Question</span>
        </button>
      </div>
    </div>
  );
}
