const Viewer = () => {
    return (
      <>
      <div className="mt-2 h-8 bg-yellow-400 w-[100%] text-sm md:text-md text-center text-[#000110] font-bold">
Join the live queue
<button className="border-2 border-[#000110] pr-1 pl-1 m-1 text-sm md:text-md hover:bg-yellow-400 hover:brightness-125 rounded animate-pulse">JOIN</button>
      </div>
      <div className="h-[360px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md p-4 md:p-6 w-full">
        
        <h1>Viewer Component</h1>
        {/* Add viewer logic here */}
      </div>

      </>
    );
  };
  
  export default Viewer;
  