"use client";
import React, { useRef, useEffect, useState } from "react";
import Dragula from "react-dragula";

const App = () => {
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

  const containerRefs = useRef(
    Array.from({ length: columns.length }, () => null)
  );

  useEffect(() => {
    const containers = containerRefs.current.filter((ref) => ref !== null);
    if (containers.length > 0) {
      const dragula = require("dragula");
      const options = {}; // Add any Dragula options here
      const drake = dragula(containers);

      drake.on("drop", (el, target, source, sibling) => {
        const taskId = el.dataset.id;
        const sourceColumnId = source.dataset.columnId;
        const targetColumnId = target.dataset.columnId;

        // Find the source and target columns based on their unique ids
        const sourceColumn = columns.find(
          (column) => column.id === sourceColumnId
        );
        const targetColumn = columns.find(
          (column) => column.id === targetColumnId
        );

        if (!sourceColumn || !targetColumn) {
          console.error("Source or Target Column not found");
          return;
        }

        const taskIndex = sourceColumn.tasks.findIndex(
          (task) => task === taskId
        );

        if (taskIndex === -1) {
          console.error("Task not found in source column");
          return;
        }

        // Don't update state if task is already in the target column
        if (targetColumn.tasks.includes(taskId)) {
          console.log("Task is already in the target column. No update needed.");
          return;
        }

        const taskToMove = sourceColumn.tasks[taskIndex];

        // Create a new updated columns array without mutating the original state
        const updatedColumns = columns.map((column) => {
          if (column.id === sourceColumnId) {
            // Remove task from source column
            const updatedTasks = column.tasks.filter((task) => task !== taskId);
            return { ...column, tasks: updatedTasks };
          }

          if (column.id === targetColumnId) {
            return { ...column, tasks: [...column.tasks, taskToMove] };
          }

          return column;
        });

        // Update the state only once per drop
        console.log(updatedColumns);
        setColumns(updatedColumns);
      });

      // return () => {
      //   drake.destroy(); // Cleanup Dragula instance on unmount
      // };
    }
  }, []); // Empty dependency array ensures this runs once

  return (
    <div className="grid">
      <div className="row flex justify-between gap-3 bg-blue-400">
        {columns.map((column, index) => (
          <div key={column.id} className="col-sm-4" id={column.id}>
            <div
              className="container"
              ref={(el) => (containerRefs.current[index] = el)}
              data-column-id={column.id}
            >
              <h3>{column.title}</h3>
              {column.tasks.map((task) => (
                <div key={task} data-id={task}>
                  {task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
