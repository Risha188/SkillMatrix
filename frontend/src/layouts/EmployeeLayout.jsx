import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import "../index.css";

const EmployeeLayout = () => {
    return (
        <div className="employee-layout">

            <Sidebar />

            <div className="employee-content">

                <main className="employee-main-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default EmployeeLayout;
