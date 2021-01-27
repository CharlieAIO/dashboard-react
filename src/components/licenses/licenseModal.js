import '../../static/styles/main.css'; 
import React, { useState,useEffect } from 'react';
import { AiOutlineClose, AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import Select from 'react-select';

const LicenseModal = () => {

    const [email, setEmail] = useState("")
    const [plan, setPlan] = useState("")
    const [availablePlans, setAvailablePlans] = useState([])



    async function fetchPlans(){
        const res = await fetch('/api/v1/plans/data');
        res.json()
        .then(res => {setAvailablePlans(res)})
        .catch(err =>  {});
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchPlans()


        return () => {
            abortController.abort();
        };

    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        
        try{

            if(email.length > 0 && plan.length > 0) {

    
                await fetch('/api/v1/users/add', {
                    method:'POST',
                    body:JSON.stringify({
                        plan:plan,
                        discordId:123456789,
                        discordName:"empty",
                        discordImage:"https://variety.com/wp-content/uploads/2018/05/discord-logo.jpg",
                        email:email,
                        customerId:"empty",
                        subscriptionId:"empty",
                        expiryDate:0,
                        machineId:"empty",

                    }),
                    headers: {
                        "Content-Type": "application/json",
                        authorization:1
                    }
                })
                .then(response => {

                    setPlan("")
                    setEmail("")
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
        <div className="hidden fixed z-10 inset-0 overflow-y-auto" id="license-modal">
    
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>


                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <form onSubmit={submitHandler}>
                    <div>

                    <button onClick={() => {
                        document.querySelector('#license-modal').classList.contains('hidden') ? document.querySelector('#license-modal').classList.remove('hidden') : document.querySelector('#license-modal').classList.add('hidden')
                    }}><AiOutlineClose className="text-red-500 h-6 w-6" /></button>

                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <AiOutlineUser className="h-6 w-6 text-green-600" />
                        </div>

                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                Create a license...
                            </h3>

                            <div className="mt-2">


                                <div>

                                    <fieldset >
                                        <legend className="block text-sm font-medium text-gray-700">Email</legend>
                                        
                                        <div className="mt-1 bg-white rounded-md shadow-sm ">
                                            <div>
                                                <label  className="block text-sm font-medium text-gray-700"></label>
                                                
                                                <div className="mt-1 relative rounded-md shadow-sm">

                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                                        <AiOutlineMail className="h-5 w-5 text-gray-400"/>

                                                    </div>

                                                    <input  name="email" id="email" autoComplete="off" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="you@example.com" onChange={e => setEmail(e.target.value)} />
                                                
                                                </div>
                                
                                            </div>

                                        </div>
                                    </fieldset>

                                    <fieldset className="mt-6 bg-white">
                                        <legend className="block text-sm font-medium text-gray-700">Plan</legend>
                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                            <div>
                                                <label className="sr-only">plans</label>
                                                <Select name="restockPlan" value={availablePlans.value} options={availablePlans} className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md" onChange={(e)=> { setPlan(e.value)}}/>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <button name="license-modal" type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                            Create
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )


}
export default LicenseModal