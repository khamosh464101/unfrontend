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

  const deleteDonor = async () => {
    try {
      dispatch(setDelete());
      const response = await fetch(`${apiUrl}/api/donor/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // optional, depending on your authentication
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text: result.message || "An error occurred while deleting the donor.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Donor deleted successfully.",
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
    <div className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12">
      <div className="box custom-box">
        <div className="box-header items-center !justify-start flex-wrap !flex">
          <div className="me-2">
            <span className="avatar avatar-rounded p-1 bg-danger/10 text-danger">
              <i
                className="ri-hand-coin-line align-middle me-1 inline-flex"
                style={{ fontSize: "30px" }}
              ></i>
            </span>
          </div>
          <div className="flex-grow">
            <Link
              href="#!"
              scroll={false}
              className="font-semibold text-[.875rem] block text-truncate project-list-title"
            >
              {row.name}
            </Link>
            <span className="text-[#8c9097] dark:text-white/50 block text-[0.75rem]">
              Total{" "}
              <strong className="text-defaulttextcolor">
                {row.projects_count}
              </strong>{" "}
              projects exist
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
                    href={`/project-management/donors/edit/${row.id}`}
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
                          deleteDonor();
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
          <div className="font-semibold mb-1">Description :</div>
          <p className="text-[#8c9097] dark:text-white/50 mb-3">
            {row.description.replace(/<[^>]*>/g, "").substring(0, 140)}
          </p>
        </div>
        <div className="box-footer flex items-center justify-between">
          <div>
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Created At :
            </span>
            <span className="font-semibold block">{row.created_at}</span>
          </div>
          <div className="text-end">
            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">
              Updated At :
            </span>
            <span className="font-semibold block">{row.updated_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Single;
