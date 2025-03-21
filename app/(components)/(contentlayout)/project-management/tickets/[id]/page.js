"use client";

import Attachment from "@/components/projects/Attachment";
import AddLogTimeModal from "@/components/tickets/AddLogTimeModal";
import Comment from "@/components/tickets/Comment";
import Location from "@/components/tickets/Location";
import Log from "@/components/tickets/Log";
import TimeLog from "@/components/tickets/TimeLog";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { setModalTimeLogOpen } from "@/shared/redux/features/ticketSlice";
import { setHours } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const TicketOverview = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const [ticket, setTicket] = useState({});
  const [tickets, setTickets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [comments, setComments] = useState([]);
  const [gozars, setGozars] = useState([]);
  const [hours, setHours] = useState([]);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const dispatch = useDispatch();
  const modalTimeLogOpen = useSelector(
    (state) => state.ticket.modalTimeLogOpen
  );
  const menus = [
    { name: "Comments", icon: "ri-message-3-line" },
    { name: "Log History", icon: "ri-chat-history-line" },
    { name: "Time Logged", icon: "ri-progress-5-line" },
    { name: "Location", icon: "ri-map-pin-2-line" },
    { name: "Attachements", icon: "ri-attachment-line" },
  ];
  const [menu, setMenu] = useState(menus[0]);

  const router = useRouter();
  useEffect(() => {
    if (session?.access_token) {
      getTicket();
    }
  }, [session, id]);
  const getTicket = async () => {
    const res = await fetch(`${baseUrl}/api/ticket/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setDocuments(result.documents);
      setTickets(result.tickets);
      setGozars(result.gozars);
      setComments(result.comments);
      setHours(result.hours);
      setTicket(result);
    }
  };

  const deleteTicket = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/${id}`, {
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
            result.message || "An error occurred while deleting the ticket.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Ticket deleted successfully.",
        icon: "success",
      });
      router.push("/project-management/tickets");
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
      <Toaster position="bottom-right" />
      <Seo title={"Ticket Overview"} />
      <Pageheader
        currentpage="Ticket Overview"
        activepage="Tickets"
        activeurl="/project-management/tickets"
        mainpage="Ticket Overview"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-9 col-span-12">
          <div className="box custom-box">
            <div className="box-header justify-between flex">
              <div className="box-title">Ticket Details</div>
              <div className="flex gap-2">
                <Link
                  href="/project-management/tickets/create"
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                >
                  <i className="ri-add-line align-middle me-1 font-semibold"></i>
                  Create Ticket
                </Link>
                <Link
                  href={`/project-management/tickets/edit/${id}`}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary-full btn-wave"
                >
                  <i className="ri-edit-line align-middle me-1 font-semibold"></i>
                  Edit Ticket
                </Link>
                <button
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
                        deleteTicket();
                      }
                    })
                  }
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave"
                >
                  <i className="ri-delete-bin-line align-middle me-1 font-semibold"></i>
                  Delete Ticket
                </button>
                <button
                  onClick={() => dispatch(setModalTimeLogOpen())}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-warning-full btn-wave"
                >
                  <i className="ri-progress-5-line align-middle me-1 font-semibold"></i>
                  Log time
                </button>
              </div>
            </div>
            <div className="box-body">
              <h5 className="font-semibold mb-4 task-title">{ticket.title}</h5>
              <div className="text-[.9375rem] font-semibold mb-2">
                Ticket Description :
              </div>
              <p
                className="text-[#8c9097] dark:text-white/50 task-description my-6"
                dangerouslySetInnerHTML={{ __html: ticket.description }}
              />
            </div>
            <div className="box-footer">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Assigned By
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    <Avatar
                      className="mr-2"
                      name={ticket?.owner?.name}
                      round={true}
                      color={`#8A2BE2`}
                      size="25"
                    />
                    {ticket?.owner?.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Assigned To
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    <Avatar
                      className="mr-2"
                      name={ticket?.responsible?.name}
                      round={true}
                      color={`#8A2BE2`}
                      size="25"
                    />
                    {ticket?.responsible?.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Estimation
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {ticket.estimation} hours
                  </span>
                </div>

                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Deadline
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {ticket.deadline_formatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="box custom-box">
            <div className="box-header flex flex-row justify-between">
              {menus.map((row, index) => (
                <button
                  onClick={() => setMenu(menus[index])}
                  className={`${
                    row.name == menu.name
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "hover:border-b-2 hover:border-blue-500 hover:text-blue-500"
                  } px-4 py-2`}
                >
                  <i className={`${row.icon} mr-2`}></i>
                  {row.name}
                </button>
              ))}
            </div>
            <div className="box-body">
              {menu.name == "Comments" && (
                <Comment
                  id={ticket.id}
                  comments={comments}
                  setComments={setComments}
                />
              )}
              {menu.name == "Log History" && <Log ticket={ticket} />}
              {menu.name == "Time Logged" && (
                <TimeLog
                  hours={hours}
                  setHours={setHours}
                  setTicket={setTicket}
                />
              )}
              {menu.name == "Location" && (
                <Location
                  ticket={ticket}
                  gozars={gozars}
                  setGozars={setGozars}
                />
              )}
              {menu.name == "Attachements" && (
                <Attachment
                  type={"Ticket"}
                  textSizeRatio={1.75}
                  id={ticket.id}
                  documents={documents}
                  setDocuments={setDocuments}
                />
              )}
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <p className="font-semibold">
                Ticket ID: {ticket.ticket_number}{" "}
              </p>
            </div>
            <div className="box-body !p-4 text-[#8c9097] font-normal">
              <div className="mb-6 flex flex-col gap-2">
                <p className="font-semibold">Program: </p>
                <p>
                  <Link
                    href={`/project-management/programs/${ticket?.activity?.project?.program?.id}`}
                    scroll={false}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {ticket?.activity?.project?.program?.title}
                  </Link>
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p className="font-semibold">Project: </p>
                <p>
                  <Link
                    href={`/project-management/projects/${ticket?.activity?.project?.id}`}
                    scroll={false}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {ticket?.activity?.project?.title}
                  </Link>
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p className="font-semibold">Activity: </p>
                <p>
                  <Link
                    href={`/project-management/activities/${ticket?.activity?.id}`}
                    scroll={false}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {ticket?.activity?.title}
                  </Link>
                </p>
              </div>
             
              <div className="mb-6 flex flex-col gap-2">
                <p>
                  Status |{" "}
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `rgba(${parseInt(
                        ticket?.status?.color.slice(1, 3),
                        16
                      )}, ${parseInt(
                        ticket?.status?.color.slice(3, 5),
                        16
                      )}, ${parseInt(
                        ticket?.status?.color.slice(5, 7),
                        16
                      )}, 0.1)`,
                      color: ticket?.status?.color,
                    }}
                  >
                    {ticket?.status?.title}
                  </span>
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p>
                  Type |{" "}
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `rgba(${parseInt(
                        ticket?.type?.color.slice(1, 3),
                        16
                      )}, ${parseInt(
                        ticket?.type?.color.slice(3, 5),
                        16
                      )}, ${parseInt(
                        ticket?.type?.color.slice(5, 7),
                        16
                      )}, 0.1)`,
                      color: ticket?.type?.color,
                    }}
                  >
                    {ticket?.type?.title}
                  </span>
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p>
                  Priority |{" "}
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `rgba(${parseInt(
                        ticket?.priority?.color.slice(1, 3),
                        16
                      )}, ${parseInt(
                        ticket?.priority?.color.slice(3, 5),
                        16
                      )}, ${parseInt(
                        ticket?.priority?.color.slice(5, 7),
                        16
                      )}, 0.1)`,
                      color: ticket?.priority?.color,
                    }}
                  >
                    {ticket?.priority?.title}
                  </span>
                </p>
              </div>
              <div className="mb-2 flex flex-col gap-2">
                <p className="mb-6">Total time logged</p>

                <div
                  className="progress progress-sm 
progress-custom mb-[3rem] progress-animate"
                  aria-valuenow={
                    (ticket.hours_sum_value / ticket.estimation) * 100
                  }
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <h6 className="progress-bar-title text-[1rem]">
                    {ticket.hours_sum_value} hours
                  </h6>
                  <div
                    className={`progress-bar `}
                    style={{
                      width: `${
                        (ticket.hours_sum_value / ticket.estimation) * 100
                      }%`,
                    }}
                  >
                    <div className="progress-bar-value !bg-primary">
                      {Math.round(
                        (ticket.hours_sum_value / ticket.estimation) * 100
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p className="font-semibold">Parent: </p>
                <p>
                  {ticket.parent ? <Link
                    href={`/project-management/tickets/${ticket?.parent?.id}`}
                    scroll={false}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {ticket?.parent?.title}
                  </Link> : '___'}
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p className="font-semibold">Children: </p>
                <p>
                  {ticket.children?.length > 0 ? ticket.children.map((item) => (<Link
                    href={`/project-management/tickets/${item?.id}`}
                    scroll={false}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {item?.title}
                  </Link>)) : '___'}
                </p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p>Creation date</p>
                <p>{ticket?.created_at_formatted} hours</p>
              </div>
              <div className="mb-6 flex flex-col gap-2">
                <p>Last pdate</p>
                <p>{ticket?.updated_at} hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalTimeLogOpen && (
        <AddLogTimeModal
          ticketId={ticket.id}
          setTicket={setTicket}
          setHours={setHours}
        />
      )}
    </Fragment>
  );
};

export default TicketOverview;
