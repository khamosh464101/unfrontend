import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/shared/redux/features/ticketSlice";
import {
  getActivitiesSelect2,
  getProjectsSelect2,
  getStaffSelect2,
  getTicketPriorities,
  getTicketStatuses,
  getTicketTypes,
} from "@/shared/redux/features/apiSlice";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const AddTaskModal = () => {
  const { data: session } = useSession();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    ticketStatuses: statuses,
    ticketStatusDefault: status,
    ticketTypes: types,
    ticketTypeDefault: type,
    ticketPriorities: priorities,
    activities,
    ticketPriorityDefault: priority,
    projects,
    staff,
    isLoading,
    error,
  } = useSelector((state) => state.api);
  const input = {
    title: "",
    ticket_status_id: "",
    ticket_type_id: "",
    ticket_priority_id: "",
    activity_id: "",
    description: "",
    estimation: "",
    deadline: new Date(),
    responsible_id: "",
  };

  const [formData, setFormData] = useState(input);
  const baseUrl = useSelector((state) => state.general.baseUrl);

  useEffect(() => {
    handleChange("ticket_status_id", status.value);
  }, [status]);
  useEffect(() => {
    handleChange("ticket_type_id", type.value);
  }, [type]);
  useEffect(() => {
    handleChange("ticket_priority_id", priority.value);
  }, [priority]);
  useEffect(() => {
    if (session?.access_token) {
      dispatch(getTicketStatuses(session?.access_token));
      dispatch(getProjectsSelect2(session?.access_token));
      dispatch(getTicketTypes(session?.access_token));
      dispatch(getTicketPriorities(session?.access_token));
    }
  }, [session]);
  useEffect(() => {
    console.log(project);
    if (project) {
      dispatch(
        getStaffSelect2({ token: session?.access_token, id: project.value })
      );
      dispatch(
        getActivitiesSelect2({
          token: session?.access_token,
          id: project.value,
        })
      );
    }
  }, [project]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    setLoading(true);
    const res = await fetch(`${baseUrl}/api/ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...formData,
        deadline: formData.deadline.toISOString().split("T")[0],
      }),
    });
    setLoading(false);
    const result = await res.json();
    console.log(result);
    if (res.status === 201) {
      Swal.fire({
        title: "success",
        text: result.message,
        icon: "success",
      });
      setFormData(input);
      setProject(null);
      dispatch(setModalOpen());
    }

    if (res.status === 403) {
      let path = "/authentication/verify";
      router.push(path);
    }

    if (res.status === 410) {
      let path = "/";
      router.push(path);
    }
    console.log(result);
  };

  return (
    <>
      <div
        data-hs-overlay-backdrop-template=""
        class="transition duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop"
      ></div>
      <div
        id="add-task"
        className="hs-overlay ti-modal open "
        aria-overlay="true"
        tabindex="-1"
      >
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h6
                className="modal-title text-[1rem] font-semibold text-default dark:text-defaulttextcolor/70"
                id="mail-ComposeLabel"
              >
                Add Ticket
              </h6>
              <button
                onClick={() => dispatch(setModalOpen())}
                type="button"
                className="hs-dropdown-toggle !text-[1rem] !font-semibold"
                data-hs-overlay="#add-task"
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body px-4 !overflow-visible">
              <form
                id="submitForm"
                method="POST"
                onSubmit={handleSubmit}
                className="grid grid-cols-12 gap-6"
              >
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="task-name" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Title
                  </label>
                  <input
                    type="text"
                    className="form-control w-full !rounded-md"
                    name="title"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    required
                    placeholder="Title"
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="task-id" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Estimation
                  </label>
                  <input
                    type="number"
                    name="estimation"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    required
                    placeholder="12.00"
                    className="form-control w-full !rounded-md"
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Task Description
                  </label>
                  <textarea
                    className="form-control w-full !rounded-md"
                    name="description"
                    rows={2}
                    placeholder="Write Description"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  ></textarea>
                </div>
                <div className="xl:col-span-6 col-span-12 z-60">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Status :
                  </label>
                  <Select
                    name="ticket_status_id"
                    required
                    onChange={(e) =>
                      handleChange("ticket_status_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={statuses}
                    value={
                      formData.ticket_status_id
                        ? statuses.find(
                            (row) => row.value === formData.ticket_status_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-50">
                  <label className="form-label">
                    <span className="text-red-500 mr-2">*</span> Priority :
                  </label>
                  <Select
                    name="ticket_priority_id"
                    onChange={(e) =>
                      handleChange(
                        "ticket_priority_id",
                        e.value ? e.value : null
                      )
                    }
                    isClearable={true}
                    options={priorities}
                    value={
                      formData.ticket_priority_id
                        ? priorities?.find(
                            (row) => row.value === formData.ticket_priority_id
                          )
                        : null
                    }
                    required
                    className="js-example-placeholder-multiple w-full js-states z-60"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-50">
                  <label className="form-label">
                    <span className="text-red-500 mr-2">*</span> Type :
                  </label>
                  <Select
                    name="ticket_type_id"
                    onChange={(e) =>
                      handleChange("ticket_type_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={types}
                    value={
                      formData.ticket_type_id
                        ? types?.find(
                            (row) => row.value === formData.ticket_type_id
                          )
                        : null
                    }
                    required
                    className="js-example-placeholder-multiple w-full js-states z-50"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-40">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Project :
                  </label>
                  <Select
                    name="project_id"
                    required
                    onChange={(e) => setProject(e)}
                    isClearable={true}
                    options={projects}
                    className="js-example-placeholder-multiple w-full js-states z-40"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-40">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Activity :
                  </label>
                  <Select
                    name="activity_id"
                    required
                    onChange={(e) =>
                      handleChange("activity_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    isDisabled={!project}
                    options={activities}
                    value={
                      formData.activity_id
                        ? types?.find(
                            (row) => row.value === formData.activity_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-40"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Assigned To :
                  </label>
                  <Select
                    name="responsible_id"
                    required
                    onChange={(e) =>
                      handleChange("responsible_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    isDisabled={!project}
                    options={staff}
                    value={
                      formData.responsible_id
                        ? types?.find(
                            (row) => row.value === formData.responsible_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-30"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
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
                        selected={formData.deadline}
                        onChange={(date) => handleChange("deadline", date)}
                        required
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                </div>
              </form>
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
                type="submit"
                form="submitForm"
                className="ti-btn bg-primary text-white !font-medium"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
