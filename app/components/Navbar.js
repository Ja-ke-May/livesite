
import Link from 'next/link';


const Navbar = () => {

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
     
        <>
          <Link href="/broadcaster">Broadcaster</Link>
          <Link href="/viewer">Viewer</Link>
          <Link href="/profile">Profile</Link>
          <button>Log Out</button>
        </>
      
        <>
          <Link href="/login">Log In</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      
    </nav>
  );
};

export default Navbar;
