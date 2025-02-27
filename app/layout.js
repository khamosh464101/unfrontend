"use client";
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import { useState } from "react";
import { Initialload } from "@/shared/contextapi";
import PrelineScript from "./Prelinescript";
import { SessionProvider } from "next-auth/react";

const RootLayout = ({ children, session }) => {
  const [pageloading, setpageloading] = useState(false);
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <Initialload.Provider value={{ pageloading, setpageloading }}>
            {children}
          </Initialload.Provider>
        </Provider>
        <PrelineScript />
      </SessionProvider>
    </>
  );
};
export default RootLayout;
