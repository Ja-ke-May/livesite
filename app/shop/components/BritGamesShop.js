const BritGamesShop = ({
  selectedItem,
  setSelectedItem,
  isLoggedIn,
  username,
  isPurchasing,
  handlePurchaseClick,
}) => {
  return (

<div className="relative w-full z-10 py-5 px-2 bg-gradient-to-tr from-red-600 via-white to-blue-600 rounded mt-10">
 <h2 className="text-center text-xl mb-6 font-black text-black flex items-center justify-center gap-2">
  Limited Edition - BRITGAMES! 
  <img 
    src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" 
    alt="UK Flag" 
    className="w-6 h-4 inline-block"
  />
</h2>


  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center px-6">
    {/* Brit Stick */}
    <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2">
     <img
  src="/images/stick-britgames.png"
  alt="Brit Stick"
  className="w-full h-40 object-contain mb-4"
/>

      <h3 className="text-center text-lg font-semibold">Brit Stick</h3>
      <p className="text-center text-sm mb-2">Got a stick mate?</p>

      <select
        className="mt-2 bg-gray-900 text-white p-2 rounded-md shadow-sm w-full"
        value={selectedItem.name === 'britgames' ? selectedItem.player : ''}
        onChange={(e) =>
          setSelectedItem({ name: 'britgames', player: e.target.value })
        }
      >
        <option value="">Select a player</option>
        <option value="Player 1">Player 1</option>
        <option value="Player 2">Player 2</option>
        <option value="Player 3">Player 3</option>
        <option value="Player 4">Player 4</option>
        <option value="Player 5">Player 5</option>
        <option value="Player 6">Player 6</option>
        <option value="Player 7">Player 7</option>
        <option value="Player 8">Player 8</option>
      </select>

      {isLoggedIn && username && (
         <div className="text-center flex flex-col flex-end">
          <p className="text-yellow-400 brightness-125 mt-2">400 Tokens</p>
          <button
            className={`mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
            onClick={() => handlePurchaseClick('britgames', 400)}
            disabled={isPurchasing || !selectedItem.player}
          >
            Purchase
          </button>
        </div>
      )}
    </div>

    {/* Safety Boat */}
    <div className="bg-gray-800/80 p-4 rounded-md shadow-md border-2 flex flex-col justify-between h-full">
      <img
        src="https://cdn.pixabay.com/photo/2013/07/13/12/19/dinghy-159624_1280.png"

        alt="Safety Boat"
        className="w-full h-40 object-contain mb-4"
      />
      <h3 className="text-center text-lg font-semibold">Safety Boat</h3>
      <p className="text-center text-sm mb-2">They MIGHT need this...</p>

      {isLoggedIn && username && (
        <div className="text-center flex flex-col flex-end">
          <p className="text-yellow-400 brightness-125 mt-2">10000 Tokens</p>
          <button
            className={`mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
            onClick={() => handlePurchaseClick('safety_boat', 10000)}
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

export default BritGamesShop