"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ✅ Correct imports (keep single-line imports)
import { fetchTaskDetails, updateTask } from "@redux/slices/taskSlice";
import { fetchSubtasks, createSubtask } from "@redux/slices/subtaskSlice";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TaskDetailsContent({ projectId, taskId }) {
  const dispatch = useDispatch();

  const { selectedTask, isLoading } = useSelector((state) => state.task);
  const { subtasks } = useSelector((state) => state.subtask);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  const [newSubtask, setNewSubtask] = useState({
    title: "",
    description: "",
  });

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!projectId || !taskId) return;

    dispatch(fetchTaskDetails({ projectId, taskId }));
    dispatch(fetchSubtasks(taskId));
  }, [dispatch, projectId, taskId]);

  /* =========================
     FILL FORM
  ========================= */
  useEffect(() => {
    if (selectedTask) {
      setTaskForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        status: selectedTask.status || "todo",
      });
    }
  }, [selectedTask]);

  /* =========================
     SAVE TASK ✅ FIXED
  ========================= */
  const handleSaveTask = (e) => {
    e.stopPropagation(); // 🔥 CRITICAL FIX

    if (!taskForm.status) {
      alert("Status is required");
      return;
    }

    dispatch(
      updateTask({
        projectId,
        taskId,
        updates: taskForm,
      })
    );
  };

  /* =========================
     ADD SUBTASK
  ========================= */
  const handleAddSubtask = (e) => {
    e.stopPropagation(); // 🔥 prevent modal close

    if (!newSubtask.title.trim()) {
      alert("Subtask title is required");
      return;
    }

    dispatch(
      createSubtask({
        taskId,
        title: newSubtask.title,
        description: newSubtask.description,
        status: "todo",
      })
    );

    setNewSubtask({ title: "", description: "" });
  };

  return (
    // 🔥 This stops modal overlay clicks
    <div
      className="space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold">{taskForm.title}</h2>

      <ReactQuill
        value={taskForm.description}
        onChange={(v) =>
          setTaskForm((p) => ({ ...p, description: v }))
        }
      />

      {/* ✅ FIXED BUTTON */}
      <button
        type="button"
        onClick={handleSaveTask}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Task"}
      </button>

      <h3 className="text-lg font-semibold">Subtasks</h3>

      {subtasks.map((st) => (
        <div key={st._id} className="p-2 border rounded">
          {st.title}
        </div>
      ))}

      <input
        value={newSubtask.title}
        onChange={(e) =>
          setNewSubtask((p) => ({ ...p, title: e.target.value }))
        }
        placeholder="Subtask title"
        className="border p-2 w-full"
      />

      <button
        type="button"
        onClick={handleAddSubtask}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Subtask
      </button>
    </div>
  );
}
