import StepProgressBar from '@/components/StepProgressBar'

const IndexApp = () => {
  return (
    <div className="flex flex-col items-center px-4 sm:px-8">
      {/* Imagem da Visão */}
      <div className="w-full max-w-8xl mb-6">
        <img
          src="/path-to-image.jpg" // Substitua pelo caminho da sua imagem
          alt="Visão"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      {/* Título e barra de progresso */}
      <div className="flex flex-col justify-center text-center w-full max-w-8xl">
        <h2 className="font-semibold text-2xl my-6">
          T.M.A.C. - Treinamento Ministerial Avivamento em Cristo
        </h2>

        <StepProgressBar
          steps={[
            { label: 'CEMs', ok: true },
            { label: 'Visita de Paz', ok: true },
            { label: 'Casa de Paz', ok: true },
            { label: 'Encontro com Deus', ok: true },
            { label: 'C.A.E.', ok: true },
            { label: 'Batismo', ok: true },
            { label: 'Seja Livre', ok: true },
            { label: 'Reencontro com Deus', ok: true },
            { label: 'Discipulado', ok: true },
            { label: 'Escola de Profeta', ok: true }
          ]}
        />
      </div>
    </div>
  )
}

export default IndexApp

