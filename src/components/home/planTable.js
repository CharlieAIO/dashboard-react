import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import currencyToSymbolMap from 'currency-symbol-map/map'



import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';


const PlanTable = () => {

    const [plans, setPlans] = useState([])

    async function fetchPlans(){
        const res = await fetch('/api/v1/plans');
        res.json()
        .then(res => {setPlans(res)})
        .catch(err =>  {});
        
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



    const deletePlan =  async (id) => {
        await fetch('/api/v1/plans/delete/' + id, {
            method:'get',
            headers: {
                'x-access-token':'Bearer ' + localStorage.getItem('token')
            }
        })

    }


    const renderTableRows = () => {
        return plans.map(plan => {
            return (
                <tr key={plan.id}>

                    <td className="px-6 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white dark:bg-darkOther-200">
                        <div className="flex items-center lg:pl-2">
                            {/* <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-600" aria-hidden="true"></div> */}
                            <a href="#" className="truncate">
                                {plan.planName}
                            </a>
                        </div>
                    </td>

                    <td className="px-6 py-3 text-sm text-gray-800 dark:text-white font-medium dark:bg-darkOther-200">
                        <div className="flex items-center space-x-2">
                            <span className="flex-shrink-0 text-xs leading-5 font-medium"> {currencyToSymbolMap[plan.currency]}{plan.price}</span>
                        </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800 font-medium dark:bg-darkOther-200 dark:text-white">
                        <div className="flex items-center space-x-2">
                            <span className="flex-shrink-0 text-xs leading-5 font-medium">{plan.intervalType}</span>
                        </div>
                    </td>


                    <td className="pr-6 dark:bg-darkOther-200 dark:text-white">
                        <div className="relative flex justify-end items-center">
                        <button id={`${plan.id}-plans-dropdown-button-hide`} name="plans-options-dropdown" aria-haspopup="true" type="button" aria-expanded="true" className="dark:text-white w-8 h-8 inline-flex items-center justify-center text-gray-800 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"  onClick={() => {
                            document.querySelector('#plans-options-dropdown-' + plan.id).classList.contains('hidden') ? document.querySelector('#plans-options-dropdown-' + plan.id).classList.remove('hidden') : document.querySelector('#plans-options-dropdown-' + plan.id).classList.add('hidden')
                        }}>
                            <BsThreeDots className="h-4 w-4" id={`${plan.id}-icon-hide`} />
                        </button>

                        <div id={`plans-options-dropdown-${plan.id}`} type="button" className="dark:bg-darkOther-200 hidden mx-3 mr-10 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="project-options-menu-0">
                            <div className="py-1" role="none">
                            <button id={`plans-edit-${plan.id}`} className="group flex items-center px-4 w-full py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-darkOther-300 dark:text-white" role="menuitem">
                            <AiOutlineEdit className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Edit
                            </button>
                            <button id={`plans-delete-${plan.id}`} type="button" className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-darkOther-300 dark:text-white" role="menuitem" onClick={() => deletePlan(plan.id)}>
                                <AiOutlineDelete className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" onClick={() => deletePlan(plan.id)}/>
                                Delete
                            </button>
                            </div>
                        </div>
                        </div>
                    </td>

                </tr>
            )
            
        })
    }
    



    return (

            <table className="bg-white w-full overflow-y-auto mt-2 rounded-md" id="table">

                <thead className="bg-gray-200 rounded-md dark:bg-darkOther-100">

                    <tr className="border-gray-200">

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="lg:pl-2"> Plan</span>
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interval
                        </th>


                        <th className="md:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Options
                        </th>

                    </tr>

                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-500 w-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )


}
export default PlanTable