// Ejemplo de botones de compartir en redes sociales
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const SocialShare: React.FC = () => (
  <div className="flex justify-center space-x-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
      <FaFacebook className="text-2xl text-blue-600 hover:text-blue-800 transition" />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
      <FaTwitter className="text-2xl text-blue-400 hover:text-blue-600 transition" />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
      <FaInstagram className="text-2xl text-pink-600 hover:text-pink-800 transition" />
    </a>
  </div>
);

export default SocialShare;
