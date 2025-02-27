"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Swal from "sweetalert2";
import Single from "./item/single";
import { useSelector } from "react-redux";

const Programlist = () => {
  const { data: session } = useSession();
  const Optionsdata = [
    { value: "Oldest", label: "Oledest" },
    { value: "Newest", label: "Newest" },
    { value: "A - Z", label: "A - Z" },
    { value: "Z - A", label: "Z - A" },
  ];
  const deleteItem = useSelector((state) => state.delete.item);
  const [programs, setPrograms] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [url, setUrl] = useState(`${apiUrl}/api/programs`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Oldest");

  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getPrograms();
    }
  }, [url, sortBy, session, deleteItem]);
  const getPrograms = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          search: search,
          sortBy: sortBy,
        }),
      });
      if (!res.ok) {
        Swal.fire({
          title: "warning",
          text: "Something went wrong.",
          icon: "warning",
        });
      } else {
        const result = await res.json();
        setPrograms(result);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "success",
      });
    }
  };

  return (
    <Fragment>
      <Seo title={"Program List"} />
      <Pageheader
        currentpage="Program List"
        activepage="Programs"
        mainpage="Program List"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-1 newproject">
                  <Link
                    href="/project-management/programs/create"
                    className="ti-btn ti-btn-primary-full me-2 !mb-0"
                  >
                    <i className="ri-add-line me-1 font-semibold align-middle"></i>
                    New Program
                  </Link>
                  <Select
                    name="colors"
                    options={Optionsdata}
                    onChange={(e) => setSortBy(e.value)}
                    className="!w-40"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Sort By"
                  />
                </div>

                <div className="flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search Program"
                    aria-label="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={getPrograms}
                    className="ti-btn ti-btn-light !mb-0"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        {programs?.data &&
          programs.data.map((row, index) => (
            <Single row={row} apiUrl={apiUrl} key={index} />
          ))}
      </div>
      <nav aria-label="Page navigation">
        <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
          {programs.links &&
            programs.links.length > 3 &&
            programs.links.map((row, index) => (
              <li
                className={`page-item ${
                  row.active || row.url == null ? "disabled" : ""
                }`}
              >
                <button
                  disabled={row.active || row.url === null}
                  onClick={() => setUrl(row.url)}
                  className="page-link px-3 py-[0.375rem]"
                >
                  {row.label}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </Fragment>
  );
};

export default Programlist;
