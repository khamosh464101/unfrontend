"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
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
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import {
  getActivitiesSelect2,
  getProjectsSelect2,
} from "@/shared/redux/features/apiSlice";
import ClearIndicator from "@/lib/select2";
import { setActivity, setProject } from "@/shared/redux/features/ticketSlice";
import toast, { Toaster } from "react-hot-toast";
import EditTaskModal from "@/components/tickets/kanob/EditTaskModal";
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
  console.log("dddddddssssssss", source, destination);
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function page() {
  const { data: session } = useSession();
  const [state, setState] = useState([]);
  const {modalOpen, ticketEdit} = useSelector((state) => state.ticket);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const deleteItem = useSelector((state) => state.delete.item);
  const [url, setUrl] = useState(`${baseUrl}/api/tickets`);
  const { projects, activities, isLoading, error } = useSelector(
    (state) => state.api
  );
  const { project, activity } = useSelector((state) => state.ticket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (session?.access_token) {
      dispatch(getProjectsSelect2(session.access_token));
    }
  }, [url, session]);
  useEffect(() => {
    if (session?.access_token && project) {
      dispatch(
        getActivitiesSelect2({
          token: session?.access_token,
          id: project.value,
        })
      );
    }
  }, [project]);

  useEffect(() => {
    if(!deleteItem && session?.access_token && activity && !modalOpen && !ticketEdit) {
      getTickets();
    }
  }, [deleteItem, modalOpen, ticketEdit])

  const getTickets = async (e = null) => {
   if (e) {
    e.preventDefault();
   }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          activity_id: activity.value,
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
        setState(result);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "warning",
      });
    }
  };
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
      updateOrder(items);
    } else {
      const result = move(
        state[sInd].tickets,
        state[dInd].tickets,
        source,
        destination
      );

      const newState = [...state];
      console.log("result", result, state[sInd], state[dInd]);

      newState[sInd] = {
        ...state[sInd],
        tickets: result[sInd].map((item) => ({
          ...item,
          ticket_status_id: newState[sInd].id,
        })),
      };
      newState[dInd] = {
        ...state[dInd],
        tickets: result[dInd].map((item) => ({
          ...item,
          ticket_status_id: newState[dInd].id,
        })),
      };
      setState(newState);
      updateMove(newState[sInd].tickets, newState[dInd].tickets);
    }
  }

  const updateOrder = async (items) => {
    try {
      const res = await fetch(`${baseUrl}/api/tickets/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: items,
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
        toast.success(result.message);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "warning",
      });
    }
  };

  const updateMove = async (sItems, dItems) => {
    try {
      const res = await fetch(`${baseUrl}/api/tickets/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          sItems: sItems,
          dItems: dItems,
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
        toast.success(result.message);
      }
    } catch (error) {
      Swal.fire({
        title: "warning",
        text: error.message || "An unexpected error occurred.",
        icon: "warning",
      });
    }
  };
  return (
    <div>
      <Toaster position="bottom-right" />
      <Seo title={"Kanab board"} />
      <Pageheader
        currentpage="Kanab board"
        activepage="Tickets"
        mainpage="Kanab board"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body p-4">
              <form
                action="POST"
                onSubmit={getTickets}
                className="flex items-center justify-between flex-wrap gap-4"
              >
                <div className="flex flex-wrap gap-1 newproject">
                  <Select
                    name="status"
                    options={projects}
                    isClearable
                    components={{ ClearIndicator }}
                    onChange={(e) => dispatch(setProject(e))}
                    required
                    className="!w-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Project"
                  />
                </div>
                <div className="flex flex-wrap gap-1 newproject">
                  <Select
                    name="status"
                    options={activities}
                    isClearable
                    components={{ ClearIndicator }}
                    onChange={(e) => dispatch(setActivity(e))}
                    required
                    isDisabled={!project}
                    className="!w-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Activity"
                  />
                </div>

                <div className="flex" role="search">
                  <button
                    isDisabled={!activity}
                    className="ti-btn ti-btn-light !mb-0"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </form>
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
      {ticketEdit && <EditTaskModal />}
    </div>
  );
}

export default page;
