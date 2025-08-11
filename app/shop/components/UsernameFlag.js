"use client";
import React, { useState, useContext } from "react";
import { updateUserFlag } from "@/utils/apiClient"; 
import { AuthContext } from "@/utils/AuthContext";

export default function FlagShop() {
  const { username, login, updateFlag } = useContext(AuthContext);
  const [selectedFlag, setSelectedFlag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");

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
    setError("Select a flag first.");
    return;
  }
  setError(""); 
   setSuccessMessage("");
  setLoading(true);
  try {
    const updatedUser = await updateUserFlag(username, selectedFlag); 

    updateFlag(updatedUser.flag); 
    setSuccessMessage(`You have successfully purchased the ${selectedFlag} flag!`);
  } catch (err) {
    setError(err.message || "Could not add flag.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="bg-gray-800/80 rounded-md shadow-md max-w-sm mx-auto p-4 mt-10"
      style={{ borderColor: "#000110", borderWidth: "2px", borderStyle: "solid" }}
    >
      <h3 className="text-center text-lg font-semibold text-white mb-4">Username Flag</h3>

      <div className="grid grid-cols-5 gap-3 mb-4">
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
          <p className="text-center text-yellow-400 brightness-125 mb-4">1000 Tokens</p>
          <button
            onClick={buyFlag}
            disabled={loading}
            className="w-full bg-yellow-400 font-bold brightness-125 text-[#000110] py-2 rounded-md shadow-sm hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Processing..." : "Buy Flag"}
          </button>
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
    </div>
  );
}
