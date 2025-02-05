"use client";

import UserSideBar from "./sidebar";
import UserHeader from "./header";
import { useState } from "react";


function UserLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* user sidebar */}
      <UserSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* user header */}
        <UserHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;