import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ProgressBar from "@ramonak/react-progress-bar";



import { AiOutlineDelete, AiOutlineCopy } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';



const RestockTable = () => {
    const [restocks, setRestocks] = useState([])

    async function fetchRestocks(){
        const res = await fetch('/api/v1/restocks');
        res.json()
        .then(res => {setRestocks(res);})
        .catch(err =>  {console.log(err)});
        
    }

    useEffect(() =>{
        var abortController = new AbortController();
        fetchRestocks()
        

        setInterval(() => {
            abortController = new AbortController();
            fetchRestocks()
        }, 5000);


        return () => {
            abortController.abort();
        };

    }, [])

    const deleteRestock = async (id) => {
        var response = await fetch('/api/v1/restocks/delete/' + id, {
            method:'get',
            headers: {
                authorization:1
            }
        })
        if(response.ok) {
            return
        }else{
            return
        }
    }


    const renderTableRows = () => {
        return restocks.map(restock => {
            return (
                <tr key={restock.id}>

                    <td className="px-6 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center lg:pl-2">
                            {/* <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-600" aria-hidden="true"></div> */}
                                <a href="#" className="truncate">
                                {restock.planId}
                                </a>
                        </div>
                    </td>

                    <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                        <div className="flex items-center space-x-2">

                        <span className="flex-shrink-0 text-xs leading-5 font-medium w-full"><ProgressBar bgcolor='#4f46e5' completed={(100 * restock.stockRemaining) / restock.stock} /></span>
                        </div>
                    </td>

                    <td className="pr-6">
                        <div className="relative flex justify-end items-center">
                            <button id="restock-options-button-hide" name="restock-options-dropdown" aria-haspopup="true" type="button" aria-expanded="true" className="w-8 h-8 inline-flex items-center justify-center text-gray-800 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={() => {
                                document.querySelector('#restock-options-dropdown-' + restock.id).classList.contains('hidden') ? document.querySelector('#restock-options-dropdown-' + restock.id).classList.remove('hidden') : document.querySelector('#restock-options-dropdown-'  + restock.id).classList.add('hidden')
                            }}>
                            <BsThreeDots className="h-4 w-4" id='hide'/>
                            </button>

                            <div id={"restock-options-dropdown-" + restock.id} className="hidden mx-3 mr-10 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="project-options-menu-0">
                                <div className="py-1" role="none">
                                    <CopyToClipboard href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" text={`${window.location.origin}/?password=${restock.password}`} onCopy={() =>
                                    document.querySelector('#copy-hide-' + restock.id).classList.add('text-green-500')}>
                                    <button className="w-full" type='button' id={"restock-options-dropdown-copy-" + restock.id}>
                                        <AiOutlineCopy className="mr-3 h-5 w-5 text-gray-400" id={'copy-hide-'+ restock.id}/>
                                        Copy Link
                                    </button>
                                    </CopyToClipboard>

                                    <button type='button' className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => deleteRestock(restock.id)} >
                                        <AiOutlineDelete className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" onClick={() => deleteRestock(restock.id)}/>
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

            <table className="bg-white w-full overflow-y-auto mt-2 rounded-md" id='table'>

                <thead className="bg-gray-200 rounded-md">
                    <tr className="border-gray-200">

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="lg:pl-2">Plan</span>
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widerr">
                        Stock
                    </th>

                    <th className="md:table-cell px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Options
                    </th>

                    </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200 w-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )


}
export default RestockTable