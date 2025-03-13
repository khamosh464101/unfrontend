"use client";
import React, { useRef, useEffect, useState } from "react";
import Dragula from "react-dragula";

const App = () => {
  // Dynamic columns data
  const [columns, setColumns] = useState([
    {
      id: "column-1",
      title: "To Do",
      tasks: ["Task 1", "Task 2", "Task 3"],
    },
    {
      id: "column-2",
      title: "In Progress",
      tasks: ["Task 4", "Task 5", "Task 6"],
    },
    {
      id: "column-3",
      title: "Done",
      tasks: ["Task 7", "Task 8", "Task 9"],
    },
  ]);

  // Create an array of refs for the containers
  const containerRefs = useRef(
    Array.from({ length: columns.length }, () => null)
  );

  // Initialize Dragula after the component mounts
  useEffect(() => {
    const containers = containerRefs.current.filter((ref) => ref !== null);
    if (containers.length > 0) {
      const options = {}; // Add any Dragula options here
      Dragula(containers, options);
    }
  }, [columns]);

  return (
    <div className="grid">
      <div className="row">
        {columns.map((column, index) => (
          <div key={column.id} className="col-sm-4">
            <div
              className="container"
              ref={(el) => (containerRefs.current[index] = el)}
            >
              <h3>{column.title}</h3>
              {column.tasks.map((task, taskIndex) => (
                <div key={taskIndex}>{task}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
