import { MapPin, Phone, Church, MessageCircle } from "lucide-react";
import NameSaas from "./nameSaas";

const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg 
                  viewBox="0 0 40 40" 
                  className="w-6 h-6 text-orange-500"
                  fill="currentColor"
                >
                  <path d="M20 5C20 5 25 12 25 18C25 22 23 25 20 28C17 25 15 22 15 18C15 12 20 5 20 5Z" />
                  <ellipse cx="20" cy="32" rx="12" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            <NameSaas/>
            </div>
            <p className="text-muted-foreground text-sm">
              Transformando a gestão da sua igreja com tecnologia e inovação.
            </p>
          </div>

          {/* Nossas Igrejas */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Church className="w-5 h-5 text-orange-500" />
              Nossas Igrejas
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Sede</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Guarulhos</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Sapopemba</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Itaqua 1</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Itu</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Suzano</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Itaqua 2</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Avivamento Curitiba</li>
            </ul>
            <p className="text-orange-500 font-semibold mt-3 text-sm">+ 5 igrejas conectadas</p>
          </div>

          {/* Endereço Sede */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Sede Principal
            </h4>
            <address className="text-muted-foreground text-sm not-italic space-y-1">
              <p>Av. Principal, 1000</p>
              <p>Centro - São Paulo, SP</p>
              <p>CEP: 01000-000</p>
            </address>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              Contato
            </h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-black/30 rounded-lg hover:bg-orange-500/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                    WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground">(11) 99999-9999</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Orostec. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
