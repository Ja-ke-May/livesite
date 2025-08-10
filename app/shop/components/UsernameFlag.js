"use client";
import React, { useState, useContext } from "react";
import { updateUsername } from "@/utils/apiClient";
import { AuthContext } from "@/utils/AuthContext";

export default function FlagShop() {
  const { username, login } = useContext(AuthContext);
  const [selectedFlag, setSelectedFlag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  ];

  const buyFlag = async () => {
    if (!selectedFlag) return setError("Select a flag first.");
    setError("");
    setLoading(true);
    try {
      const newName = `${selectedFlag.toUpperCase()} ${username}`;
      const updatedUser = await updateUsername(newName);
      login(localStorage.getItem("token"), updatedUser.userName);
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
          <p className="text-center text-yellow-400 brightness-125 mb-4">1000 tokens</p>
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
    </div>
  );
}
