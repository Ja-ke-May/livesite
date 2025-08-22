import TokenGoal from "./TokenGoal";


const BritGamesShop = ({
 selectedItem,
  setSelectedItem,
  isLoggedIn,
  username,
  isPurchasing,
  handlePurchaseClick,
}) => {
  

const players = ["Oddwin", "Lou", "Lad(Michael)", "Hermit(Michael)", "Lentil", "Roxy"];




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


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center px-6">

        {/* Fish n Chips */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2 flex flex-col justify-between h-full">
          <h3 className="text-center text-xl font-semibold">Fish n Chips</h3>
          <img
            src="/images/fish_chips.png"
            alt="Fish n Chips"
            className="w-full h-40 object-contain mb-4 "
          />

            <TokenGoal 
            
  item="Fish n Chips"
  pot="fishnchips"
  goal={20000}
    isPurchasing={isPurchasing} 
    isLoggedIn={isLoggedIn}
  username={username}
/>

          

        
        </div>

{/* Takeaway Tonight */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2 flex flex-col justify-between h-full">
          <h3 className="text-center text-xl font-semibold">Takeaway Tonight?</h3>
          <img
            src="https://cdn.pixabay.com/photo/2023/07/16/20/49/ai-generated-8131440_1280.png"
            alt="takeaway food"
            className="w-full h-40 object-contain"
          />

          <TokenGoal 
          
  item="Takeaway Tonight"
  pot="takeaway-pot"
  goal={30000} 
  isPurchasing={isPurchasing}
  isLoggedIn={isLoggedIn}
  username={username}
/>

          


          
        </div>



{/* Cookie */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
          <h3 className="text-center text-lg font-semibold">Biscuit</h3>
          <img
            src="/images/cookie-britgames.png"
            alt="Biscuit"
            className="w-full h-40 object-contain mb-4"
          />
          <p className="text-center text-sm mb-2">Feed Me Plz</p>
          <select
  className="hidden mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
  value={selectedItem.name === "Biscuit" ? selectedItem.player : ""}
  onChange={(e) =>
    setSelectedItem({ name: "Biscuit", player: e.target.value })
  }
>
  <option value="">Select a player</option>
  {players.map((player, i) => (
    <option key={i} value={player}>
      {player}
    </option>
  ))}
</select>


          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">400 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() =>
                  handlePurchaseClick("Biscuit", 400, selectedItem.player)
                }
                disabled={isPurchasing || !selectedItem.player}
              >
                Purchase
              </button>
            </div>
          )}
        </div>


        {/* Brit Stick */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
          <h3 className="text-center text-lg font-semibold">Brit Stick</h3>
          <img
            src="/images/stick-britgames.png"
            alt="Brit Stick"
            className="w-full h-40 object-contain mb-4"
          />
          <p className="text-center text-sm mb-2">Got a Stick Mate?</p>
          <select
  className="hidden mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
  value={selectedItem.name === "Brit Stick" ? selectedItem.player : ""}
  onChange={(e) =>
    setSelectedItem({ name: "Brit Stick", player: e.target.value })
  }
>
  <option value="">Select a player</option>
  {players.map((player, i) => (
    <option key={i} value={player}>
      {player}
    </option>
  ))}
</select>


          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">400 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
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

{/* Sparkle Song */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
          <h3 className="text-center text-lg font-semibold">Sparkle Song</h3>
          <img
            src="/images/sparkle-britgames.png"
            alt="Sparkle Song"
            className="w-full h-40 object-contain mb-4"
          />
          <p className="text-center text-sm mb-2">Time to SHINE!</p>
          <select
  className="hidden mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
  value={selectedItem.name === "Sparkle Song" ? selectedItem.player : ""}
  onChange={(e) =>
    setSelectedItem({ name: "Sparkle Song", player: e.target.value })
  }
>
  <option value="">Select a player</option>
  {players.map((player, i) => (
    <option key={i} value={player}>
      {player}
    </option>
  ))}
</select>


          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">1000 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() =>
                  handlePurchaseClick("Sparkle Song", 1000, selectedItem.player)
                }
                disabled={isPurchasing || !selectedItem.player}
              >
                Purchase
              </button>
            </div>
          )}
        </div>


{/* Roll Dice */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
          <h3 className="text-center text-lg font-semibold">Roll D20</h3>
          <img
            src="/images/roll-britgames.png"
            alt="Roll Dice"
            className="w-full h-40 object-contain mb-4 "
          />
          <p className="text-center text-sm mb-2">We're rolling!</p>
          <select
  className="hidden mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
  value={selectedItem.name === "Roll Dice" ? selectedItem.player : ""}
  onChange={(e) =>
    setSelectedItem({ name: "Roll Dice", player: e.target.value })
  }
>
  <option value="">Select a player</option>
  {players.map((player, i) => (
    <option key={i} value={player}>
      {player}
    </option>
  ))}
</select>


          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">400 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() =>
                  handlePurchaseClick("Roll Dice", 400, selectedItem.player)
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
          <h3 className="text-center text-xl font-semibold">Safety Boat</h3>
          <img
            src="https://cdn.pixabay.com/photo/2013/07/13/12/19/dinghy-159624_1280.png"
            alt="Safety Boat"
            className="w-full h-40 object-contain"
          />
          <p className="text-center text-sm mb-2 mt-2">They MIGHT need this...</p>

          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">40000 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() => handlePurchaseClick("Safety Boat", 40000)}
                disabled={isPurchasing}
              >
                Purchase
              </button>
            </div>
          )}
        </div>
      

       {/* Blackpool */}
        <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2 flex flex-col justify-between h-full">
          <h3 className="text-center text-xl font-semibold">Blackpool</h3>
          <img
            src="https://cdn.pixabay.com/photo/2019/02/26/11/00/blackpool-4021722_1280.jpg"
            alt="Blackpool"
            className="w-full h-40 object-contain rounded-full"
          />
          <p className="text-center text-sm mt-2 mb-2">Nothing beats a Blackpool holiday</p>

          {isLoggedIn && username && (
            <div className="text-center flex flex-col flex-end">
              <p className="text-yellow-400 brightness-125 mt-2">2000000 Tokens</p>
              <button
                className={`hidden mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}
                onClick={() => handlePurchaseClick("Blackpool", 2000000)}
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
