import Stars from "./components/Stars";
import { AuthProvider } from '@/utils/AuthContext';

const StarsPage = () => 
<AuthProvider>
<Stars />
    </AuthProvider>;

export default StarsPage;


