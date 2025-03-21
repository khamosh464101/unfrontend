import { setModalTimeLogOpen, setTimeLogEdit } from "@/shared/redux/features/ticketSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function TimeLog({ hours, setHours, setTicket }) {
  const reverseHours = [...hours].reverse();
  const { data: session } = useSession();
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const dispatch = useDispatch();
  const handleEdit = (row) => {
    dispatch(setModalTimeLogOpen());
    dispatch(setTimeLogEdit(row));
  };

  const deleteRecord = async (did) => {
    try {
      const res = await fetch(`${baseUrl}/api/ticket-hours/${did}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the document.",
          icon: "error",
        });
        return;
      }

      toast.success(result.message);
      const tmp = hours.filter((item) => item.id !== did);
      setTicket((prv) => ({
        ...prv,
        hours_sum_value:
          prv.hours_sum_value - hours.find((item) => item.id === did).value,
      }));
      setHours(tmp);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };
  return (
    <div className="overflow-hidden">
  <div className="table-responsive">
    <table className="table whitespace-nowrap ti-striped-table table-hover min-w-full ti-custom-table-hover">
      <thead>
        <tr className="border-b border-defaultborder">
          <th scope="col" className="text-start">Owner</th>
          <th scope="col" className="text-start">Title</th>
          <th scope="col" className="text-start">Hours</th>
          <th scope="col" className="text-start">Comment</th>
          <td scope="col" className="text-start">Action</td>
        </tr>
      </thead>
      <tbody>
        {hours &&
          reverseHours.map((row, index) => (
            <tr className="border-b border-defaultborder" key={index}>
              <th scope="row">
                <Avatar
                  round={true}
                  name={row?.user?.name}
                  size={25}
                  color={`#8A2BE2`}
                  className="mr-2"
                />{" "}
                {row?.user?.name}
              </th>
              <td>{row.title}</td>
              <td>{row.value}</td>
              <td className="max-w-xs break-words whitespace-normal"
                style={{ wordBreak: 'break-word', width: "150px", overflowWrap: 'break-word' }}>
                {row.comment}
              </td>
              <td className="flex gap-2">
                {session?.user.id === row.user_id && (
                  <div className="inline-flex">
                    <button
                      onClick={() => handleEdit(row)}
                      className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                    >
                      <i className="ri-edit-line"></i>
                    </button>

                    <button
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
                            deleteRecord(row.id);
                          }
                        })
                      }
                      aria-label="button"
                      type="button"
                      className="ti-btn ti-btn-sm ti-btn-danger"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default TimeLog;
