import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const ReadQrCode = (props: any) => {
    const [data, setData] = useState('No result');
    // useEffect(() => {
    //     alert('data')
    // }, [data]);

    return (
        <div className='bg-black'>
            <div className='md:w-full lg:w-1/4 justify-center mx-auto items-center h-screen flex flex-col'>
                <QrReader
                    onResult={(result: any, error: any) => {
                        if (!!result) {
                            setData(result?.text);
                        }

                        if (!!error) {
                            console.info(error);
                        }
                    }}
                    videoStyle={{ width: '100%', display: 'flex' }}
                    containerStyle={{ width: '100%' }}
                />
                <p className='text-white text-lg'>{data}</p>
            </div>
        </div>
    );
};
export default ReadQrCode