import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setDelete } from "@/shared/redux/features/deleteSlice";

function Single({ row, apiUrl }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Function to toggle dropdown visibility
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

  const deleteActivity = async () => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${apiUrl}/api/activity/${row.id}`, {
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
  return (
    <div className=" xl:col-span-4 md:col-span-6 col-span-12">
      <div className="box custom-box">
        <div className="box-header items-center !justify-start flex-wrap !flex">
          <div className="flex-grow">
            <Link
              href="#!"
              scroll={false}
              className="font-semibold text-[.875rem] block text-truncate project-list-title"
            >
              {row.title}
            </Link>
            <span className="badge bg-primary/10 text-primary mr-2 ">
              {row.activity_number}
            </span>
            <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
              Total{" "}
              <strong className="text-defaulttextcolor">
                {row.tickets_count}
              </strong>{" "}
              tickets exist
            </span>
          </div>
          <div className="relative inline-block text-left" ref={dropdownRef}>
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
                  transform: isOpen ? "translateY(0)" : "translateY(-10px)",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <li>
                  <Link
                    className="ti-dropdown-item"
                    href={`/project-management/activities/${row.id}`}
                    scroll={false}
                  >
                    <i className="ri-eye-line align-middle me-1 inline-flex"></i>
                    View
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item"
                    href={`/project-management/activities/edit/${row.id}`}
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
                          deleteActivity();
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
        <div className="box-body">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold mb-1">Assigned to :</div>
              <div className="avatar-list-stacked">
                <Link href={`/project-management/staff/${row.responsible.id}`}>
                  <span className="avatar avatar-sm avatar-rounded">
                    <img src={row.responsible.photo} alt="img" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="text-end">
              <div className="font-semibold mb-1">Type :</div>
              <span
                className="badge"
                style={{
                  backgroundColor: `rgba(${parseInt(
                    row.status.color.slice(1, 3),
                    16
                  )}, ${parseInt(row.status.color.slice(3, 5), 16)}, ${parseInt(
                    row.status.color.slice(5, 7),
                    16
                  )}, 0.1)`,
                  color: row.type.color,
                }}
              >
                {row.type.title}
              </span>
            </div>
          </div>
          <div className="font-semibold mb-1">Description :</div>
          <p className="text-[#8c9097] dark:text-white/50 mb-3">
            {row.description.replace(/<[^>]*>/g, "").substring(0, 140)}
          </p>
          <div className="font-semibold mb-1">
            Status :{" "}
            <span
              className="badge"
              style={{
                backgroundColor: `rgba(${parseInt(
                  row.status.color.slice(1, 3),
                  16
                )}, ${parseInt(row.status.color.slice(3, 5), 16)}, ${parseInt(
                  row.status.color.slice(5, 7),
                  16
                )}, 0.1)`,
                color: row.status.color,
              }}
            >
              {row.status.title}
            </span>
          </div>
        </div>
        <div className="box-footer flex items-center justify-between">
          <div>
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Starts At :
            </span>
            <span className="font-semibold block">{row.starts_at}</span>
          </div>
          <div className="text-end">
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Ends At :
            </span>
            <span className="font-semibold block">{row.ends_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Single;
