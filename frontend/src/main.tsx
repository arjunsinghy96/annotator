import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import DirectoryPage from "./pages/Directory";
import { DirectoryListPage } from "./pages/DirectoryList";
import { AnnotationPage } from "./pages/Annotate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryListPage />,
  },
  {
    path: "/directory/:directoryId",
    element: <DirectoryPage />,
  },
  {
    path: "directory/:directoryId/image/:imageId",
    element: <AnnotationPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
