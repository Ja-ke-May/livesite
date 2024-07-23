import Contact from "../components/Contact";
import { AuthProvider } from "@/utils/AuthContext";

const ContactPage = () => 
<AuthProvider>
    <Contact />
    </AuthProvider>;

export default ContactPage;