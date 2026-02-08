import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Column = ({ status, tasks, onDropTask, projectId }) => {
  const router = useRouter();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => onDropTask(item, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Status styles & English titles
  const statusStyles = {
    todo: {
      bgColor: "bg-gray-200",
      textColor: "text-gray-700",
      title: "To Do",
    },
    inProgress: {
      bgColor: "bg-blue-200",
      textColor: "text-blue-700",
      title: "In Progress",
    },
    verify: {
      bgColor: "bg-blue-200",
      textColor: "text-blue-700",
      title: "Review",
    },
    done: {
      bgColor: "bg-green-200",
      textColor: "text-green-700",
      title: "Done",
    },
  };

  const { bgColor, textColor, title } = statusStyles[status];

  return (
    <div
      ref={drop}
      className={`p-1 w-80 rounded-lg shadow-md flex flex-col ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
      style={{ height: "500px", overflowY: "scroll" }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-start px-2 py-3 mb-2">
        <Image
          className="mx-2"
          src="/images/columnIcon.jpg"
          width={10}
          height={20}
          alt="Column Icon"
        />
        <div className={`${bgColor} mr-4 flex items-center`}>
          <span className={`font-bold ${textColor} uppercase text-sm`}>
            {title}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      {tasks.map((task) => (
        <Task key={task._id} task={task} projectId={projectId} />
      ))}

      {/* Create Button */}
      <button
        className="text-start text-[15px] text-stone-600 mt-auto py-2 px-4 w-full text-sm font-medium rounded hover:opacity-90"
        onClick={() =>
          router.push(
            `/projects/${projectId}/tasks/create?status=${status}`
          )
        }
      >
        + Create
      </button>
    </div>
  );
};

export default Column;
