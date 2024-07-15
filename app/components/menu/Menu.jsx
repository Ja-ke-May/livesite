import React, { useState } from 'react';
import './menu.css';
import MenuIcon from './MenuIcon';
import Link from 'next/link';

const Menu = ( { } ) => {

    const [showMenuList, setShowMenuList] = useState(false);

  
    const handleMenuClick = () => {
        setShowMenuList(prevState => !prevState);
      };  

  return (   
    <>
    <div>


{showMenuList && (

<section 
id="menu-list" 
className='fixed top-0 right-0 md:pr-2 md:pt-2 bg-gray-800/80 text-white text-xl md:text-2xl p-4 z-50 rounded-bl-3xl'
>
        
{/* <Link href="/about" passHref>
      <button className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" title='wallingservices'>About</button>
</Link> */}
        
<Link href="/tokens" passHref>
      <button className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block mt-10 md:pt-2" title='wallingservices'>Tokens</button>
</Link>

<Link href="/Leaderboards" passHref>
      <button className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" title='home'>Leaderboards</button>
</Link>

<Link href="/help" passHref>
      <button className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" title='learnthebasics'>Help</button>
</Link>

<Link href="/contact" passHref>
      <button className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" title='contact'>Contact</button>
</Link>
    </section>
 )}
</div>
<MenuIcon onMenuToggle={handleMenuClick} />
    </>
  );
};

export default Menu;
