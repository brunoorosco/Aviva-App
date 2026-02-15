import { useIsMobile } from "@/hooks/use-mobile";

const IndexApp = () => {
  const isMobile = useIsMobile();
  return (
    <div className="h-screen w-screen overflow-hidden">
      <img
        src={isMobile ? "/ano_inovacao_quad.png" : "/ano_inovacao.png"}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default IndexApp;
