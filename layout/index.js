import React, { useEffect } from "react";

import Header from "./header";
import SubHeader from "./sub-header";
import Sidebar from "./sidebar";
import { encryptName } from "helpers/encryptions";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setConfig } from "lib/slices/config";
const Layout = ({ children }) => {
  let router = useRouter();
  const dispatch = useDispatch();

  useEffect(
    () => {
      const getConfig = localStorage.getItem(encryptName("config"));
      if (getConfig) {
        dispatch(setConfig(JSON.parse(getConfig)));
      }
    }, [dispatch]);
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="position-relative">
          <Header />
          {!router.pathname.includes("track") &&
            !router.pathname.includes("map") &&
            !router.pathname.includes("/history") && (
              <SubHeader pageName={router.pathname} />
            )}
        </div>
        <div
          className={
            "position-relative mt-n5 py-0 " +
            (!router.pathname.includes("track") && "content-inner")
          }
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
