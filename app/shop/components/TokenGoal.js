import React, { useEffect, useState } from "react";
import { fetchTokenGoal, addTokensToGoal, deductTokens } from "@/utils/apiClient"; 


const TokenGoal = ({ item, pot, goal, isPurchasing, isLoggedIn, username }) => {
  const [currentTokens, setCurrentTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  const loadGoal = async () => {
    try {
      setLoading(true);
      const data = await fetchTokenGoal(pot);
      setCurrentTokens(data.currentTokens);
    } catch (err) {
      console.error(`Failed to load token goal for ${item}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTokens = async () => {
    const numAmount = parseInt(amount, 10);
    if (
      isNaN(numAmount) ||
      numAmount < 1 ||
      numAmount > goal - currentTokens
    ) {
      alert(
        `Please enter a valid amount between 1 and ${goal - currentTokens}`
      );
      return;
    }

    try {

      await deductTokens(numAmount);
      await addTokensToGoal(pot, numAmount);
      await loadGoal(); 
      setShowModal(false);
      setAmount("");
    } catch (err) {
      console.error(`Failed to add tokens to ${item}:`, err);
    }
  };

  useEffect(() => {
  loadGoal();
  const interval = setInterval(loadGoal, 10000); 
  return () => clearInterval(interval);
}, [pot]);

  const progress = Math.min((currentTokens / goal) * 100, 100);

  return (
    <div className="w-full mt-4">
      {loading ? (
        <p className="text-center text-xs text-gray-300">Loading...</p>
      ) : (
        <>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-yellow-400 h-4 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-white mt-1">
            {currentTokens.toLocaleString()} / {goal.toLocaleString()} Tokens
          </p>

          <p className="text-center text-sm mb-2 mt-2">Help Reach the Goal!</p>

 {isLoggedIn && username && (
<div className="w-full flex justify-center">
          {/* Add Tokens Button */}
          <button
            onClick={() => setShowModal(true)}
            className={`mt-2 bg-yellow-400 font-bold text-[#000110] px-4 py-2 rounded-md hover:bg-yellow-600 ${
                  isPurchasing ? "animate-pulse" : ""
                }`}>
            Add Tokens
          </button>
          </div>
 )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center">
                <h3 className="text-lg font-bold mb-3 text-white">
                  Add Tokens to {item}
                </h3>
                <input
                  type="number"
                  min="1"
                  max={goal - currentTokens}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`1 - ${goal - currentTokens}`}
                />
                <div className="flex gap-3 justify-center">
                    <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTokens}
                     className={`ml-2 mt-4 bg-yellow-400 font-bold brightness-125 text-[#000110] px-4 py-2 rounded-md shadow-sm hover:bg-yellow-600 ${isPurchasing ? 'animate-pulse' : ''}`}
                
                  >
                    Confirm
                  </button>
                
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TokenGoal;
