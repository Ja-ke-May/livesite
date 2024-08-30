import Shop from "./components/Shop";
import { AuthProvider } from '@/utils/AuthContext';

const ShopPage= () => 
<AuthProvider>
<Shop />
    </AuthProvider>;

export default ShopPage;