"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
const Select = dynamic(() => import("react-select"), { ssr: false });
import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes } from "date-fns";
//filepond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Dragula from "react-dragula";
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Kanbanboard = () => {
  const [columns, setColumns] = useState([
    {
      id: "column-1",
      title: "To Do",
      tasks: ["Task 1", "Task 2", "Task 3"],
      id: "new-tasks",
    },
    {
      id: "column-2",
      title: "In Progress",
      tasks: ["Task 4", "Task 5", "Task 6"],
      id: "todo-tasks"
    },
    {
      id: "column-3",
      title: "Done",
      tasks: ["Task 7", "Task 8", "Task 9"],
      id: "inprogress-tasks"
    },
  ]);
  
  const containerRefs = useRef(
    Array.from({ length: columns.length }, () => null)
  );
  
 
  useEffect(() => {
    const containers = containerRefs.current.filter((ref) => ref !== null);
    if (containers.length > 0) {
      const options = {}; // Add any Dragula options here
      const drake = Dragula(containers, options);
  
      drake.on("drop", (el, target, source, sibling) => {
        console.log('working');
        const taskId = el.dataset.id;
        const sourceColumnIndex = source.dataset.columnId;
        const targetColumnIndex = target.dataset.columnId;
      
        const sourceColumn = columns[sourceColumnIndex];
        const targetColumn = columns[targetColumnIndex];
        const taskIndex = sourceColumn.tasks.findIndex(task => task === taskId);
        console.log('this is task index', taskIndex);
        if (taskIndex === -1) return;
      
        const taskToMove = sourceColumn.tasks[taskIndex];
      
        // Make sure to create new arrays and objects, avoiding mutation
        const updatedColumns = columns.map((column, index) => {
          if (index == sourceColumnIndex) {
            // Remove task from source column
            const updatedTasks = column.tasks.filter(task => task !== taskId);
            console.log("updatedTasks",updatedTasks);
            return { ...column, tasks: updatedTasks };
          }
      
          if (index == targetColumnIndex) {
            // Add task to target column
            return { ...column, tasks: [...column.tasks, taskToMove] };
          }
          console.log("column",column);
          return column;
        });
      
        console.log(updatedColumns);
        setColumns(updatedColumns);
      });
      
      return () => {
        drake.destroy(); // Cleanup Dragula instance on unmount
      };
      

    }
  }, []); 

  // const OnDivChange = () => {
  //   elementsToModify.forEach((elementId) => {
  //     const element = elementId.current;
  //     if (element?.children.length <= 0) {
  //       element?.classList.add("task-Null");
  //       element?.parentNode.parentElement.parentElement
  //         .querySelector(".view-more-button")
  //         ?.classList.add("d-none");
  //     } else {
  //       element?.classList.remove("task-Null");
  //       element?.parentNode.parentElement.parentElement
  //         .querySelector(".view-more-button")
  //         ?.classList.remove("d-none");
  //     }
  //   });
  // };

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
        {columns.map((column, index) => (
          <div className="kanban-tasks-type new">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="block font-semibold text-[.9375rem]">
                NEW - 04
              </span>
              <div>
                <Link
                  href="#!"
                  scroll={false}
                  className="hs-dropdown-toggle  ti-btn !py-1 !px-2 !font-medium !text-[0.75rem] bg-white dark:bg-bodybg text-default border-0"
                  data-hs-overlay="#add-task"
                >
                  <i className="ri-add-line"></i>Add Task
                </Link>
              </div>
            </div>
          </div>
          <div className="kanban-tasks " id="new-tasks">
            <PerfectScrollbar style={{ height: "560px" }}>
              <div
                ref={(el) => (containerRefs.current[index] = el)}
           
                className="firstdrag"
                data-column-id={index}
                data-view-btn="new-tasks"
              >
                {column.tasks && column.tasks.map((task, taskIndex) => (
                  <div className="box kanban-tasks new" data-id={task}>
                  <div className="box-body !p-0">
                    <div className="p-4 kanban-board-head">
                      <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                        <div className="inline-flex">
                          <i className="ri-time-line me-1 align-middle"></i>
                          Created - 28 May
                        </div>
                        <div>2 days left</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="task-badges">
                          <span className="badge bg-light text-default">
                            #SPK - 11
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
                          New Dashboard design.
                        </h6>
                        <div className="kanban-task-description">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit, Nulla soluta consectetur sit amet elit dolor sit
                          amet.
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
                            <span className="font-semibold text-[.75rem]">
                              12
                            </span>
                          </Link>
                          <Link
                            href="#!"
                            scroll={false}
                            className="inline-flex items-center text-[#8c9097] dark:text-white/50"
                          >
                            <span className="me-1">
                              <i className="ri-message-2-line align-middle font-normal"></i>
                            </span>
                            <span className="font-semibold text-[.75rem]">
                              02
                            </span>
                          </Link>
                        </div>
                        <div className="avatar-list-stacked">
                          <span className="avatar avatar-sm avatar-rounded">
                            <img
                              src="../../assets/images/faces/11.jpg"
                              alt="img"
                            />
                          </span>
                          <span className="avatar avatar-sm avatar-rounded">
                            <img
                              src="../../assets/images/faces/12.jpg"
                              alt="img"
                            />
                          </span>
                          <span className="avatar avatar-sm avatar-rounded">
                            <img
                              src="../../assets/images/faces/7.jpg"
                              alt="img"
                            />
                          </span>
                          <span className="avatar avatar-sm avatar-rounded">
                            <img
                              src="../../assets/images/faces/8.jpg"
                              alt="img"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
            
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
        ))}

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
      <div id="add-task" className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-default dark:text-defaulttextcolor/70"
                id="mail-ComposeLabel"
              >
                Add Task
              </h6>
              <button
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold"
                data-hs-overlay="#add-task"
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4 !overflow-visible">
              <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="task-name" className="form-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    className="form-control w-full !rounded-md"
                    id="task-name2"
                    placeholder="Task Name"
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="task-id" className="form-label">
                    Task ID
                  </label>
                  <input
                    type="text"
                    className="form-control w-full !rounded-md"
                    id="task-id"
                    placeholder="Task ID"
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Task Description
                  </label>
                  <textarea
                    className="form-control w-full !rounded-md"
                    id="text-area"
                    rows={2}
                    placeholder="Write Description"
                  ></textarea>
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Task Images
                  </label>
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    maxFiles={3}
                    server="/api"
                    name="files" /* sets the file input name, it's filepond by default */
                    labelIdle="Drag & Drop your file here or click "
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label className="form-label">Assigned To</label>
                  <Select
                    isMulti
                    name="colors"
                    options={Option2}
                    className=""
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Target Date</label>
                  <div className="form-group">
                    <div className="input-group !flex-nowrap">
                      <div className="input-group-text text-muted !rounded-e-none">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        showTimeSelect
                        minTime={setHours(setMinutes(new Date(), 0), 17)}
                        maxTime={setHours(setMinutes(new Date(), 30), 20)}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Tags</label>
                  <Select
                    isMulti
                    name="colors"
                    options={Option3}
                    className="w-full !rounded-md"
                    menuPlacement="top"
                    classNamePrefix="Select2"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                data-hs-overlay="#add-task"
              >
                Cancel
              </button>
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanbanboard;
