"use client";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "../initial-data";
import Column from "@/components/tickets/kanob/Column";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import "react-perfect-scrollbar/dist/css/styles.css";
const Select = dynamic(() => import("react-select"), { ssr: false });
import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes } from "date-fns";
//filepond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import AddTaskModal from "@/components/tickets/kanob/AddTaskModal";
import { useSelector } from "react-redux";
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function QuoteApp() {
  const [state, setState] = useState(initialData);
  const modalOpen = useSelector((state) => state.ticket.modalOpen);

  console.log(state);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    console.log("something", sInd, dInd, source.index, destination.index);

    if (sInd === dInd) {
      const items = reorder(
        state[sInd].tickets,
        source.index,
        destination.index
      );
      const newState = [...state];
      newState[sInd] = { ...state[sInd], tickets: items };
      setState(newState);
    } else {
      const result = move(
        state[sInd].tickets,
        state[dInd].tickets,
        source,
        destination
      );

      const newState = [...state];
      console.log("result", result, state[sInd], state[dInd]);
      newState[sInd] = { ...state[sInd], tickets: result[sInd] };
      newState[dInd] = { ...state[dInd], tickets: result[dInd] };
      console.log(newState);
      setState(newState);
    }
  }

  const Option1 = [
    { value: "Sort By", label: "Sort By" },
    { value: "Newest", label: "Newest" },
    { value: "Date Added", label: "Date Added" },
    { value: "Type", label: "Type" },
    { value: "A - Z", label: "A - Z" },
  ];
  const Option2 = [
    { value: "Angelina May", label: "Angelina May" },
    { value: "Kiara advain", label: "Kiara advain" },
    { value: "Hercules Jhon", label: "Hercules Jhon" },
    { value: "Mayor Kim", label: "Mayor Kim" },
  ];
  const Option3 = [
    { value: "Select Tag", label: "Select Tag" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Designing", label: "Designing" },
    { value: "Admin", label: "Admin" },
    { value: "Authentication", label: "Authentication" },
    { value: "Product", label: "Product" },
    { value: "Development", label: "Development" },
  ];
  //Specific time range

  const [startTime, setStartTime] = useState(
    setHours(setMinutes(new Date(), 30), 17)
  );

  //filepond
  const [files, setFiles] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const handleDateChange = (date) => {
    // Ensure date is defined before setting it
    if (date) {
      setStartDate(date);
    }
  };

  return (
    <div>
      <Seo title={"Kanban Board"} />
      <Pageheader
        currentpage="Kanban Board"
        activepage="Task"
        mainpage="Kanban Board"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box">
            <div className="box-body p-4">
              <div className="md:flex items-center justify-between flex-wrap gap-4">
                <div className="grid grid-cols-12 gap-2 md:w-[30%]">
                  <div className="xl:col-span-5 col-span-12">
                    <Link
                      href="#!"
                      scroll={false}
                      className="hs-dropdown-toggle !py-1 ti-btn bg-primary text-white !font-medium "
                      data-hs-overlay="#add-board"
                    >
                      <i className="ri-add-line !text-[1rem]"></i>New Board
                    </Link>
                  </div>
                  <div className="xl:col-span-7 col-span-12">
                    <Select
                      name="colors"
                      options={Option1}
                      className="w-full !rounded-md"
                      menuPlacement="auto"
                      classNamePrefix="Select2"
                    />
                  </div>
                </div>
                <div className="avatar-list-stacked my-3 md:my-0">
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/2.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/8.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/2.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/10.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/4.jpg" alt="img" />
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src="../../assets/images/faces/13.jpg" alt="img" />
                  </span>
                  <Link
                    className="avatar bg-primary avatar-rounded text-white"
                    href="#!"
                    scroll={false}
                  >
                    +8
                  </Link>
                </div>
                <div className="flex" role="search">
                  <input
                    className="form-control w-full !rounded-sm me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="ti-btn ti-btn-light !mb-0" type="submit">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
        <div style={{ display: "flex" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((el, ind) => (
              <Column el={el} ind={ind} />
            ))}
          </DragDropContext>
        </div>
      </div>
      <div id="add-board" className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h6 className="modal-title text-[1rem] !text-default dark:text-defaulttextcolor/70 font-semibold">
                Add Board
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold"
                data-hs-overlay="#add-board"
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-6">
              <div className="grid grid-cols-12 gy-2">
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="task-name" className="form-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    className="form-control w-full !rounded-md"
                    id="task-name"
                    placeholder="Task Name"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                data-hs-overlay="#add-board"
              >
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && <AddTaskModal />}
    </div>
  );
}

export default QuoteApp;
