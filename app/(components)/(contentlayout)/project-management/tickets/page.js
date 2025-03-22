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
import ClearIndicator from "@/lib/select2";
import {
  getActivitiesSelect2,
  getProjectsSelect2,
  getTicketPriorities,
  getTicketStatuses,
  getTicketTypes,
} from "@/shared/redux/features/apiSlice";
import {
  setModalOpen,
  setTicketEdit,
  setActivity as setActvty,
} from "@/shared/redux/features/ticketSlice";
import AddTaskModal from "@/components/tickets/kanob/AddTaskModal";
import EditTaskModal from "@/components/tickets/kanob/EditTaskModal";
import toast, { Toaster } from "react-hot-toast";
const Select = dynamic(() => import("react-select"), { ssr: false });

const Tickets = () => {
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
    ticketStatuses: statuses,
    ticketTypes: types,
    ticketPriorities: priorities,
    projects,
    activities,
    isLoading,
    error,
  } = useSelector((state) => state.api);
  const { modalOpen, ticketEdit } = useSelector((state) => state.ticket);
  const [tickets, setTickets] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [url, setUrl] = useState(`${apiUrl}/api/tickets/list`);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [status, setStatus] = useState(null);
  const [type, setType] = useState(null);
  const [priority, setPriority] = useState(null);
  const [projectt, setProjectt] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (session?.access_token) {
      dispatch(getTicketStatuses(session.access_token));
      dispatch(getProjectsSelect2(session.access_token));
      dispatch(getTicketTypes(session.access_token));
      dispatch(getTicketPriorities(session.access_token));
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token && projectt) {
      dispatch(
        getActivitiesSelect2({
          token: session.access_token,
          id: projectt.value,
        })
      );
    }
  }, [projectt]);
  useEffect(() => {
    if (session?.access_token && !deleteItem) {
      getTickets();
    }
  }, [
    url,
    sortBy,
    session,
    deleteItem,
    status,
    type,
    priority,
    projectt,
    activity,
    modalOpen,
    ticketEdit,
  ]);
  const getTickets = async () => {
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
          projectId: projectt?.value,
          activityId: activity?.value,
          priorityId: priority?.value,
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
        setTickets(result);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "success",
      });
    }
  };

  const handleEdit = (row) => {
    dispatch(setTicketEdit(row));
    dispatch(setActvty({ value: row.activity.id, label: row.activity.title }));
  };

  const deleteTicket = async (row) => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${apiUrl}/api/ticket/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // optional, depending on your authentication
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the activity.",
          icon: "error",
        });
        return;
      }

      toast.success(result.message);
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
      <Toaster position="bottom-right" />
      <Seo title={"Tickets"} />
      <Pageheader currentpage="Tickets" activepage="Tickets" mainpage="List" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="flex justify-between gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-wrap gap-1 newproject">
                    <button
                      onClick={() => dispatch(setModalOpen())}
                      className="ti-btn ti-btn-primary-full me-2 !mb-0"
                    >
                      <i className="ri-add-line me-1 font-semibold align-middle"></i>
                      New ticket
                    </button>
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
                      className="!w-28"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Type"
                    />
                    <Select
                      name="priority"
                      options={priorities}
                      isClearable
                      components={{ ClearIndicator }}
                      onChange={(e) => setPriority(e)}
                      className="!w-28"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Priority"
                    />
                    <Select
                      name="project"
                      options={projects}
                      isClearable
                      components={{ ClearIndicator }}
                      onChange={(e) => setProjectt(e)}
                      className="!w-60"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Project"
                    />
                    <Select
                      name="activity"
                      options={activities}
                      isClearable
                      components={{ ClearIndicator }}
                      onChange={(e) => setActivity(e)}
                      isDisabled={!projectt}
                      className="!w-60"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                      placeholder="Activity"
                    />
                  </div>

                  <div className="flex" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search tickets"
                      aria-label="Search"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      onClick={getTickets}
                      className="ti-btn ti-btn-light !mb-0"
                      type="submit"
                    >
                      Search
                    </button>
                  </div>
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
                          Title
                        </th>
                        <th scope="col" className="text-start">
                          Ticket ID
                        </th>
                        <th scope="col" className="text-start">
                          Type
                        </th>
                        <th scope="col" className="text-start">
                          Estimation
                        </th>

                        <th scope="col" className="text-start">
                          Status
                        </th>
                        <th scope="col" className="text-start">
                          Due Date
                        </th>
                        <th scope="col" className="text-start">
                          Priority
                        </th>
                        <th scope="col" className="text-start">
                          Assigned To
                        </th>

                        <td scope="col" className="text-start">
                          Action
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets?.data &&
                        tickets.data.map((row, index) => (
                          <tr className="border-b border-defaultborder">
                            <th scope="row  ">
                              <Link
                                href={`/project-management/tickets/${row.id}`}
                                className="text-blue-500 text-truncate"
                              >
                                {row.title}
                              </Link>
                            </th>
                            <td>{row.ticket_number}</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: `rgba(${parseInt(
                                    row.type.color.slice(1, 3),
                                    16
                                  )}, ${parseInt(
                                    row.type.color.slice(3, 5),
                                    16
                                  )}, ${parseInt(
                                    row.type.color.slice(5, 7),
                                    16
                                  )}, 0.1)`,
                                  color: row.type.color,
                                }}
                              >
                                {row.type.title}
                              </span>
                            </td>
                            <td>{row.estimation} hours</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: `rgba(${parseInt(
                                    row.status.color.slice(1, 3),
                                    16
                                  )}, ${parseInt(
                                    row.status.color.slice(3, 5),
                                    16
                                  )}, ${parseInt(
                                    row.status.color.slice(5, 7),
                                    16
                                  )}, 0.1)`,
                                  color: row.status.color,
                                }}
                              >
                                {row.status.title}
                              </span>
                            </td>
                            <td>{row.deadline}</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: `rgba(${parseInt(
                                    row.priority.color.slice(1, 3),
                                    16
                                  )}, ${parseInt(
                                    row.priority.color.slice(3, 5),
                                    16
                                  )}, ${parseInt(
                                    row.priority.color.slice(5, 7),
                                    16
                                  )}, 0.1)`,
                                  color: row.priority.color,
                                }}
                              >
                                {row.priority.title}
                              </span>
                            </td>
                            <td>
                              <span className="avatar avatar-sm avatar-rounded">
                                <img src={row.responsible.photo} alt="img" />
                              </span>
                            </td>

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
                                      deleteTicket(row);
                                    }
                                  })
                                }
                                className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave"
                              >
                                <i className="ri-delete-bin-line align-middle me-2 inline-block"></i>
                                Delete
                              </button>
                              <button
                                onClick={() => handleEdit(row)}
                                className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-success-full btn-wave"
                              >
                                <i className="ri-edit-2-line align-middle me-2 inline-block"></i>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <nav aria-label="Page navigation">
                    <ul className="ti-pagination ltr:float-right rtl:float-left mb-4">
                      {tickets.links &&
                        tickets.links.length > 3 &&
                        tickets.links.map((row, index) => (
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
                  {modalOpen && <AddTaskModal />}
                  {ticketEdit && <EditTaskModal />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
