"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserProjects } from "@redux/slices/projectSlice";
import Image from "next/image";

export default function Sidebar({ isExpanded, toggleSidebar }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projects } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300
        ${isExpanded ? "w-64" : "w-16"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-3 z-50 bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center"
      >
        {isExpanded ? "<" : ">"}
      </button>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <span
            className={`font-semibold transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Projects
          </span>

          <button
            onClick={() => router.push("/projects/create")}
            className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Projects */}
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project._id}
              onClick={() => router.push(`/projects/${project._id}`)}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src="/images/projectIcon.jpg"
                width={24}
                height={24}
                alt="Project"
              />

              <span
                className={`transition-opacity duration-200 ${
                  isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {project.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
