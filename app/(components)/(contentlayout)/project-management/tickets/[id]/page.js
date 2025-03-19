"use client";

import Attachment from "@/components/projects/Attachment";
import Comment from "@/components/tickets/Comment";
import Location from "@/components/tickets/Location";
import Log from "@/components/tickets/Log";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { Toaster } from "react-hot-toast";
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
  const baseUrl = useSelector((state) => state.general.baseUrl);
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
                    Assigned Date
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {ticket.start_date}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Due Date
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {ticket.end_date}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Status
                  </span>
                  <span className="block">
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
            <div className="box-body !p-4">
              <div className="my-4">
                <p>Responsible</p>
                <p>
                  <Avatar
                    className="mr-2"
                    name="Foo Bar"
                    round={true}
                    color={`#6495ED`}
                    size="25"
                  />
                  {ticket?.responsible?.name}
                </p>
              </div>
              <div className="my-4">
                <p>Activity</p>
                <p>{ticket?.activity?.title}</p>
              </div>
              <div className="my-4">
                <p>Estimation</p>
                <p>{ticket?.estimation} hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TicketOverview;
