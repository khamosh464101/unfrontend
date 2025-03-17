"use client";
import React, { useState } from "react";
import ReactDragula from "react-dragula";
import "react-dragula/dist/dragula.css";

const MultiColumnList = () => {
  const [columns, setColumns] = useState([
    { id: "column-1", items: ["Item 1", "Item 2", "Item 3"] },
    { id: "column-2", items: ["Item 4", "Item 5"] },
    { id: "column-3", items: ["Item 6"] },
  ]);

  // Initialize dragula
  const dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      const options = {};
      ReactDragula([componentBackingInstance], options);
    }
  };

  // Handle item movement between columns
  const handleDrop = (el, target, source, sibling) => {
    const itemId = el.getAttribute("data-id");
    const sourceColumnId = source.getAttribute("data-column-id");
    const targetColumnId = target.getAttribute("data-column-id");

    const newColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          items: column.items.filter((item) => item !== itemId),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          items: [...column.items, itemId],
        };
      }
      return column;
    });

    setColumns(newColumns);
  };

  return (
    <div className="columns">
      {columns.map((column) => (
        <div
          key={column.id}
          data-column-id={column.id}
          ref={dragulaDecorator}
          className="column"
        >
          <h3>{column.id}</h3>
          <div className="items">
            {column.items.map((item, index) => (
              <div key={index} data-id={item} className="item">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultiColumnList;
