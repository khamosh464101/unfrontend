"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import Single from "@/components/donors/items/Single";

const Donorlist = () => {
  const { data: session } = useSession();
  const Optionsdata = [
    { value: "Oldest", label: "Oledest" },
    { value: "Newest", label: "Newest" },
    { value: "A - Z", label: "A - Z" },
    { value: "Z - A", label: "Z - A" },
  ];
  const deleteItem = useSelector((state) => state.delete.item);
  const [donors, setDonors] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [url, setUrl] = useState(`${apiUrl}/api/donors`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Oldest");

  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getDonors();
    }
  }, [url, sortBy, session, deleteItem]);
  const getDonors = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
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
        setDonors(result);
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
      <Seo title={"Donor List"} />
      <Pageheader
        currentpage="Donor List"
        activepage="Donors"
        mainpage="Donor List"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-1 newproject">
                  <Link
                    href="/project-management/donors/create"
                    className="ti-btn ti-btn-primary-full me-2 !mb-0"
                  >
                    <i className="ri-add-line me-1 font-semibold align-middle"></i>
                    New Donor
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
                    placeholder="Search Donor"
                    aria-label="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={getDonors}
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
        {donors?.data &&
          donors.data.map((row, index) => (
            <Single row={row} apiUrl={apiUrl} key={index} />
          ))}
      </div>
      <nav aria-label="Page navigation">
        <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
          {donors.links &&
            donors.links.length > 3 &&
            donors.links.map((row, index) => (
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

export default Donorlist;
