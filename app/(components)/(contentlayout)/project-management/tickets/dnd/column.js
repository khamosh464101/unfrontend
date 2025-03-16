import React from "react";
import Task from "./task";
import { Droppable } from "react-beautiful-dnd";

function Column({ column, tasks }) {
  console.log("this is tasks", tasks);
  return (
    <div className="bg-blue-600 text-white w-60 p-3 ">
      <h1>{column.title}</h1>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="flex flex-col gap-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
