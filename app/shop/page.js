import Shop from "./components/Shop";
import { AuthProvider } from '@/utils/AuthContext';

const ShopPage= () => 
<AuthProvider>
<Shop />
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
          
    </AuthProvider>;

export default ShopPage;