import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Link } from "react-router-dom";

export const DirectoryList = () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [directories, setDirectories] = useState<Array<any>>([]);

  const directoryList = () => {
    if (directories.length > 0) {
      return directories.map((directory) => {
        return (
          <Link
            className="border-b py-2"
            to={`/directory/${directory.id}`}
            key={directory.id}
          >
            {directory.name}
          </Link>
        );
      });
    } else return <></>;
  };

  const getDirectoryList = async () => {
    return axios.get("http://localhost:8000/directories/");
  };

  const refreshDirectoryList = async () => {
    getDirectoryList().then((resp) => {
      setDirectories(resp.data);
    });
  };

  useEffect(() => {
    setFetching(true);
    if (!fetching) {
      getDirectoryList().then((resp) => {
        setDirectories(resp.data);
      });
    }
  });

  return (
    <div className="mt-5">
      <div className="justify-end w-full flex">
        <button className="" onClick={() => refreshDirectoryList()}>
          refresh
        </button>
      </div>
      <div className="flex flex-col">{directoryList()}</div>
    </div>
  );
};
