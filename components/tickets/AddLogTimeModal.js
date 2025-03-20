import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setModalTimeLogOpen } from "@/shared/redux/features/ticketSlice";

import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AddLogTimeModal = ({ id, setTicket, setHours }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const input = {
    value: null,
    title: "",
    comment: "",
    ticket_id: id,
  };

  const [formData, setFormData] = useState(input);
  const baseUrl = useSelector((state) => state.general.baseUrl);

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
    const res = await fetch(`${baseUrl}/api/ticket-hours`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });
    setLoading(false);
    const result = await res.json();
    console.log(result);
    if (res.status === 201) {
      toast.success(result.message);
      const tmp = result.data;
      console.log("tmp", tmp);
      setHours((prv) => [...prv, tmp]);
      setTicket((prv) => ({
        ...prv,
        hours_sum_value: prv.hours_sum_value + parseInt(tmp.value),
      }));
      setFormData(input);

      dispatch(setModalTimeLogOpen());
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
                onClick={() => dispatch(setModalTimeLogOpen())}
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
                <p className="col-span-12 text-center">
                  Use the following form to add your worked time in this ticket.
                </p>
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
                    <span className="text-red-500 mr-2">*</span> Time to log
                  </label>
                  <input
                    type="number"
                    name="value"
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
                    Comment
                  </label>
                  <textarea
                    className="form-control w-full !rounded-md"
                    name="comment"
                    rows={2}
                    placeholder="Write Comment"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="ti-modal-footer">
              <button
                onClick={() => dispatch(setModalTimeLogOpen())}
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

export default AddLogTimeModal;
