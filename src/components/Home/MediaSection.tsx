import { Play, Instagram, Facebook, Youtube } from "lucide-react";

const mediaItems = [
  {
    type: "youtube",
    title: "Culto de Celebração",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    url: "https://www.youtube.com/@AvivamentoemCristoTV/streams",
  },
  {
    type: "youtube", 
    title: "Palavra da Semana",
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80",
    url: "#",
  },
  {
    type: "instagram",
    title: "Momentos da Igreja",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80",
    url: "#",
  },
  {
    type: "facebook",
    title: "Fotos do Culto",
    thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80",
    url: "#",
  },
];

const MediaSection = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-black relative">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
            Acompanhe Nossa <span className="text-orange-500">Jornada</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Vídeos, lives e conteúdos exclusivos das nossas redes sociais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="group bg-black/60 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center" style={{ boxShadow: '0 0 60px hsl(24 95% 53% / 0.4)' }}>
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  {getIcon(item.type)}
                  <span className="text-sm capitalize">{item.type}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-12">
          <a
            href="https://www.youtube.com/@AvivamentoemCristoTV"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-muted-foreground hover:bg-orange-500 hover:text-primary-foreground transition-all duration-300"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/avivamento.sede"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-muted-foreground hover:bg-orange-500 hover:text-primary-foreground transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.facebook.com/avivamentoemcristosede"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-muted-foreground hover:bg-orange-500 hover:text-primary-foreground transition-all duration-300"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
