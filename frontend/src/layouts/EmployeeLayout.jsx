import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Employee/Sidebar.jsx";
import { EmployeeProfileProvider } from "../context/EmployeeProfileContext.jsx";

const EmployeeLayout = () => {
    return (
        <EmployeeProfileProvider>
            <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

                {/* ==========================================
                    SIDEBAR
                ========================================== */}
                <Sidebar />

                {/* ==========================================
                    MAIN CONTENT
                    Mobile  : full width
                    Desktop : starts after 256px sidebar
                ========================================== */}
                <main
                    className="
                        min-h-screen
                        w-full

                        px-4
                        pb-8
                        pt-20

                        sm:px-6

                        md:ml-64
                        md:w-[calc(100%_-_16rem)]
                        md:px-8
                        md:pb-10
                        md:pt-8

                        lg:px-10
                    "
                >
                    {/* ==========================================
                        CONTENT CONTAINER
                    ========================================== */}
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-7xl
                        "
                    >
                        <Outlet />
                    </div>
                </main>

            </div>
        </EmployeeProfileProvider>
    );
};

export default EmployeeLayout;