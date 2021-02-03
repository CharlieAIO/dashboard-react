import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import UserNav from '../userNav'
import { IoKeyOutline } from 'react-icons/io5'
import { BiLogInCircle } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import SquareLoader from "react-spinners/SquareLoader";
import Checkout from './checkout'






const PurchasePage = () => {

    const [loaded, setLoaded] = useState(false)
    const [stock, setStock] = useState(0)


    async function fetchData(){
        const res = await fetch('/restocks/get/' + localStorage.getItem('pswd'));
        res.json()
        .then(res => {
            setStock(parseInt(res.stockRemaining))
            setLoaded(true)
        })
        .catch(err =>  {
            var interval;
            if(res.status == 404) {
                setStock(0)
                clearInterval(interval)
                setLoaded(true)
            }else{
                interval = setInterval(() => {
                    fetchData()
                }, 1500);
            }
        });
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        localStorage.setItem('pswd',window.location.search.split('?password=')[1])
        fetchData()

        return () => {
            abortController.abort();
        };

    }, [])


        return (
            <>
                <div className="flex flex-col w-0 flex-1 overflow-y-auto">
                    <UserNav />
                    
                    {
                        loaded ? <div className="m-auto">

                        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200" style={{"minWidth":"500px"}}>
                            <div className="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700">VenetiaCLI</h1>
                            </div>
                            <div className="px-4 py-5 sm:p-6">

                           
                            <div>
                                {stock > 0 ? 
                                <div className="mt-1 flex rounded-md shadow-sm w-full">

                                    <Checkout />

                                </div>
                                : 
                                <div className="mt-1 flex rounded-md w-full">

                                    <div className="w-full text-center">
                                        <h1 className="text-4xl font-medium text-gray-700">OOS</h1>
                                    </div>

                                </div>
                                }
                            </div> 



                                
                            </div>
                        </div>

                        </div> : <div className="m-auto">
                        
                        <SquareLoader color={'#302f2f'} loading={true} size={25} />
                        
                        </div>


                    }

                </div>


            </>
        );

}

export default PurchasePage;
