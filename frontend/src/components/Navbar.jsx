import "../index.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        <div className="logo-icon">S</div>

        <div>
          <h2>SkillMatrix</h2>
          <span>Employee Profile</span>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="navbar-menu">
        <NavLink to='/personal'>Personal Information</NavLink>
        <NavLink to="/education">Education</NavLink>
        <NavLink to="/address">Address</NavLink>
        <NavLink to="/skills">Skills</NavLink>
        <NavLink to="/status">Present Status</NavLink>
        <NavLink to="/bdm">BDM Details</NavLink>
      </div>

      {/* Profile */}
      <div className="navbar-profile">
        <div className="profile-avatar">P</div>

        <div>
          <p>Parna Das</p>
          <span>Employee</span>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;

