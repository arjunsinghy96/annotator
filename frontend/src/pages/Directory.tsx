import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

type File = {
  annotated: boolean;
  name: string;
  id: string;
};

type Directory = {
  name: string;
  files: File[];
};

export default function DirectoryPage() {
  const params = useParams();
  const [directory, setDirectory] = useState<Directory>();
  const [fetching, setFetching] = useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const filesChanged = async (e: any) => {
    setSelectedFiles(e.target.files);
  };

  const uploadFiles = async (e: any) => {
    const body = new FormData();
    if (selectedFiles.length == 0) {
      return;
    }
    for (let file of selectedFiles) {
      body.append("files", file);
    }

    const resp = await axios({
      method: "post",
      url: `http://localhost:8000/directories/${params.directoryId}/upload`,
      data: body,
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchDirectory();
  };

  const fetchDirectory = async () => {
    const directoryId = params.directoryId;
    const resp = await axios.get(
      `http://localhost:8000/directories/${directoryId}`
    );
    setDirectory(resp.data);
  };

  const downloadAnnotations = async () => {
    const anchor = document.createElement("a");
    anchor.setAttribute(
      "href",
      `http://localhost:8000/directories/${params.directoryId}/download`
    );
    anchor.download = "";
    anchor.click();
  };

  useEffect(() => {
    setFetching(true);
    if (!fetching) {
      fetchDirectory();
    }
  });

  return (
    <div className="min-h-screen w-screen flex flex-col px-10">
      <div className=" h-16 flex justify-between">
        <Link className="py-2 text-center my-auto" to={`/`}>
          Home
        </Link>
        <div className="py-2 text-center uppercase my-auto underline font-bold">
          Directory: {directory && directory.name}
        </div>
        <button
          className="h-10 my-auto bg-blue-400 text-white font-bold text-center align-middle"
          onClick={() => downloadAnnotations()}
        >
          Download Annotations
        </button>
      </div>
      <div className="w-full h-24 flex flex-row w-full justify-center items-center border my-5 rounded-md border-gray-600 border-dashed">
        <input
          onChange={filesChanged}
          placeholder="Choose files"
          type="file"
          name="files"
          multiple
          max={10}
        />
        <button
          className="h-10 my-auto uppercase bg-blue-400 text-white font-bold text-center align-middle"
          onClick={uploadFiles}
        >
          upload
        </button>
      </div>
      <div className="text-xl font-bold">Files:</div>
      <div className="w-full flex-1 flex flex-col">
        {directory &&
          directory.files &&
          directory.files.map((file) => (
            <NavLink
              className="py-2 border-b flex justify-between"
              to={`/directory/${params.directoryId}/image/${file.id}`}
              key={file.id}
            >
              {file.name || "some file"}
            </NavLink>
          ))}
      </div>
    </div>
  );
}
