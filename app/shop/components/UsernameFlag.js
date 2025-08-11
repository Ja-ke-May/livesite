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
  { code: "gb", name: "United Kingdom" }, 
  { code: "us", name: "United States" },   
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "ie", name: "Ireland" },
  { code: "nz", name: "New Zealand" },
  { code: "in", name: "India" },
  { code: "za", name: "South Africa" },
  { code: "fr", name: "France" },
  { code: "de", name: "Germany" },
  { code: "af", name: "Afghanistan" },
  { code: "al", name: "Albania" },
  { code: "dz", name: "Algeria" },
  { code: "as", name: "American Samoa" },
  { code: "ad", name: "Andorra" },
  { code: "ao", name: "Angola" },
  { code: "ai", name: "Anguilla" },
  { code: "aq", name: "Antarctica" },
  { code: "ag", name: "Antigua and Barbuda" },
  { code: "ar", name: "Argentina" },
  { code: "am", name: "Armenia" },
  { code: "aw", name: "Aruba" },
  { code: "at", name: "Austria" },
  { code: "az", name: "Azerbaijan" },
  { code: "bs", name: "Bahamas" },
  { code: "bh", name: "Bahrain" },
  { code: "bd", name: "Bangladesh" },
  { code: "bb", name: "Barbados" },
  { code: "by", name: "Belarus" },
  { code: "be", name: "Belgium" },
  { code: "bz", name: "Belize" },
  { code: "bj", name: "Benin" },
  { code: "bm", name: "Bermuda" },
  { code: "bt", name: "Bhutan" },
  { code: "bo", name: "Bolivia" },
  { code: "bq", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "ba", name: "Bosnia and Herzegovina" },
  { code: "bw", name: "Botswana" },
  { code: "bv", name: "Bouvet Island" },
  { code: "br", name: "Brazil" },
  { code: "io", name: "British Indian Ocean Territory" },
  { code: "bn", name: "Brunei Darussalam" },
  { code: "bg", name: "Bulgaria" },
  { code: "bf", name: "Burkina Faso" },
  { code: "bi", name: "Burundi" },
  { code: "cv", name: "Cabo Verde" },
  { code: "kh", name: "Cambodia" },
  { code: "cm", name: "Cameroon" },
  { code: "ky", name: "Cayman Islands" },
  { code: "cf", name: "Central African Republic" },
  { code: "td", name: "Chad" },
  { code: "cl", name: "Chile" },
  { code: "cn", name: "China" },
  { code: "cx", name: "Christmas Island" },
  { code: "cc", name: "Cocos (Keeling) Islands" },
  { code: "co", name: "Colombia" },
  { code: "km", name: "Comoros" },
  { code: "cg", name: "Congo" },
  { code: "cd", name: "Congo, Democratic Republic of the" },
  { code: "ck", name: "Cook Islands" },
  { code: "cr", name: "Costa Rica" },
  { code: "ci", name: "Côte d'Ivoire" },
  { code: "hr", name: "Croatia" },
  { code: "cu", name: "Cuba" },
  { code: "cw", name: "Curaçao" },
  { code: "cy", name: "Cyprus" },
  { code: "cz", name: "Czech Republic" },
  { code: "dk", name: "Denmark" },
  { code: "dj", name: "Djibouti" },
  { code: "dm", name: "Dominica" },
  { code: "do", name: "Dominican Republic" },
  { code: "ec", name: "Ecuador" },
  { code: "eg", name: "Egypt" },
  { code: "sv", name: "El Salvador" },
  { code: "gq", name: "Equatorial Guinea" },
  { code: "er", name: "Eritrea" },
  { code: "ee", name: "Estonia" },
  { code: "sz", name: "Eswatini" },
  { code: "et", name: "Ethiopia" },
  { code: "fk", name: "Falkland Islands (Malvinas)" },
  { code: "fo", name: "Faroe Islands" },
  { code: "fj", name: "Fiji" },
  { code: "gf", name: "French Guiana" },
  { code: "pf", name: "French Polynesia" },
  { code: "tf", name: "French Southern Territories" },
  { code: "ga", name: "Gabon" },
  { code: "gm", name: "Gambia" },
  { code: "ge", name: "Georgia" },
  { code: "gh", name: "Ghana" },
  { code: "gi", name: "Gibraltar" },
  { code: "gr", name: "Greece" },
  { code: "gl", name: "Greenland" },
  { code: "gd", name: "Grenada" },
  { code: "gp", name: "Guadeloupe" },
  { code: "gu", name: "Guam" },
  { code: "gt", name: "Guatemala" },
  { code: "gg", name: "Guernsey" },
  { code: "gn", name: "Guinea" },
  { code: "gw", name: "Guinea-Bissau" },
  { code: "gy", name: "Guyana" },
  { code: "ht", name: "Haiti" },
  { code: "hm", name: "Heard Island and McDonald Islands" },
  { code: "va", name: "Holy See" },
  { code: "hn", name: "Honduras" },
  { code: "hk", name: "Hong Kong" },
  { code: "hu", name: "Hungary" },
  { code: "is", name: "Iceland" },
  { code: "id", name: "Indonesia" },
  { code: "ir", name: "Iran" },
  { code: "iq", name: "Iraq" },
  { code: "im", name: "Isle of Man" },
  { code: "il", name: "Israel" },
  { code: "it", name: "Italy" },
  { code: "jm", name: "Jamaica" },
  { code: "jp", name: "Japan" },
  { code: "je", name: "Jersey" },
  { code: "jo", name: "Jordan" },
  { code: "kz", name: "Kazakhstan" },
  { code: "ke", name: "Kenya" },
  { code: "ki", name: "Kiribati" },
  { code: "kp", name: "North Korea" },
  { code: "kr", name: "South Korea" },
  { code: "kw", name: "Kuwait" },
  { code: "kg", name: "Kyrgyzstan" },
  { code: "la", name: "Laos" },
  { code: "lv", name: "Latvia" },
  { code: "lb", name: "Lebanon" },
  { code: "ls", name: "Lesotho" },
  { code: "lr", name: "Liberia" },
  { code: "ly", name: "Libya" },
  { code: "li", name: "Liechtenstein" },
  { code: "lt", name: "Lithuania" },
  { code: "lu", name: "Luxembourg" },
  { code: "mo", name: "Macao" },
  { code: "mg", name: "Madagascar" },
  { code: "mw", name: "Malawi" },
  { code: "my", name: "Malaysia" },
  { code: "mv", name: "Maldives" },
  { code: "ml", name: "Mali" },
  { code: "mt", name: "Malta" },
  { code: "mh", name: "Marshall Islands" },
  { code: "mq", name: "Martinique" },
  { code: "mr", name: "Mauritania" },
  { code: "mu", name: "Mauritius" },
  { code: "yt", name: "Mayotte" },
  { code: "mx", name: "Mexico" },
  { code: "fm", name: "Micronesia" },
  { code: "md", name: "Moldova" },
  { code: "mc", name: "Monaco" },
  { code: "mn", name: "Mongolia" },
  { code: "me", name: "Montenegro" },
  { code: "ms", name: "Montserrat" },
  { code: "ma", name: "Morocco" },
  { code: "mz", name: "Mozambique" },
  { code: "mm", name: "Myanmar" },
  { code: "na", name: "Namibia" },
  { code: "nr", name: "Nauru" },
  { code: "np", name: "Nepal" },
  { code: "nl", name: "Netherlands" },
  { code: "nc", name: "New Caledonia" },
  { code: "ni", name: "Nicaragua" },
  { code: "ne", name: "Niger" },
  { code: "ng", name: "Nigeria" },
  { code: "nu", name: "Niue" },
  { code: "nf", name: "Norfolk Island" },
  { code: "mk", name: "North Macedonia" },
  { code: "mp", name: "Northern Mariana Islands" },
  { code: "no", name: "Norway" },
  { code: "om", name: "Oman" },
  { code: "pk", name: "Pakistan" },
  { code: "pw", name: "Palau" },
  { code: "ps", name: "Palestine" },
  { code: "pa", name: "Panama" },
  { code: "pg", name: "Papua New Guinea" },
  { code: "py", name: "Paraguay" },
  { code: "pe", name: "Peru" },
  { code: "ph", name: "Philippines" },
  { code: "pn", name: "Pitcairn" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "pr", name: "Puerto Rico" },
  { code: "qa", name: "Qatar" },
  { code: "re", name: "Réunion" },
  { code: "ro", name: "Romania" },
  { code: "ru", name: "Russia" },
  { code: "rw", name: "Rwanda" },
  { code: "bl", name: "Saint Barthélemy" },
  { code: "sh", name: "Saint Helena" },
  { code: "kn", name: "Saint Kitts and Nevis" },
  { code: "lc", name: "Saint Lucia" },
  { code: "mf", name: "Saint Martin" },
  { code: "pm", name: "Saint Pierre and Miquelon" },
  { code: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "ws", name: "Samoa" },
  { code: "sm", name: "San Marino" },
  { code: "st", name: "Sao Tome and Principe" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sn", name: "Senegal" },
  { code: "rs", name: "Serbia" },
  { code: "sc", name: "Seychelles" },
  { code: "sl", name: "Sierra Leone" },
  { code: "sg", name: "Singapore" },
  { code: "sx", name: "Sint Maarten" },
  { code: "sk", name: "Slovakia" },
  { code: "si", name: "Slovenia" },
  { code: "sb", name: "Solomon Islands" },
  { code: "so", name: "Somalia" },
  { code: "gs", name: "South Georgia and the South Sandwich Islands" },
  { code: "ss", name: "South Sudan" },
  { code: "es", name: "Spain" },
  { code: "lk", name: "Sri Lanka" },
  { code: "sd", name: "Sudan" },
  { code: "sr", name: "Suriname" },
  { code: "sj", name: "Svalbard and Jan Mayen" },
  { code: "se", name: "Sweden" },
  { code: "ch", name: "Switzerland" },
  { code: "sy", name: "Syria" },
  { code: "tw", name: "Taiwan" },
  { code: "tj", name: "Tajikistan" },
  { code: "tz", name: "Tanzania" },
  { code: "th", name: "Thailand" },
  { code: "tl", name: "Timor-Leste" },
  { code: "tg", name: "Togo" },
  { code: "tk", name: "Tokelau" },
  { code: "to", name: "Tonga" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "tn", name: "Tunisia" },
  { code: "tr", name: "Turkey" },
  { code: "tm", name: "Turkmenistan" },
  { code: "tc", name: "Turks and Caicos Islands" },
  { code: "tv", name: "Tuvalu" },
  { code: "ug", name: "Uganda" },
  { code: "ua", name: "Ukraine" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "um", name: "United States Minor Outlying Islands" },
  { code: "uy", name: "Uruguay" },
  { code: "uz", name: "Uzbekistan" },
  { code: "vu", name: "Vanuatu" },
  { code: "ve", name: "Venezuela" },
  { code: "vn", name: "Vietnam" },
  { code: "vg", name: "Virgin Islands, British" },
  { code: "vi", name: "Virgin Islands, U.S." },
  { code: "wf", name: "Wallis and Futuna" },
  { code: "eh", name: "Western Sahara" },
  { code: "ye", name: "Yemen" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" }
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
    const flag = flags.find(f => f.code === selectedFlag);
    if (!flag) {
      setError("Selected flag not found.");
      setLoading(false);
      return;
    }

    setSuccessMessage(`You have successfully purchased the ${flag.name} flag!`);
      setShowPopup(false);
  } catch (err) {
    setError(err.message || "Could not add flag.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="rounded-md shadow-md max-w-sm lg:max-w-4xl mx-auto p-4 mt-10"
      style={{ borderColor: "#000110", borderWidth: "2px", borderStyle: "solid" }}
    >
      <h3 className="text-center text-lg font-semibold text-white mb-4">Your Flag</h3> 

      {username && (
        <>
          <p className="text-center text-yellow-400 brightness-125 mb-2 mt-2">{TOKEN_COST} Tokens</p>
          <div className="w-full flex justify-center items-center">
          <button
            onClick={() => setShowPopup(true)} 
            disabled={loading}
            className={`text-center mb-5 bg-yellow-400 font-bold brightness-125 text-lg text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600`}
          >
            {loading ? "Processing..." : "Purchase"}
          </button> 
          </div>
        </>
      )} 

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
          <p className="text-center text-yellow-400 brightness-125 mb-2 mt-2">{TOKEN_COST} Tokens</p>
          <div className="w-full flex justify-center items-center">
          <button
            onClick={() => setShowPopup(true)} 
            disabled={loading}
            className={`text-center mb-5 bg-yellow-400 font-bold brightness-125 text-lg text-[#000110] px-2 py-1 rounded-md shadow-sm hover:bg-yellow-600`}
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
        <span className="uppercase font-semibold text-yellow-400 brightness-125">{flags.find(f => f.code === selectedFlag)?.name}</span> flag for{" "}
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