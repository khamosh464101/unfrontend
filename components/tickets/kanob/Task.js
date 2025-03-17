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
          className="box kanban-tasks new"
        >
          <div className="box-body !p-0">
            <div className="p-4 kanban-board-head">
              <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                <div className="inline-flex">
                  <i className="ri-time-line me-1 align-middle"></i>
                  Created - {item.created_at}
                </div>
                <div>
                  {item.deadline}
                  days left
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="task-badges">
                  <span className="badge bg-light text-default">
                    {item.ticket_number}
                  </span>
                  <span className="ms-1 badge bg-primary/10 text-primary">
                    UI/UX
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
                  <Link
                    href="#!"
                    scroll={false}
                    className="inline-flex items-center me-2 text-primary"
                  >
                    <span className="me-1">
                      <i className="ri-thumb-up-fill align-middle font-normal"></i>
                    </span>
                    <span className="font-semibold text-[.75rem]">12</span>
                  </Link>
                  <Link
                    href="#!"
                    scroll={false}
                    className="inline-flex items-center text-[#8c9097] dark:text-white/50"
                  >
                    <span className="me-1">
                      <i className="ri-message-2-line align-middle font-normal"></i>
                    </span>
                    <span className="font-semibold text-[.75rem]">02</span>
                  </Link>
                </div>
                <div className="avatar-list-stacked">
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src="../../assets/images/faces/11.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src="../../assets/images/faces/12.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src="../../assets/images/faces/7.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src="../../assets/images/faces/8.jpg" alt="img" />
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
