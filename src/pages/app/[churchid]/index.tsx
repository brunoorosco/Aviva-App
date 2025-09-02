import StepProgressBar from '@/components/StepProgressBar'

const IndexApp = () => {
  return (
    <div>
      <div>Imagem da Visão</div>
      <div className='flex flex-col justify-center text-center'>
        <h2 className='font-semibold text-2xl my-6'>
          T.M.A.C. - Treinamento Ministerial Avivamento em Cristo
        </h2>
        <StepProgressBar
          steps={[
            { label: 'CEMs', ok: true },
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
