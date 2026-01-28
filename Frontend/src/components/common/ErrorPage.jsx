
import { useRouteError } from "react-router-dom";
import Navbar from "../layout/Navbar";

export default function ErrorPage({ sideNav, handleSide, sideNavFalse }) {
  const error = useRouteError();

  return (
    <>
      <Navbar
        sideNav={sideNav}
        handleSide={handleSide}
        sideNavFalse={sideNavFalse}
      />

      <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center top-16">
        <h1 className="text-3xl font-bold text-gray-800">Oops!</h1>
        <p className="mt-2 text-gray-600">
          {error?.statusText || error?.message || "Something went wrong"}
        </p>
      </div>
    </>
  );
}
