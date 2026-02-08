import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Column from "./Column";
import { updateTaskStatus } from "@redux/slices/taskSlice";

const KanbanBoard = ({ projectId, tasks }) => {
  const dispatch = useDispatch();

  const [columns, setColumns] = useState({
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "inProgress"),
    verify: tasks.filter((task) => task.status === "verify"),
    done: tasks.filter((task) => task.status === "done"),
  });

  const handleDropTask = (item, newStatus) => {
    const { id } = item;

    dispatch(updateTaskStatus({ projectId, taskId: id, status: newStatus }))
      .unwrap()
      .then(() => {
        setColumns((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((status) => {
            updated[status] = updated[status].filter(
              (task) => task._id !== id
            );
          });
          updated[newStatus].push(
            tasks.find((task) => task._id === id)
          );
          return updated;
        });
      })
      .catch((error) =>
        console.error("Failed to update task status:", error)
      );
  };

  return (
    <div className="flex gap-4">
      {Object.keys(columns).map((status) => (
        <Column
          key={status}
          status={status}
          tasks={columns[status]}
          onDropTask={handleDropTask}
          projectId={projectId}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
