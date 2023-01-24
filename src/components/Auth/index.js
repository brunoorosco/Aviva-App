import React from 'react'


export default function Auth() {

    function handleSubmit() {

    }
    return (
        <div className='container-fluid mx-auto'>

            <div className='flex h-screen bg-zinc-700 '>

                <div className='bg-cover bg-right w-2/3'>
                    <img src='/lg-banner.png' className='h-full' />
                </div>

                <div className='flex flex-col w-1/3 justify-center h-screen items-center'>
                    <div className='block'>
                        <img src='/logo.png' width='70%' className='mx-auto'  />
                    </div>

                    <div className='block w-2/3'>
                        <input type="text" placeholder='Email'
                            className='p-3 mt-3 text-1xl border rounded min-w-full text-gray-700' />
                    </div>
                    <div className='block w-2/3'>
                        <input type="password" placeholder='Password'
                            className='p-3 mt-3 text-1xl border rounded min-w-full text-gray-900' />
                    </div>
                    <div className='block w-2/3'>
                        <button onClick={handleSubmit}
                            className='p-3 text-1xl text-center border rounded border-green-700 
                                    hover:bg-green-500 bg-lime-500 mt-3 min-w-full'>
                            Entrar
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}