"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Providers from "./Providers";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <html lang="en">
      <body className="overflow-hidden">
        <Providers>
          <Navbar />

          <Sidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <main
            className="pt-16 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300"
            style={{
              marginLeft: isSidebarOpen ? "16rem" : "4rem",
            }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
