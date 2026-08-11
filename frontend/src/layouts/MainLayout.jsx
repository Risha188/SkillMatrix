import {Outlet} from "react-router-dom";
import Navbar from '../components/Navbar.jsx';
import Footer from "../components/Footer.jsx";
import '../index.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
