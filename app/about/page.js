import About from '../components/About';
import { AuthProvider } from '@/utils/AuthContext';

const AboutPage = () => 
<AuthProvider>
    <About />
    </AuthProvider>;

export default AboutPage;