import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import PerfectScrollbar from "react-perfect-scrollbar";
import Link from "next/link";
import AddTaskModal from "./AddTaskModal";
import { useDispatch } from "react-redux";
import { setDefaultStatus, setModalOpen } from "@/shared/redux/features/ticketSlice";

const grid = 8;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

function Column({ el, ind }) {
  const dispatch = useDispatch();

  return (
    <Droppable key={ind} droppableId={`${ind}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="kanban-tasks-type new "
        >
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="block font-semibold text-[.9375rem]">
                {el.title}
              </span>
              <div>
                <button
                  onClick={() => {dispatch(setModalOpen()); dispatch(setDefaultStatus({value:el.id, label: el.title}))}}
                  scroll={false}
                  className="hs-dropdown-toggle  ti-btn !py-1 !px-2 !font-medium !text-[0.75rem] bg-white dark:bg-bodybg text-default border-0"
                >
                  <i className="ri-add-line"></i>Add Ticket
                </button>
              </div>
            </div>
          </div>
          <div
            className={`kanban-tasks ${
              el.tickets.length <= 0 ? "task-Null" : ""
            }`}
            id="todo-tasks"
          >
            <PerfectScrollbar style={{ height: "560px" }}>
              <div className="firstdrag" data-view-btn="todo-tasks">
                {el?.tickets?.map((item, index) => (
                  <Task item={item} index={index} grid={grid} />
                ))}
                {provided.placeholder}
              </div>
            </PerfectScrollbar>
          </div>
          <div>
            <div className="grid mt-4">
              <button type="button" className="ti-btn ti-btn-primary">
                View More
              </button>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Column;
