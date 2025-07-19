import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BritGamesShop = ({
  selectedItem,
  setSelectedItem,
  isLoggedIn,
  username,
  isPurchasing,
  handlePurchaseClick,
}) => {
  const [socket, setSocket] = useState(null);
  const [activeIndex, setActiveIndex] = useState(5); 
  const scaleItems = [
    "Hotel, Meal Out",
    "Campsite, Pizza",
    "Takeaway",
    "Chicken",
    "Beans on Toast",
    "Cold Beans",
  ];
  const dotOffsets = [0, 20, 40, 60, 80, 100]; 

  const handleVote = (direction) => {
    setActiveIndex((prev) => {
      const newIndex = Math.max(0, Math.min(5, prev + (direction === "down" ? 1 : -1)));
      if (socket) {
        socket.emit("dotPositionUpdate", newIndex);
      }
      return newIndex;
    });
  };

  useEffect(() => {
    const newSocket = io("https://livesite-backend.onrender.com", {
      reconnection: true,
      reconnectionAttempts: 1000,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

 

  return (
    <div className="relative w-full z-10 py-5 px-2 bg-gradient-to-tr from-red-600 via-white to-blue-600 rounded mt-10">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
        alt="UK Flag"
        className="w-6 h-4  mx-auto mb-2"
      />
      <h2 className="text-center text-xl mb-2 font-black text-black flex items-center justify-center gap-2">
        Limited Edition - BRITGAMES!
      </h2>
      <img
        src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
        alt="UK Flag"
        className="w-6 h-4  mx-auto mb-4"
      />

{/* LUXURY SCALE */}
<div className="relative w-full max-w-md mx-auto mt-6 mb-6 brightness-125 bg-gray-800/80 p-4 rounded-md shadow-md border-2">
  <h3
    className="
      text-3xl
      font-extrabold
      text-center
      italic
      underline
      bg-gradient-to-r from-red-500 via-white/50 to-blue-500
      bg-clip-text
      text-transparent
      rounded-lg
      relative
      z-10
      p-2
      border-2
      border-yellow-400
      drop-shadow-md
      tracking-wide
    "
  >
    Luxury Scale
  </h3>

  <div className="flex flex-col gap-4 mt-6 z-10 relative">
    

<div className="flex flex-col gap-2 mt-6 mb-2 z-10 relative px-8"> {/* Added px-8 */}
  {/* Vertical Line */}
  <div className="absolute left-1/2 transform -translate-x-1/2 top-2 bottom-0 w-1 bg-white opacity-60 rounded"></div>

  {/* Dot */}
  <div
    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400 z-20 transition-all duration-300"
    style={{ top: `${dotOffsets[activeIndex]}%` }}
  ></div>

  {/* Scale Items */}
  {scaleItems.map((label, index) => (
    <div
      key={index}
    className={`
  border-2 p-4 rounded-lg cursor-default transition-all duration-300
  font-semibold tracking-wide max-w-[180px] break-words
  ${index % 2 === 0 ? "self-start" : "self-end"}
  ${activeIndex === index 
    ? "ring-4 ring-yellow-400 scale-105 shadow-lg opacity-100" 
    : "hover:ring-2 hover:ring-yellow-300 opacity-50"}
  ${
    index % 3 === 0
      ? "bg-red-700 text-white border-black shadow-md"
      : index % 3 === 1
      ? "bg-white text-black border-black shadow-sm"
      : "bg-blue-700 text-white border-black shadow-md"
  }
  select-none
`}

      style={{ textShadow: activeIndex === index ? "0 0 8px rgba(255, 215, 0, 0.7)" : "none" }}
    >
      {label}
    </div>
  ))}
</div>


  </div>

{isLoggedIn && username && (
  <div>
  <h4 className="text-center text-2xl text-white m-6 font-bold">
    Vote On Tonight's Evening Activity
  </h4>

  <div className="flex justify-center">
    <button
      className={`border-2 text-5xl mr-2 rounded p-2 transition
      ${activeIndex === 5 ? "bg-red-700 opacity-50 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 opacity-100"}`}
   aria-label="Vote down"
      onClick={async () => {
    const success = await handlePurchaseClick("Luxury Downvote", 1000);
    if (success) handleVote("down");
  }}
 disabled={activeIndex === 5}
    >
      \/
    </button>
    <button
     className={`border-2 text-5xl ml-2 rounded p-2 transition
      ${activeIndex === 0 ? "bg-green-700 opacity-50 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 opacity-100"}`}
    aria-label="Vote up" 
      onClick={async () => {
    const success = await handlePurchaseClick("Luxury Upvote", 1000);
    if (success) handleVote("up");
  }}
     disabled={activeIndex === 0}
    >
      /\
    </button>
  </div>

  <p className="text-center mt-4 text-white">
    At 4pm UK time the item selected will be chosen.
  </p>
  </div>
)}
</div>


      {/* Shop Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center px-6">
        {/* Brit Stick */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
          <h3 className="text-center text-lg font-semibold">Brit Stick</h3>
          <img
            src="/images/stick-britgames.png"
            alt="Brit Stick"
            className="w-full h-40 object-contain mb-4"
          />
          <p className="text-center text-sm mb-2">Got a stick mate?</p>
          <select
            className="mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
            value={selectedItem.name === "Brit Stick" ? selectedItem.player : ""}
            onChange={(e) =>
              setSelectedItem({ name: "Brit Stick", player: e.target.value })
            }
          >
            <option value="">Select a player</option>
            {[...Array(8)].map((_, i) => (
              <option key={i} value={`Player ${i + 1}`}>
                Player {i + 1}
              </option>
            ))}
          </select>

          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">400 Tokens</p>
              <button
                className={`mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() =>
                  handlePurchaseClick("Brit Stick", 400, selectedItem.player)
                }
                disabled={isPurchasing || !selectedItem.player}
              >
                Purchase
              </button>
            </div>
          )}
        </div>

        {/* Safety Boat */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2 flex flex-col justify-between h-full">
          <h3 className="text-center text-lg font-semibold">Safety Boat</h3>
          <img
            src="https://cdn.pixabay.com/photo/2013/07/13/12/19/dinghy-159624_1280.png"
            alt="Safety Boat"
            className="w-full h-40 object-contain"
          />
          <p className="text-center text-sm mb-2">They MIGHT need this...</p>

          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">20000 Tokens</p>
              <button
                className={`mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() => handlePurchaseClick("Safety Boat", 20000)}
                disabled={isPurchasing}
              >
                Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BritGamesShop;
