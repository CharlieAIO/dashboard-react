import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

import { AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai';


const RestockModal = () => {
    const [plans, setPlans] = useState([])
    const [password, setPassword] = useState("")
    const [stock, setStock] = useState("")
    const [restockPlan, setRestockPlan] = useState("")
    const [planName, setPlanName] = useState("")

    async function fetchPlans(){
        const res = await fetch('/plans/data');
        res.json()
        .then(res => {setPlans(res)})
        .catch(err =>  fetchPlans());
        
    }

    useEffect(() =>{
        var abortController = new AbortController();
        fetchPlans()

        setInterval(() => {
            abortController = new AbortController();
            fetchPlans()
        }, 5000);


        return () => {
            abortController.abort();
        };

    }, [])

    const colourStyle = {
        control: styles => ({ ...styles, backgroundColor: localStorage.getItem('mode') }),

    }




    const submitHandler = async (e) => {
        e.preventDefault()
        
        try{
            if(password.length > 0 && stock.length > 0) {
                await fetch('/restocks/add', {
                    method:'POST',
                    body:JSON.stringify({
                        password:password,
                        stock:parseInt(stock),
                        stockRemaining:parseInt(stock),
                        planId:restockPlan,
                        restockMethod:'regular',
                        id:uuidv4(),
                        planName:planName
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then(response => {
                    console.log(document.querySelector('#button-create').classList)
                    document.querySelector('#button-create').classList.remove('bg-other-200')
                    document.querySelector('#button-create').classList.remove('hover:bg-other-300')
                    document.querySelector('#button-create').classList.remove('dark:bg-darkOther-200')
        
                    document.querySelector('#button-create').classList.add('bg-green-500')
                    document.querySelector('#button-create').classList.add('hover:bg-green-600')

                    setPlans([])
                    setPassword("")
                    setStock("")
                    setRestockPlan("")
                }).catch(err => console.log(err))
            }else{
                return
            }
        }catch(err){
            console.log(err)
            return;
        }

    }



        return (
            <div className="fixed z-10 inset-0 overflow-y-auto hidden" id="restock-modal">

                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <form onSubmit={submitHandler}>
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>


                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-darkOther-200" role="dialog" aria-modal="true" aria-labelledby="modal-headline">

                    <div>

                    <button type="button" onClick={() => {
                        document.querySelector('#button-create').classList.remove('bg-other-200')
                        document.querySelector('#button-create').classList.remove('dark:bg-darkOther-200')
                        document.querySelector('#button-create').classList.remove('hover:bg-other-300')
            
                        document.querySelector('#button-create').classList.remove('bg-green-500')
                        document.querySelector('#button-create').classList.remove('hover:bg-green-600')

                        document.querySelector('#restock-modal').classList.contains('hidden') ? document.querySelector('#restock-modal').classList.remove('hidden') : document.querySelector('#restock-modal').classList.add('hidden')
                    }}><AiOutlineClose className="text-red-500 h-6 w-6" /></button>
                        

                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">


                            <AiOutlineShoppingCart className="h-6 w-6 text-green-600 select-none"/>

                    </div>

                    <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white select-none" id="modal-headline">
                          Create a Restock
                        </h3>

                        <div className="mt-2">

                            <div>
                                <fieldset >
                                    <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Password</legend>
                                    <div className="mt-1 bg-white rounded-md shadow-sm dark:bg-darkOther-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"></label>
                                            <input  name="password" id="password" autoComplete="off" className="dark:bg-darkOther-200 focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 block w-full font-medium text-md rounded-md py-2" placeholder="passsword" onChange={e => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="mt-2 bg-white dark:bg-darkOther-200">
                                    <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Stock</legend>
                                    <div className="mt-1 rounded-md shadow-sm ">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700"></label>
                                            <input  name="stock"  autoComplete="off" className="dark:bg-darkOther-200 focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 block w-full font-medium text-md rounded-md py-2" placeholder="10" onChange={e => setStock(e.target.value)} />
                                        </div>
                                    </div>
                                </fieldset>
  
  

                                <fieldset className="mt-2 bg-white dark:bg-darkOther-200">
                                    <div className="mt-1 bg-white rounded-md shadow-sm dark:bg-darkOther-200">
                                        <div>
                                            <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Plan</legend>
                                            <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                <div>
                                                    <label className="sr-only select-none">Plan</label>
                                                    <Select name="restockPlan" value={restockPlan.value} options={plans} styles={colourStyle} className="focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md" onChange={(e)=> { 
                                                        setRestockPlan(e.value)
                                                        setPlanName(e.label)
                                                    }}/>
                                                    

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button type="submit" id="button-create" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-other-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-other-200 sm:text-sm dark:focus:ring-darkOther-200 dark:hover:bg-darkOther-200 dark:bg-darkOther-100">
                    Create
                  </button>
                </div>

            </div>
            </form>
            </div>
            </div>

        )


}
export default RestockModal