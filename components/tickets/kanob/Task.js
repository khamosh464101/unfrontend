import { differenceInDays, parse } from "date-fns";
import Link from "next/link";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

function Task({ item, index, grid }) {
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
                <div className="hs-dropdown ti-dropdown ltr:[--placement:bottom-right] rtl:[--placement:bottom-left]">
                  <Link
                    aria-label="anchor"
                    href="#!"
                    scroll={false}
                    className="ti-btn ti-btn-icon ti-btn-sm ti-btn-light"
                    aria-expanded="false"
                  >
                    <i className="fe fe-more-vertical"></i>
                  </Link>
                  <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex"
                        href="#!"
                        scroll={false}
                      >
                        <i className="ri-eye-line me-1 align-middle"></i>
                        View
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex"
                        href="#!"
                        scroll={false}
                      >
                        <i className="ri-delete-bin-line me-1 align-middle"></i>
                        Delete
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex"
                        href="#!"
                        scroll={false}
                      >
                        <i className="ri-edit-line me-1 align-middle"></i>
                        Edit
                      </Link>
                    </li>
                  </ul>
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
