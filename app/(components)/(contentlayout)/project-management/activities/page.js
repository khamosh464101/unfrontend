"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import Single from "@/components/activities/items/Single";
import {
  getActivityStatuses,
  getActivityTypes,
  getProjectsSelect2,
} from "@/shared/redux/features/apiSlice";
import ClearIndicator from "@/lib/select2";

const Activitylist = () => {
  const { data: session } = useSession();
  const Optionsdata = [
    { value: "Oldest", label: "Oledest" },
    { value: "Newest", label: "Newest" },
    { value: "A - Z", label: "A - Z" },
    { value: "Z - A", label: "Z - A" },
  ];
  const deleteItem = useSelector((state) => state.delete.item);
  const dispatch = useDispatch();
  const {
    activityStatuses: statuses,
    activityTypes: types,
    projects,
    isLoading,
    error,
  } = useSelector((state) => state.api);
  const [activities, setActivities] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [url, setUrl] = useState(`${apiUrl}/api/activities`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Oldest");
  const [status, setStatus] = useState(null);
  const [type, setType] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (session?.access_token) {
      dispatch(getActivityStatuses(session.access_token));
      dispatch(getProjectsSelect2(session.access_token));
      dispatch(getActivityTypes(session.access_token));
    }
  }, [session]);
  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getActivities();
    }
  }, [url, sortBy, session, deleteItem, status, type, project]);
  const getActivities = async () => {
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
          statusId: status?.value,
          typeId: type?.value,
          projectId: project?.value,
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
        setActivities(result);
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
      <Seo title={"Activity List"} />
      <Pageheader
        currentpage="Activity List"
        activepage="Activities"
        mainpage="Activity List"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-1 newproject">
                  <Link
                    href="/project-management/activities/create"
                    className="ti-btn ti-btn-primary-full me-2 !mb-0"
                  >
                    <i className="ri-add-line me-1 font-semibold align-middle"></i>
                    New Activity
                  </Link>
                  <Select
                    name="sortBy"
                    options={Optionsdata}
                    onChange={(e) => setSortBy(e.value)}
                    className="!w-28"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Sort By"
                  />
                  <Select
                    name="status"
                    options={statuses}
                    isClearable
                    components={{ ClearIndicator }}
                    onChange={(e) => setStatus(e)}
                    className="!w-28"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Status"
                  />
                  <Select
                    name="type"
                    options={types}
                    isClearable
                    components={{ ClearIndicator }}
                    onChange={(e) => setType(e)}
                    className="!w-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Type"
                  />
                  <Select
                    name="status"
                    options={projects}
                    isClearable
                    components={{ ClearIndicator }}
                    onChange={(e) => setProject(e)}
                    className="!w-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Project"
                  />
                </div>

                <div className="flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search Activity"
                    aria-label="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={getActivities}
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
      {isLoading && (
        <div className="flex justify-center items-center space-x-2">
          <i className="ri-loader-4-line animate-spin text-blue-500 text-3xl"></i>

          <span className="text-lg text-blue-500">Loading...</span>
        </div>
      )}
      {error && (
        <div class="flex justify-center items-center space-x-2 bg-red-100 border border-red-500 text-red-700 p-4 rounded-md">
          <i class="ri-error-warning-line text-3xl"></i>
          <span class="text-lg">{error} || Something went wrong!</span>
        </div>
      )}
      <div className="grid grid-cols-12 gap-x-6">
        {activities?.data &&
          activities.data.map((row, index) => (
            <Single row={row} apiUrl={apiUrl} key={index} />
          ))}
      </div>
      <nav aria-label="Page navigation">
        <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
          {activities.links &&
            activities.links.length > 3 &&
            activities.links.map((row, index) => (
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

export default Activitylist;
