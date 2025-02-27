"use client";
import PrelineScript from "@/app/Prelinescript";
import Backtotop from "@/shared/layout-components/backtotop/backtotop";
import Footer from "@/shared/layout-components/footer/footer";
import Header from "@/shared/layout-components/header/header";
import Sidebar from "@/shared/layout-components/sidebar/sidebar";
import Switcher from "@/shared/layout-components/switcher/switcher";
import { ThemeChanger } from "@/shared/redux/action";
import store from "@/shared/redux/store";
import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";

const Layout = ({ children }) => {
  const [MyclassName, setMyClass] = useState("");

  const Bodyclickk = () => {
    const theme = store.getState();
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      if (theme.iconOverlay === "open") {
        ThemeChanger({ ...theme, iconOverlay: "" });
      }
    }
  };

  const [lateLoad, setlateLoad] = useState(false);

  useEffect(() => {
    setlateLoad(true);
  });
  return (
    <>
      <Fragment>
        <div style={{ display: `${lateLoad ? "block" : "none"}` }}>
          <Switcher />
          <div className="page">
            <Header />
            <Sidebar />
            <div className="content">
              <div className="main-content" onClick={Bodyclickk}>
                {children}
              </div>
            </div>
            <Footer />
          </div>
          <Backtotop />
          <PrelineScript />
        </div>
      </Fragment>
    </>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Layout);
