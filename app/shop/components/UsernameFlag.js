"use client";
import React, { useState, useContext } from "react";
import { updateUserFlag, deductTokens } from "@/utils/apiClient"; 
import { AuthContext } from "@/utils/AuthContext";

export default function FlagShop() {
  const { username, updateFlag } = useContext(AuthContext);
  const [selectedFlag, setSelectedFlag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const [successMessage, setSuccessMessage] = useState(""); 
   const [showPopup, setShowPopup] = useState(false);

   const TOKEN_COST = 500;

  const flags = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "fr", name: "France" },
  { code: "de", name: "Germany" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "mx", name: "Mexico" },
  { code: "cn", name: "China" },
  { code: "za", name: "South Africa" },
  { code: "ru", name: "Russia" },
  { code: "se", name: "Sweden" },
  { code: "ar", name: "Argentina" },
  { code: "nl", name: "Netherlands" },
  { code: "be", name: "Belgium" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "no", name: "Norway" },
  { code: "dk", name: "Denmark" },
  { code: "fi", name: "Finland" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "gr", name: "Greece" },
  { code: "tr", name: "Turkey" },
  { code: "il", name: "Israel" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "eg", name: "Egypt" },
  { code: "ng", name: "Nigeria" },
  { code: "ke", name: "Kenya" },
  { code: "et", name: "Ethiopia" },
  { code: "th", name: "Thailand" },
  { code: "vn", name: "Vietnam" },
  { code: "sg", name: "Singapore" },
  { code: "my", name: "Malaysia" },
  { code: "id", name: "Indonesia" },
  { code: "ph", name: "Philippines" },
  { code: "pk", name: "Pakistan" },
  { code: "bd", name: "Bangladesh" },
  { code: "nz", name: "New Zealand" },
  { code: "ie", name: "Ireland" },
  { code: "cz", name: "Czech Republic" },
  { code: "hu", name: "Hungary" },
  { code: "ro", name: "Romania" },
  { code: "bg", name: "Bulgaria" },
  { code: "hr", name: "Croatia" },
  { code: "rs", name: "Serbia" },
  { code: "sk", name: "Slovakia" },
  { code: "si", name: "Slovenia" },
  { code: "ua", name: "Ukraine" },
  { code: "by", name: "Belarus" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "pe", name: "Peru" },
  { code: "ve", name: "Venezuela" },
  { code: "uy", name: "Uruguay" },
  { code: "bo", name: "Bolivia" },
  { code: "py", name: "Paraguay" },
  { code: "ec", name: "Ecuador" },
  { code: "cr", name: "Costa Rica" },
  { code: "pa", name: "Panama" },
  { code: "cu", name: "Cuba" },
  { code: "do", name: "Dominican Republic" },
  { code: "jm", name: "Jamaica" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "is", name: "Iceland" },
  { code: "lt", name: "Lithuania" },
  { code: "lv", name: "Latvia" },
  { code: "ee", name: "Estonia" },
  { code: "mt", name: "Malta" },
  { code: "cy", name: "Cyprus" },
  { code: "qa", name: "Qatar" },
  { code: "kw", name: "Kuwait" },
  { code: "bh", name: "Bahrain" },
  { code: "om", name: "Oman" },
  { code: "jo", name: "Jordan" },
  { code: "lb", name: "Lebanon" },
  { code: "ma", name: "Morocco" },
  { code: "tn", name: "Tunisia" },
  { code: "dz", name: "Algeria" },
  { code: "gh", name: "Ghana" },
  { code: "tz", name: "Tanzania" },
  { code: "ug", name: "Uganda" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
  { code: "np", name: "Nepal" },
  { code: "lk", name: "Sri Lanka" },
  { code: "mm", name: "Myanmar" },
  { code: "kh", name: "Cambodia" },
  { code: "la", name: "Laos" },
  { code: "mn", name: "Mongolia" },
  { code: "kz", name: "Kazakhstan" },
  { code: "uz", name: "Uzbekistan" },
];


 const buyFlag = async () => {
  if (!selectedFlag) {
     setShowPopup(false);
    setError("Select a flag first.");
    return;
  }
  setError(""); 
   setSuccessMessage("");
  setLoading(true);
  try {
     await deductTokens(TOKEN_COST);

    const updatedUser = await updateUserFlag(username, selectedFlag); 

    updateFlag(updatedUser.flag); 
    setSuccessMessage(`You have successfully purchased the ${selectedFlag} flag!`); 
      setShowPopup(false);
  } catch (err) {
    setError(err.message || "Could not add flag.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="rounded-md shadow-md max-w-sm mx-auto p-4 mt-10"
      style={{ borderColor: "#000110", borderWidth: "2px", borderStyle: "solid" }}
    >
      <h3 className="text-center text-lg font-semibold text-white mb-4">Username Flag</h3>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(56px, 1fr))' }}>
        {flags.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => setSelectedFlag(code)}
            className={`p-1 rounded-md border-2 transition-colors duration-200 flex justify-center items-center ${
              selectedFlag === code
                ? "border-yellow-400 bg-yellow-400"
                : "border-transparent bg-gray-700 hover:border-yellow-400"
            }`}
            title={name}
          >
            <img
              src={`https://flagcdn.com/w40/${code}.png`}
              alt={name}
              className="h-8 w-12 object-cover rounded-sm"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {username && (
        <>
          <p className="text-center text-yellow-400 brightness-125 mb-4 mt-2">{TOKEN_COST} Tokens</p>
          <div className="w-full flex justify-center items-center">
          <button
            onClick={() => setShowPopup(true)} 
            disabled={loading}
            className={`mb-5 bg-yellow-400 font-bold brightness-125 text-xl text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600`}
          >
            {loading ? "Processing..." : "Purchase"}
          </button> 
          </div>
        </>
      )}

      {error && <p className="text-red-500 mt-3 font-semibold">{error}</p>} 

      {successMessage && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-green-400 font-semibold mb-2">{successMessage}</p>
          <img
            src={`https://flagcdn.com/w80/${selectedFlag}.png`}
            alt="Selected Flag"
            className="h-10 w-16 rounded-sm border border-yellow-400"
          />
        </div>
      )} 
      
      {/* Popup modal */}
      {showPopup && (
  <div
    onClick={() => setShowPopup(false)}
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 space-y-6 text-white"
    >
      <h2 className="text-2xl font-bold">Confirm Purchase</h2>
      <p>
        Are you sure you want to purchase the{" "}
        <span className="uppercase font-semibold text-yellow-400 brightness-125">{selectedFlag}</span> flag for{" "}
        <span className="font-semibold text-yellow-400 brightness-125">{TOKEN_COST}</span> tokens?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowPopup(false)}
          className="px-5 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={buyFlag}
          disabled={loading}
          className="px-5 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}