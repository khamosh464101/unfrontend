import { differenceInDays, parse } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Task({ item, index, grid }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const baseUrl = useSelector((state) => state.general.baseUrl);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteTicket = async () => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${baseUrl}/api/ticket/${item.id}`, {
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

      Swal.fire({
        title: "Success",
        text: "Project deleted successfully.",
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
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });
  return (
    <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="box kanban-tasks todo"
        >
          <div className="box-body !p-0">
            <div className="p-4 kanban-board-head">
              <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                <div className="inline-flex">
                  <i className="ri-time-line me-1 align-middle"></i>
                  Created - {item.created_at}
                </div>
                <div>
                  <span
                    className={`text-red-400`}
                    style={{
                      color: item?.deadline?.includes("overdue")
                        ? "#F08080"
                        : "",
                    }}
                  >
                    {item.deadline}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="task-badges">
                  <span className="badge bg-light text-default">
                    {item.ticket_number}
                  </span>
                  <span
                    className="ms-1 badge"
                    style={{
                      backgroundColor: `rgba(${parseInt(
                        item.type.color.slice(1, 3),
                        16
                      )}, ${parseInt(
                        item.type.color.slice(3, 5),
                        16
                      )}, ${parseInt(item.type.color.slice(5, 7), 16)}, 0.1)`,
                      color: item.type.color,
                    }}
                  >
                    {item?.type?.title}
                  </span>
                </div>
                <div
                  className="relative inline-block text-left"
                  ref={dropdownRef}
                >
                  {/* Dropdown Button */}
                  <button
                    onClick={toggleDropdown}
                    className="ti-btn ti-btn-sm ti-btn-light !mb-0"
                  >
                    <i className="fe fe-more-vertical"></i>
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <ul
                      className="absolute right-0 w-28 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg z-10 transition-transform transform opacity-0 duration-200 ease-out"
                      style={{
                        transform: isOpen
                          ? "translateY(0)"
                          : "translateY(-10px)",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item"
                          href={`/project-management/tickets/${item.id}`}
                          scroll={false}
                        >
                          <i className="ri-eye-line align-middle me-1 inline-flex"></i>
                          View
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item"
                          href={`/project-management/tickets/edit/${item.id}`}
                          scroll={false}
                        >
                          <i className="ri-edit-line align-middle me-1 inline-flex"></i>
                          Edit
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item"
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
                          href="#!"
                          scroll={false}
                        >
                          <i className="ri-delete-bin-line me-1 align-middle inline-flex"></i>
                          Delete
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="kanban-content !mt-1">
                <h6 className="font-semibold mb-1 !text-[.9375rem]">
                  {item.title}
                </h6>
                <div className="kanban-task-description">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center">
                  <span
                    className="me-1"
                    style={{
                      backgroundColor: `rgba(${parseInt(
                        item?.priority?.color.slice(1, 3),
                        16
                      )}, ${parseInt(
                        item?.priority?.color.slice(3, 5),
                        16
                      )}, ${parseInt(
                        item?.priority?.color.slice(5, 7),
                        16
                      )}, 0.1)`,
                      color: item?.priority?.color,
                    }}
                  >
                    {item?.priority?.title}
                  </span>
                </div>
                <div className="avatar-list-stacked">
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src={item?.responsible?.photo} alt="img" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
