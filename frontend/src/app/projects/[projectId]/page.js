"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchProjectDetails,
  fetchProjectMembers,
  removeProjectMember,
} from "@redux/slices/projectSlice";
import { fetchTasks } from "@redux/slices/taskSlice";
import KanbanBoard from "@components/KanbanBoard";
import Link from "next/link";
import Image from "next/image";

export default function ProjectDetailsPage({ params }) {
  const { projectId } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const { projectDetails, isLoading, error, members } = useSelector(
    (state) => state.project
  );
  const { tasks } = useSelector((state) => state.task);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectDetails(projectId));
    dispatch(fetchProjectMembers(projectId));
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  if (isLoading) return <p>Loading project details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!projectDetails) return <p>Project not found.</p>;

  const handleRemoveMember = (userId) => {
    dispatch(removeProjectMember({ projectId, userId }))
      .unwrap()
      .then(() => {
        dispatch(fetchProjectMembers(projectId));
      })
      .catch((error) => {
        console.error("Failed to remove member:", error.message);
      });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <header
        style={{
          padding: "20px",
          backgroundColor: "#e7f8ff",
          color: "#000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #999",
        }}
      >
        <div className="flex items-center">
          <Image
            src="/images/projectIcon.jpg"
            width={30}
            height={15}
            alt="Project Icon"
          />
          <h1 className="text-slate-700 font-semibold text-2xl ml-3">
            {projectDetails?.name}
          </h1>
        </div>

        {/* Project Settings Button (TEXT, NOT IMAGE) */}
        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Project Settings
        </button>
      </header>

      {/* Project Settings Panel */}
      {showSettings && (
        <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-4">Project Settings</h2>

          <div>
            <h3 className="text-md font-medium mb-2">Members</h3>
            <ul className="list-disc list-inside space-y-2">
              {members
                .filter(
                  (member) => member._id !== projectDetails?.leaderId?._id
                )
                .map((member) => (
                  <li
                    key={member._id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {member.name} ({member.email})
                    </span>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <Link href={`/projects/${projectId}/edit`}>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Edit Project
            </button>
          </Link>

          <Link href={`/projects/${projectId}/invitations`}>
            <button className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Send Invitation
            </button>
          </Link>
        </div>
      )}

      {/* Kanban Board */}
      <h2 className="text-xl font-semibold mt-4">Tasks:</h2>
      <KanbanBoard projectId={projectId} tasks={tasks} />
    </div>
  );
}
