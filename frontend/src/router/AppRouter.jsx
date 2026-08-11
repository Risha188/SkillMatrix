
import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    Navigate,
} from "react-router-dom";

import EmployeeLayout from "../layouts/EmployeeLayout.jsx";

import PersonalInformation from "../pages/employee/PersonalInformation.jsx";
import Education from "../pages/employee/Education.jsx";
import Address from "../pages/employee/Address.jsx";
import Skills from "../pages/employee/Skills.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Default Route */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/employee/personal"
                        replace
                    />
                }
            />

            {/* Employee Panel */}
            <Route
                path="/employee"
                element={<EmployeeLayout />}
            >
                <Route
                    path="personal"
                    element={<PersonalInformation />}
                />

                <Route
                    path="education"
                    element={<Education />}
                />

                <Route
                    path="address"
                    element={<Address />}
                />

                <Route
                    path="skills"
                    element={<Skills />}
                />
                
                <Route
                    path="status"
                    element={<Skills />}
                />
                
                <Route
                    path="bdm"
                    element={<Skills />}
                />
            </Route>
        </>
    )
);

export default router;

