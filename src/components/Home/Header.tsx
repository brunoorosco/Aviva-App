import Image from "next/image";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import NameSaas from "./nameSaas";
import logoLlaranja from '@/public/logo-laranja.png'
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg 
              viewBox="0 0 40 40" 
              className="w-6 h-6 text-orange-500"
              fill="currentColor"
            >
              <path d="M20 5C20 5 25 12 25 18C25 22 23 25 20 28C17 25 15 22 15 18C15 12 20 5 20 5Z" />
              <ellipse cx="20" cy="32" rx="12" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div> */}
          <Image
            src={logoLlaranja} 
            alt="Logo" 
            width={60} // Ajuste conforme necessário
            height={40} 
            className="object-contain"
          />
        <NameSaas/>
        </div>

        {/* Login Button */}
        <Button 
          variant="outline" 
          className="border-orange-500/50 text-orange-500 hover:bg-orange-500 bg-black hover:text-primary-foreground transition-all duration-300"
          style={{ boxShadow: '0 0 60px hsl(24 95% 53% / 0.4)' }}
          onClick={()=>{router.push('/login')}}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Entrar
        </Button>
      </div>
    </header>
  );
};

export default Header;