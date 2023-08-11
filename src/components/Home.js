import '../App.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import useSound from 'use-sound';
// import moneySound from '../sound/moneysound.mp3'
import cheer from '../sound/cheer.mp3'
import { load as loadData } from '../utils/store';


const parseAmount = (amount) => {
    // Receives a number and return a string in monetary form

    return new Intl.NumberFormat("en-US", {
        style: "decimal",
    }).format(amount);
}


function Home() {
    // const [audio] = useState(new Audio(moneySound));
    const [play, { isPlaying, stop }] = useSound(cheer, {playbackRate: 0.9});
    // const [cheerAudio] = useState(new Audio(cheer))
    const [payments, setPayments] = useState(() => loadData());
    const previousTotal = useRef(null);

    useEffect(() => {

        const intervalId = setInterval(()=>{
            const data = loadData();
            // console.log("Loaded:", data);
            setPayments(()=>data);
        }, 1500)

      return () => {
        clearInterval(intervalId);
      };
    }, [])

    useEffect(()=>{
        console.log("Updated!");
    },[payments])
    
    // Calculate total
    const totalPayments = useMemo(()=>{
        return payments.reduce((accumulator, payment) => accumulator + Number(payment.amount), 0);
    },[payments]);
    
    try{
        
        if (previousTotal.current === null){
            previousTotal.current = totalPayments;
        }
        else if ((previousTotal.current !== null) && (previousTotal.current < totalPayments)){
            // console.log("Total changed!")
            if (isPlaying){
                stop();
            }
            play()
        }
    } catch(error) {
        console.log("Could not check payment update");
    }
    finally {
        previousTotal.current = totalPayments;
    }

    return (
        <div className="App background-image">
            <div className=' ' style={{ fontFamily: 'Poppins' }}>

                {/* <h2 className='font-normal'>Visualización de la base de datos de pagos</h2> */}

                <div className='cust-header gap-4'>
                    <div className='flex mt-4 justify-between font-semibold text-2xl px-3 bg-slate-300 border rounded py-2'>
                        <div className='w-[45%] text-center'><h2>Nombre</h2></div>
                        <div className='w-[45%] text-center'><h2>VENTAS</h2></div>
                    </div>

                    <div className='flex mt-4 justify-between font-semibold text-2xl px-3 bg-slate-300 border rounded py-2'>
                        <div className='w-[45%] text-center'><h2>Nombre</h2></div>
                        <div className='w-[45%] text-center'><h2>VENTAS</h2></div>
                    </div>
                </div>

                <div id='list-container'  className='my-1 w-[100%] cust-dis'>
                    {payments.map((user, index) => (

                        <div 
                            key={index} 
                            className={`flex bg-slate-50 opacity-75 italic px-3 py-1 justify-between border rounded items-center`}>
                            <div>{index + 1}</div>
                            <div className='w-[45%] text-center text-capitalize'>{user.name}</div>
                            <div className='w-[45%] text-center'><span className='text-[green]'>$</span> {parseAmount(user.amount)}</div>
                        </div>
                    ))}
                </div>

                <div className='flex cust-footer mt-2 justify-between font-semibold text-2xl px-3 bg-slate-300 border rounded py-2'>
                    <div className='w-[45%] text-center'><h2>TOTAL</h2></div>
                    <div className='w-[45%] text-center'><h2><span className='text-[green] text-2xl'>$</span> {parseAmount(totalPayments)}</h2></div>
                </div>

            </div>
        </div>
    );
}

export default Home;
