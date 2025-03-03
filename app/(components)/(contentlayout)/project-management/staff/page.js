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
        <div className="xl:col-span-9 col-span-12">
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
                    className="xxl:col-span-4 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
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
                              {123}
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
        <div className="xl:col-span-3 col-span-12">
          <div className="team-groups">
            <div className="box">
              <div className="box-header  !justify-between">
                <h6 className="font-semibold mb-0">All Teams</h6>
                <div>
                  <button
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary !text-[0.75rem] !py-1 !px-2"
                    data-hs-overlay="#hs-vertically-centered-modal1"
                  >
                    Create Team<i className="ri-add-line ms-1 align-middle"></i>
                  </button>
                  <div
                    id="hs-vertically-centered-modal1"
                    className="hs-overlay hidden ti-modal"
                  >
                    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
                      <div className="ti-modal-content w-full">
                        <div className="ti-modal-header">
                          <h6 className="modal-title" id="staticBackdropLabel2">
                            Create Team
                          </h6>
                          <button
                            type="button"
                            className="hs-dropdown-toggle ti-modal-close-btn"
                            data-hs-overlay="#hs-vertically-centered-modal1"
                          >
                            <span className="sr-only">Close</span>
                            <svg
                              className="w-3.5 h-3.5"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="ti-modal-body px-4">
                          <div className="gridgrid-cols-12 gap-4">
                            <div className="xl:col-span-12 col-span-12">
                              <label htmlFor="team-name" className="form-label">
                                Team Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="team-name"
                                placeholder="Enter Name"
                              />
                            </div>
                            <div className="xl:col-span-12 col-span-12 mt-2">
                              <label className="form-label">
                                Maximum Team Limit
                              </label>

                              <Select
                                name="colors"
                                options={options}
                                className="basic-multi-select"
                                menuPlacement="auto"
                                classNamePrefix="Select2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ti-modal-footer">
                          <button
                            type="button"
                            className="hs-dropdown-toggle ti-btn ti-btn-light"
                            data-hs-overlay="#hs-vertically-centered-modal1"
                          >
                            Cancel
                          </button>
                          <Link
                            className="ti-btn ti-btn-primary-full"
                            href="#!"
                            scroll={false}
                          >
                            create
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-body !p-0">
                <PerfectScrollbar>
                  <div className="teams-nav" id="teams-nav">
                    <ul className="list-none mb-0 mt-2">
                      <li className="!pb-0">
                        <div className="flex justify-between items-center">
                          <div className="text-[.625rem] font-semibold mb-2 text-[#8c9097] dark:text-white/50">
                            TEAM UI
                          </div>
                          <button
                            type="button"
                            aria-label="button"
                            className="hs-dropdown-toggle ti-btn ti-btn-sm ti-btn-success"
                            data-hs-overlay="#create-teamui-mem"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                          <div
                            id="hs-vertically-centered-modal"
                            className="hs-overlay hidden ti-modal"
                          >
                            <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
                              <div className="ti-modal-content w-full">
                                <div className="ti-modal-header">
                                  <h6 className="modal-title">Add Member</h6>
                                  <button
                                    type="button"
                                    className="hs-dropdown-toggle ti-modal-close-btn"
                                    data-hs-overlay="#create-teamui-mem"
                                  >
                                    <span className="sr-only">Close</span>{" "}
                                    <svg
                                      className="w-3.5 h-3.5"
                                      width="8"
                                      height="8"
                                      viewBox="0 0 8 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                        fill="currentColor"
                                      ></path>{" "}
                                    </svg>{" "}
                                  </button>{" "}
                                </div>
                                <div className="ti-modal-body px-4">
                                  <div className="grid grid-cols-12">
                                    <div className="col-span-12">
                                      <label
                                        htmlFor="team-name3"
                                        className="form-label"
                                      >
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="team-name3"
                                        placeholder="Enter Name"
                                      />{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>
                                <div className="ti-modal-footer">
                                  <button
                                    type="button"
                                    className="hs-dropdown-toggle ti-btn ti-btn-light"
                                    data-hs-overlay="#create-teamui-mem"
                                  >
                                    {" "}
                                    Cancel{" "}
                                  </button>
                                  <a
                                    className="ti-btn ti-btn-primary-full"
                                    href="#!"
                                  >
                                    {" "}
                                    Add{" "}
                                  </a>
                                </div>{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/3.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Angelica Hale</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/5.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Mona Magore</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                8 min
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/15.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Mark Wains</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/12.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Alex Carey</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/7.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Monika Karen</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                24 mins
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="pb-0">
                        <div className="flex justify-between items-center">
                          <div className="text-[.625rem] font-semibold mb-2 text-[#8c9097] dark:text-white/50">
                            TEAM REACT
                          </div>
                          <button
                            type="button"
                            aria-label="button"
                            className="ti-btn ti-btn-sm ti-btn-success"
                            data-hs-overlay="#create-teamreact-mem"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/10.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Matthew Ray</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/8.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Melissa Blue</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/2.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Brenda Sams</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/14.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Muhammed Kher</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                13 mins
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/4.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Dorga Boavan</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/13.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Yashna Polana</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                19 mins
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="pb-0">
                        <div className="flex justify-between items-center">
                          <div className="text-[.625rem] font-semibold mb-2 text-[#8c9097] dark:text-white/50">
                            TEAM TESTING
                          </div>
                          <button
                            type="button"
                            aria-label="button"
                            className="ti-btn ti-btn-sm ti-btn-success"
                            data-hs-overlay="#create-teamtesting-mem"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/11.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Jason Smith</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/6.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Sasha Hops</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                21 mins
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/9.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Mark Zaker</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                38 mins
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded online">
                                <img
                                  src="../../assets/images/faces/16.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Suarez Adam</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50"></span>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="#!" scroll={false}>
                          <div className="flex items-center">
                            <div className="me-2 flex items-center">
                              <span className="avatar avatar-sm avatar-rounded offline">
                                <img
                                  src="../../assets/images/faces/1.jpg"
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <span>Kiara Advensh</span>
                            </div>
                            <div>
                              <span className="text-[.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                                1 hr
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="create-teamui-mem" className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="ti-modal-content w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title">Add Member</h6>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay="#create-teamui-mem"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3.5 h-3.5"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="ti-modal-body px-4">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <label htmlFor="team-name3" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="team-name3"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-light"
                data-hs-overlay="#create-teamui-mem"
              >
                Cancel
              </button>
              <a className="ti-btn ti-btn-primary-full" href="#!">
                Add
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="create-teamreact-mem" className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="ti-modal-content w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title">Add Member</h6>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay="#create-teamreact-mem"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3.5 h-3.5"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="ti-modal-body px-4">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <label htmlFor="team-name3" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="team-name5"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-light"
                data-hs-overlay="#create-teamreact-mem"
              >
                Cancel
              </button>
              <a className="ti-btn ti-btn-primary-full" href="#!">
                Add
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="create-teamtesting-mem" className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="ti-modal-content w-full">
            <div className="ti-modal-header">
              <h6 className="modal-title">Add Member</h6>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay="#create-teamtesting-mem"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3.5 h-3.5"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="ti-modal-body px-4">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <label htmlFor="team-name3" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="team-name4"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-light"
                data-hs-overlay="#create-teamtesting-mem"
              >
                Cancel
              </button>
              <a className="ti-btn ti-btn-primary-full" href="#!">
                Add
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Team;
