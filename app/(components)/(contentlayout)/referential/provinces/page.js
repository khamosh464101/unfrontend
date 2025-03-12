"use client";
import {
  BasicTable,
  ResponsiveDataTable,
} from "@/shared/data/tables/datatabledata";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { setDelete } from "@/shared/redux/features/deleteSlice";
const Select = dynamic(() => import("react-select"), { ssr: false });

const Provinces = () => {
  const { data: session } = useSession();
  const Optionsdata = [
    { value: "Oldest", label: "Oledest" },
    { value: "Newest", label: "Newest" },
    { value: "A - Z", label: "A - Z" },
    { value: "Z - A", label: "Z - A" },
  ];
  const dispatch = useDispatch();
  const deleteItem = useSelector((state) => state.delete.item);
  const [provinces, setProvinces] = useState({});
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const [url, setUrl] = useState(`${baseUrl}/api/provinces`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Oldest");
  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getProvinces();
    }
  }, [url, session, sortBy, deleteItem]);
  const getProvinces = async () => {
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
        setProvinces(result);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "success",
      });
    }
  };

  const deleteProvince = async (id) => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${baseUrl}/api/province/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "applicaton/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the record.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Record deleted successfully.",
        icon: "success",
      });
      dispatch(setDelete());
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };
  return (
    <div>
      <Seo title={"Provinces"} />
      <Pageheader
        currentpage="Provinces"
        activepage="Referential"
        mainpage="Provinces"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="flex justify-between gap-4">
                <div className="flex flex-wrap gap-1 newproject">
                  <Link
                    href="/referential/provinces/create"
                    className="ti-btn ti-btn-primary-full me-2 !mb-0"
                  >
                    <i className="ri-add-line me-1 font-semibold align-middle"></i>
                    New province
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
                    placeholder="Search province"
                    aria-label="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={getProvinces}
                    className="ti-btn ti-btn-light !mb-0"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="box-body space-y-3">
              <div className="overflow-hidden">
                <div className="table-responsive">
                  <table
                    className="table whitespace-nowrap ti-striped-table
 table-hover min-w-full ti-custom-table-hover"
                  >
                    <thead>
                      <tr className="border-b border-defaultborder">
                        <th scope="col" className="text-start">
                          Name
                        </th>
                        <th scope="col" className="text-start">
                          Name farsi
                        </th>
                        <th scope="col" className="text-start">
                          Name pashto
                        </th>
                        <th scope="col" className="text-start">
                          Latitude
                        </th>
                        <th scope="col" className="text-start">
                          Longitude
                        </th>
                        <th scope="col" className="text-start">
                          Code
                        </th>
                        <td scope="col" className="text-start">
                          Action
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {provinces?.data &&
                        provinces.data.map((row, index) => (
                          <tr className="border-b border-defaultborder">
                            <th scope="row">{row.name}</th>
                            <td>{row.name_fa}</td>
                            <td>{row.name_pa}</td>
                            <td>{row.latitude}</td>
                            <td>{row.longitude}</td>
                            <td>{row.code}</td>
                            <td className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!",
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      deleteProvince(row.id);
                                    }
                                  })
                                }
                                className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave"
                              >
                                <i className="ri-delete-bin-line align-middle me-2 inline-block"></i>
                                Delete
                              </button>
                              <Link
                                href={`/referential/provinces/edit/${row.id}`}
                                className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-success-full btn-wave"
                              >
                                <i className="ri-edit-2-line align-middle me-2 inline-block"></i>
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <nav aria-label="Page navigation">
                    <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
                      {provinces.links &&
                        provinces.links.length > 3 &&
                        provinces.links.map((row, index) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Provinces;
