import axios from "axios";
import React, { forwardRef, HtmlHTMLAttributes, useRef, useState } from "react";
import { DirectoryList } from "../components/DirectoryList";

export const DirectoryListPage = () => {
  const [directoryName, setDirectoryName] = useState<string>("");

  const createDirectory = async () => {
    const resp = await axios.post("http://localhost:8000/directories", {
      name: directoryName,
    });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col px-10">
      <div className="h-24 py-2 text-center w-full flex flex-row border-b border-gray-500 justify-between">
        <input
          className="mr-2 px-2 my-auto h-10"
          type="text"
          placeholder="Enter Directory name"
          value={directoryName}
          onChange={(e) => setDirectoryName(e.currentTarget.value)}
        />
        <button
          onClick={() => createDirectory()}
          className="h-10 my-auto uppercase bg-blue-400 text-white font-bold text-center align-middle"
        >
          Add
        </button>
      </div>
      <div className="flex-1">
        <DirectoryList></DirectoryList>
      </div>
    </div>
  );
};
