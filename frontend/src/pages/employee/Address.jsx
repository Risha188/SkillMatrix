import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {markSectionCompleted} from "../../utils/profileProgress.js";

const Address = () => {
  const navigate = useNavigate();
  const [address,setAddress] = useState({
    currentAddress: "",
    currentCity: "",
    currentState: "",
    currentPincode: "",
    currentCountry: "India",

    sameAsCurrent: false,

    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentPincode: "",
    permanentCountry: "India",
  });

  const handleChange = (e) => {
    const {name,value,type,checked} = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Address Information:",address);
    markSectionCompleted("address");
    navigate("/employee/skills");
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Address Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your current and permanent address details.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Current Address */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-gray-800">
              Current Address
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="currentAddress"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <textarea
                  id="currentAddress"
                  name="currentAddress"
                  placeholder="Enter your current address"
                  value={address.currentAddress}
                  onChange={handleChange}
                  rows="3"
                  required
                  className={inputClass}
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="currentCity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  id="currentCity"
                  type="text"
                  name="currentCity"
                  placeholder="Enter city"
                  value={address.currentCity}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="currentState"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  State
                </label>

                <input
                  id="currentState"
                  type="text"
                  name="currentState"
                  placeholder="Enter state"
                  value={address.currentState}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="currentPincode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>

                <input
                  id="currentPincode"
                  type="text"
                  name="currentPincode"
                  placeholder="Enter pincode"
                  value={address.currentPincode}
                  onChange={handleChange}
                  maxLength="6"
                  required
                  className={inputClass}
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="currentCountry"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Country
                </label>

                <input
                  id="currentCountry"
                  type="text"
                  name="currentCountry"
                  value={address.currentCountry}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="sameAsCurrent"
                checked={address.sameAsCurrent}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span>
                Permanent address is same as current address
              </span>
            </label>
          </div>

          {/* Permanent Address */}
          {!address.sameAsCurrent && (
            <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-gray-800">
                Permanent Address
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="permanentAddress"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>

                  <textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    placeholder="Enter your permanent address"
                    value={address.permanentAddress}
                    onChange={handleChange}
                    rows="3"
                    required
                    className={inputClass}
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="permanentCity"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    id="permanentCity"
                    type="text"
                    name="permanentCity"
                    placeholder="Enter city"
                    value={address.permanentCity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="permanentState"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>

                  <input
                    id="permanentState"
                    type="text"
                    name="permanentState"
                    placeholder="Enter state"
                    value={address.permanentState}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label
                    htmlFor="permanentPincode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Pincode
                  </label>

                  <input
                    id="permanentPincode"
                    type="text"
                    name="permanentPincode"
                    placeholder="Enter pincode"
                    value={address.permanentPincode}
                    onChange={handleChange}
                    maxLength="6"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="permanentCountry"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>

                  <input
                    id="permanentCountry"
                    type="text"
                    name="permanentCountry"
                    value={address.permanentCountry}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save & Next
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Address;