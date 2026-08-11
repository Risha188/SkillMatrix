import React,{useState} from "react";

const Address = () => {
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
  };

  return (
    <div className="form-page">

      {/* Header */}
      <div className="form-header">
        <h2>Address Information</h2>

        <p>
          Enter your current and permanent address details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Current Address */}
        <div className="address-section">

          <h3>Current Address</h3>

          <div className="form-grid">

            {/* Address */}
            <div className="form-group full-width">
              <label>Address</label>

              <textarea
                name="currentAddress"
                placeholder="Enter your current address"
                value={address.currentAddress}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            {/* City */}
            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="currentCity"
                placeholder="Enter city"
                value={address.currentCity}
                onChange={handleChange}
                required
              />
            </div>

            {/* State */}
            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="currentState"
                placeholder="Enter state"
                value={address.currentState}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pincode */}
            <div className="form-group">
              <label>Pincode</label>

              <input
                type="text"
                name="currentPincode"
                placeholder="Enter pincode"
                value={address.currentPincode}
                onChange={handleChange}
                maxLength="6"
                required
              />
            </div>

            {/* Country */}
            <div className="form-group">
              <label>Country</label>

              <input
                type="text"
                name="currentCountry"
                value={address.currentCountry}
                onChange={handleChange}
                required
              />
            </div>

          </div>
        </div>


        {/* Same Address Checkbox */}

        <div className="same-address">

          <label>
            <input
              type="checkbox"
              name="sameAsCurrent"
              checked={address.sameAsCurrent}
              onChange={handleChange}
            />

            Permanent address is same as current address
          </label>

        </div>


        {/* Permanent Address */}

        {!address.sameAsCurrent && (
          <div className="address-section">

            <h3>Permanent Address</h3>

            <div className="form-grid">

              {/* Address */}
              <div className="form-group full-width">
                <label>Address</label>

                <textarea
                  name="permanentAddress"
                  placeholder="Enter your permanent address"
                  value={address.permanentAddress}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="permanentCity"
                  placeholder="Enter city"
                  value={address.permanentCity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  name="permanentState"
                  placeholder="Enter state"
                  value={address.permanentState}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  name="permanentPincode"
                  placeholder="Enter pincode"
                  value={address.permanentPincode}
                  onChange={handleChange}
                  maxLength="6"
                  required
                />
              </div>

              {/* Country */}
              <div className="form-group">
                <label>Country</label>

                <input
                  type="text"
                  name="permanentCountry"
                  value={address.permanentCountry}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

          </div>
        )}


        {/* Buttons */}

        <div className="form-actions">

          <button type="submit">
            Save Address
          </button>

        </div>

      </form>

    </div>
  );
};

export default Address;

