import { MapPin, Phone, Church, MessageCircle } from "lucide-react";
import Image from "next/image";
import logoLlaranja from "@/public/logo-laranja.png";

const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logoLlaranja}
                alt="Logo"
                width={100} // Ajuste conforme necessário
                height={70}
                className="object-contain"
              />
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
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Sede
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Guarulhos
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Sapopemba
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Itaqua 1
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Itu
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Suzano
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Itaqua 2
              </li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">
                Avivamento Curitiba
              </li>
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
              <p>Av. dos Ipês, 1094</p>
              <p>Itaim Paulista - São Paulo, SP</p>
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
                href="https://wa.me/5511967380685"
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
                  <p className="text-xs text-muted-foreground">(11) 96738-0685</p>
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
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
