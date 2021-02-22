import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import UserNav from '../userNav'
import BounceLoader from "react-spinners/BounceLoader";
import Checkout from './checkout'





const PurchasePage = () => {

    const [loaded, setLoaded] = useState(false)
    const [stock, setStock] = useState(0)
    const [name, setName] = useState("Purchase")


    async function fetchData(){
        const res = await fetch('/restocks/get/' + localStorage.getItem('pswd'));
        res.json()
        .then(res => {
            setStock(parseInt(res.stockRemaining))
            setName(res.name)
            if((res.bg == "empty" ) || (res.bg == undefined )  || (res.bg == null )) {
                document.querySelector('#baseBackground').classList.add('bg-darkOther-300')
                document.querySelector('#baseBackground').style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");`
                
            } else {
                document.querySelector('#baseBackground').style = `background-repeat: no-repeat; background-image: url('${res.bg}'); background-attachment: fixed; background-size: cover; background-size: 100% 100%;`
            }
            setLoaded(true)
        })
        .catch(err =>  {
            document.querySelector('#baseBackground').classList.add('bg-darkOther-300')
            document.querySelector('#baseBackground').style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");`
            var interval;
            if(res.status == 404) {
                setStock(0)
                clearInterval(interval)
                setLoaded(true)
            }
            if(res.status == 400) {
                clearInterval(interval)
                setLoaded(true)
                setStock(0)
            }
            else{
                interval = setInterval(() => {
                    fetchData()
                }, 1500);
            }
        });
        
    }

    async function fetchData2(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {
            if(res.status == 403 || res.status == 400) window.location = '/discord/oauth'
            else{}
            
        })
        .catch(err =>  { 
            if(res.status == 403 || res.status == 400) window.location = '/discord/oauth'
        });
        
    }


    useEffect(() =>{
        const abortController = new AbortController();
        localStorage.setItem('pswd',window.location.search.split('?password=')[1])
        fetchData2()
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
                                <h1 className="text-lg font-medium text-gray-700 select-none">{name}</h1>
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
                                        <h1 className="text-8xl font-bold text-darkOther-200 select-none">OOS</h1>
                                    </div>

                                </div>
                                }
                            </div> 



                                
                            </div>
                        </div>

                        </div> : <div className="m-auto">
                        
                        <BounceLoader color={'#302f2f'} loading={true} size={25} />
                        
                        </div>


                    }

                </div>


            </>
        );

}

export default PurchasePage;
