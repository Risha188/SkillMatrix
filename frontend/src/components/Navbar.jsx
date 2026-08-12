import {NavLink} from "react-router-dom";

const Navbar = () => {
  const navLinkClass = ({isActive}) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
      ? "bg-white text-blue-700"
      : "text-white hover:bg-blue-500"
    }`;

  return (
    <nav className="w-full bg-blue-700 text-white shadow-md">

      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-bold text-blue-700 shadow">
            S
          </div>

          <div>
            <h2 className="text-xl font-bold">SkillMatrix</h2>
            <span className="text-sm text-blue-100">
              Employee Profile
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-1">
          <NavLink to="/personal" className={navLinkClass}>
            Personal Information
          </NavLink>

          <NavLink to="/education" className={navLinkClass}>
            Education
          </NavLink>

          <NavLink to="/address" className={navLinkClass}>
            Address
          </NavLink>

          <NavLink to="/skills" className={navLinkClass}>
            Skills
          </NavLink>

          <NavLink to="/status" className={navLinkClass}>
            Present Status
          </NavLink>

          <NavLink to="/bdm" className={navLinkClass}>
            BDM Details
          </NavLink>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-700">
            P
          </div>

          <div>
            <p className="font-semibold">Parna Das</p>
            <span className="text-sm text-blue-100">Employee</span>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;