import stringToDate from "@/lib/stringToData";
import React from "react";

function Log({ project }) {
  return (
    <>
      <ul className="list-unstyled profile-timeline">
        {project?.logs?.map((row, index) => (
          <li key={index}>
            <div>
              <span className="avatar avatar-sm  profile-timeline-avatar">
                <img
                  src="../../../assets/images/faces/11.jpg"
                  alt=""
                  className="!rounded-full"
                />
              </span>
              <p className="text-[#8c9097] dark:text-white/50 mb-2">
                <span className="text-default">{row.description}</span>.
                <span className="float-end text-[0.6875rem] text-[#8c9097] dark:text-white/50">
                  {stringToDate(row.created_at)}
                </span>
              </p>
              {/* <p className="text-[#8c9097] dark:text-white/50 mb-0">

      </p> */}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Log;
