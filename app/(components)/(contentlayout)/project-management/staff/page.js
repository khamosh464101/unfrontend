"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { setDelete } from "@/shared/redux/features/deleteSlice";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
const Select = dynamic(() => import("react-select"), { ssr: false });

const Team = () => {
  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
  ];

  const { data: session } = useSession();
  const Optionsdata = [
    { value: "Oldest", label: "Oledest" },
    { value: "Newest", label: "Newest" },
    { value: "A - Z", label: "A - Z" },
    { value: "Z - A", label: "Z - A" },
  ];
  const dispatch = useDispatch();
  const deleteItem = useSelector((state) => state.delete.item);
  const [staff, setStaff] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [url, setUrl] = useState(`${apiUrl}/api/staffs`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Oldest");

  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getStaff();
    }
  }, [url, sortBy, session, deleteItem]);
  const getStaff = async () => {
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
        setStaff(result);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "success",
      });
    }
  };

  const deleteStaff = async (id) => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${apiUrl}/api/staff/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // optional, depending on your authentication
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message ||
            "An error occurred while deleting the team member.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Team member deleted successfully.",
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
    <Fragment>
      <Seo title={"Staff/Team members"} />
      <Pageheader
        currentpage="Staff/Team members"
        activepage="Pages"
        mainpage="Staff/Team members"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="team-members" id="team-members">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-body">
                    <div className="team-header">
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex flex-wrap gap-1 newproject">
                          <Link
                            href="/project-management/staff/create"
                            className="ti-btn ti-btn-primary-full me-2 !mb-0"
                          >
                            <i className="ri-add-line me-1 font-semibold align-middle"></i>
                            New Member
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
                            placeholder="Search Project"
                            aria-label="Search"
                            onChange={(e) => setSearch(e.target.value)}
                          />
                          <button
                            onClick={getStaff}
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
              {staff?.data &&
                staff.data.map((row, index) => (
                  <div
                    className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-12 col-span-12"
                    key={Math.random()}
                  >
                    <div className="box team-member-card">
                      <div className="teammember-cover-image">
                        <img
                          src={`/assets/images/staff/1.jpg`}
                          className="card-img-top"
                          alt="..."
                        />
                        <span className="avatar avatar-xl avatar-rounded">
                          <img src={row.photo} alt={row.name} />
                        </span>
                        <Link
                          aria-label="anchor"
                          href="#!"
                          scroll={false}
                          className={`team-member-star text-${row.rating}`}
                        >
                          <i className="ri-star-fill text-[1rem]"></i>
                        </Link>
                      </div>
                      <div className="box-body !p-0">
                        <div className="flex flex-wrap align-item-center sm:mt-0 mt-[3rem] justify-between border-b border-dashed dark:border-defaultborder/10 p-4">
                          <div className="team-member-details flex-grow">
                            <p className="mb-0 font-semibold text-[1rem] text-truncate">
                              <Link href="#!" scroll={false}>
                                {row.name}
                              </Link>
                            </p>
                            <p className="mb-0 text-[0.75rem] text-[#8c9097] dark:text-white/50 text-truncate">
                              {row.official_email}
                            </p>
                          </div>
                        </div>
                        <div className="team-member-stats sm:flex items-center justify-evenly">
                          <div className="text-center p-4 w-full">
                            <p className="font-semibold mb-0">Member Since</p>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                              {row.date_of_joining}
                            </span>
                          </div>
                          <div className="text-center p-4 w-full">
                            <p className="font-semibold mb-0">Projects</p>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                              {row.projects_count}
                            </span>
                          </div>
                          <div className="text-center p-4 w-full">
                            <p className="font-semibold mb-0">Position</p>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                              {row.position_title}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="box-footer border-block-start-dashed dark:border-defaultborder/10 text-center">
                        <div className="btn-list">
                          <div className="btn-list">
                            <Link
                              href={`/project-management/staff/${row.id}`}
                              className="ti-btn ti-btn-sm ti-btn-secondary !me-[0.375rem]"
                            >
                              <i className="ri-eye-line font-bold"></i>
                            </Link>

                            <Link
                              href={`/project-management/staff/edit/${row.id}`}
                              className="ti-btn ti-btn-sm ti-btn-success me-[0.375rem]"
                            >
                              <i className="ri-edit-line font-bold"></i>
                            </Link>
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
                                    deleteStaff(row.id);
                                  }
                                })
                              }
                              aria-label="button"
                              className="ti-btn ti-btn-sm ti-btn-danger"
                            >
                              <i className="ri-delete-bin-6-line font-bold"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <nav aria-label="Page navigation">
              <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
                {staff.links &&
                  staff.links.length > 3 &&
                  staff.links.map((row, index) => (
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
    </Fragment>
  );
};

export default Team;
