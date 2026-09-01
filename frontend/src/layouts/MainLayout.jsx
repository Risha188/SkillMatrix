import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = () => {
    return (
        <div className="relative min-h-screen bg-gray-50">

            {/* Navbar */}
            <Navbar />

            {/* Main Pages */}
            <main className="ml-64 min-h-screen p-6">
                <div className="mx-auto w-full max-w-7xl">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <Footer />

        </div>
    );
};

export default MainLayout;