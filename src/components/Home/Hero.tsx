import heroBg from "@/assets/images/home.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg.src})` }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, hsl(0 0% 4% / 0.3) 0%, hsl(0 0% 4% / 0.7) 50%, hsl(0 0% 4% / 0.95) 100%)' }}
      />
      
      {/* Animated glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 mt-64">
       
        
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mt-16 mb-8">
            Conectando igrejas, transformando vidas. Uma plataforma completa para gestão e crescimento da sua comunidade.
          </p>
        </div>

        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.8s' }}>
          <button 
            className="px-8 py-4 bg-orange-500 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:bg-orange-500/90"
            style={{ boxShadow: '0 0 60px hsl(24 95% 53% / 0.4)' }}
          >
            Começar Agora
          </button>
          <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/10">
            Saiba Mais
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
