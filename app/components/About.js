"use client";

import { useState, useContext } from 'react';
import Navbar from './Navbar'; 
import { AuthContext } from '@/utils/AuthContext';

const About = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/about');

  return (
    <>
      <div>
        <Navbar 
          isLoggedIn={isLoggedIn}  
          currentPath={currentPath} 
          setCurrentPath={setCurrentPath} 
          username={username}
        />
        <div className="max-w-4xl mx-auto p-4 lg:text-lg">
          <h1 className='text-2xl font-bold mt-4 mb-6 text-center'>MyMe.Live</h1>

          <section className="mb-8">
            <h2 className='text-xl font-semibold mb-2'>Welcome to MyMe <span className='brightness-125'>⭐</span></h2>
            <p>
              <strong>MyMe</strong> is a unique live streaming platform and community where the spotlight is always on YOU. Designed for aspiring creative professionals, entrepreneurs, and anyone with a passion to share, MyMe gives you the stage to showcase your ideas, talents, or business. Whether you're an artist, a startup founder, or someone with a message, MyMe offers an exciting and supportive environment to connect, grow, and shine.
            </p>
          </section>

          <section className="mb-8">
            <h2 className='text-xl font-semibold mb-2 brightness-125'><span className='text-yellow-400'>YOUR YOU ⭐</span></h2>
            <p>
              At MyMe, we believe in celebrating the real you. Our mission is to create a community where authenticity and creativity thrive. Unlike traditional social media, there’s no need to play by the rules of algorithms or chase after followers. MyMe is your space to be seen, heard, and appreciated for who you truly are. We focus on fostering honest feedback, real connections, and a culture where creativity is king.
            </p>
          </section>

          <section className="mb-8">
            <h2 className='text-xl font-semibold mb-2'>How MyMe Works <span className='brightness-125'>⭐</span></h2>
            <div className="list-disc list-inside ml-4">
              <p className='mt-2'>
                <strong><span className='brightness-125'>⭐</span> Go Live, One at a Time:</strong> MyMe focuses on a single live streamer at a time, giving you an undivided spotlight. When you join the queue, your moment to shine comes when you're at the front. The audience votes in real-time—if they love what they see, your time gets extended. If not, the next person gets their chance. It's a fair, exciting way to share your creativity.
              </p>
              <p className='mt-2'>
                <strong><span className='brightness-125'>⭐</span> Real-Time Interaction:</strong> Engage directly with your audience through live chat. Share your thoughts, promote your work, and make connections. Customise your messages to stand out even more. When someone clicks on your name, they can check out your profile and follow your links to other social platforms or websites.
              </p>
              <p className='mt-2'>
                <strong><span className='brightness-125'>⭐</span> Earn and Spend Tokens:</strong> As you captivate the audience, you'll earn tokens. These can be used to enhance your visibility on the platform—customise your profile, make your comments pop, or grab a "Fast Pass" to jump the queue and go live sooner. Tokens are also available for purchase, helping you promote what matters most while supporting the platform.
              </p>
              <p className='mt-2'>
                <strong><span className='brightness-125'>⭐</span> Community-Driven Content:</strong> Our innovative voting system ensures that the most engaging content stays in the spotlight. If the audience isn’t hooked, they can vote to move on, paving the way for the next exciting stream. This dynamic approach keeps MyMe fresh and driven by its users.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className='text-xl font-semibold mb-2'>Why MyMe? <span className='brightness-125'>⭐</span></h2>
            <p>
              MyMe isn’t just a platform—it’s a community where every voice matters. Whether you're launching a new business, showcasing your art, or simply sharing your thoughts, MyMe provides a welcoming space for real, meaningful interactions. Here, you don’t need a massive following or a niche market. Everyone gets a chance to shine.
            </p>
            <div className="list-disc list-inside ml-4 mt-2">
              <p><strong><span className='brightness-125'>⭐</span> Go Live:</strong> Share your ideas, talents, or passions with an engaged audience.</p>
              <p><strong><span className='brightness-125'>⭐</span> Interact:</strong> Chat, vote, and connect with others in real-time.</p>
              <p><strong><span className='brightness-125'>⭐</span> Customise:</strong> Use tokens to personalise your profile and stand out in the crowd.</p>
              <p><strong><span className='brightness-125'>⭐</span> Promote:</strong> Share your links to grow your audience and expand your reach.</p>
            </div>
          </section>

          <section className="mb-8">
  <h2 className="text-xl font-semibold mb-2">
    The Future <span className="brightness-125">⭐</span>
  </h2>
  <p>
    MyMe is constantly evolving with its community. While the future is not yet decided, features like multiple rooms, simultaneous streams, and even video posting options could be on the horizon. Our goal is to break traditional social media barriers, making it easier to share ideas and connect. MyMe is driven by its users, and its future will be shaped by you.
  </p>
  <p>
    Looking ahead, expect more shop items, leaderboards to highlight active and popular users, and even competitions where you can earn tokens. Together, we’re building a creative revolution, where you help shape the future of MyMe.
  </p>
</section>

          <section className="mb-8">
            <h2 className='text-xl font-semibold mb-2'>Community <span className='brightness-125'>⭐</span></h2>
            <p>
              At MyMe, we prioritise a positive, creative, and supportive environment. We encourage free speech with a focus on fostering fun, creativity, and mutual respect. Guidelines are strictly enforced:
            </p>
           
              <p className='mt-2'><strong className='text-red-500'>❌ Over 18 Only:</strong> MyMe is an adult community. We do not allow pornographic or illegal content—violations will result in immediate bans.</p>
              <p><strong className='text-red-500'>❌ Respect:</strong> Spamming, harassment, or causing trouble intentionally will lead to warnings and potential bans.</p>
              <p><strong className='text-yellow-400 brightness-125'><span className='brightness-125'>⭐</span> Support and Honesty:</strong> We value real, honest feedback and interactions that help everyone grow and improve.</p>
            
          </section>

          <section> <h2 className='text-xl font-semibold mb-2'>The Creator <span className='brightness-125'>⭐</span></h2> 
          <p> 
          Hi, I’m Jacob, the creator of MyMe. My journey in the social media world has shown me how powerful it can be to connect with others, share ideas, and grow a network. But I also saw the need for a platform that’s more focused on authentic interactions and giving everyone a chance to shine—without the pressure of chasing followers or dedicating your life to a specific niche.
          <br /> 
          That’s why I built MyMe. A new fun and exciting space where anyone can step into the spotlight, share their passions, and make meaningful connections. MyMe is all about celebrating creativity and individuality in real-time. It’s a platform where you can showcase your talents, promote your projects, and engage with a supportive community that values what you bring to the table.
          <br /> 
          Whether you’re an entrepreneur, artist, or just someone with a great idea, MyMe is designed to help you grow, connect, and thrive in a way that feels natural and enjoyable. Here, every voice has a chance to be heard, and every moment is an opportunity to build something new. I’m excited to welcome you to MyMe, where the spotlight is always on, <span className='text-yellow-400 brightness-125'>YOUR YOU </span><span className='brightness-150'>⭐</span>
          </p> 
          </section>

          <div className="w-full text-center mt-8 flex justify-center items-center">
          
              <a href="/" className={`text-white font-black flex items-centerz-[150]`}>
      <div className="flex items-center justify-center">
        <p className="text-5xl">M</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl leading-none">Y</p>
        <p className="text-xl leading-none">E</p>
      </div>
    </a>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
