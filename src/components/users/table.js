import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';

import {FaUserCircle} from 'react-icons/fa'
import SquareLoader from "react-spinners/SquareLoader";


const LicenseTable = () => {
    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)
    

    async function fetchUsers(){
        const res = await fetch('/users');
        res.json()
        .then(res => {
            setUsers(res)
            setLoaded(false)
        })
        .catch(err =>  {});
        
    }


    useEffect(() =>{
        var abortController = new AbortController();
        fetchUsers()


        setInterval(() => {
            abortController = new AbortController();
            fetchUsers()

        }, 4000);


        return () => {
            abortController.abort();
        };

    }, [])



    const renderTableRows = () => {
        return users.map(user => {
            var date = new Date(user.dateJoined * 1000)
            return (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowra dark:bg-darkOther-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                            {user.discordImage == "" ? <FaUserCircle className="h-10 w-10 rounded-full bg-other-200 text-other-100" /> : <img className="h-10 w-10 rounded-full" src={user.discordImage} alt="" />}
                            
                            </div>

                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                {user.discordName == "empty" ? "Unbound" : user.discordName}
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                {user.discordId == 123456789 ? "Unbound" : user.discordId}
                                </div>
                                
                            </div>
                        </div>

                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-900 dark:text-gray-400">{user.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-700 font-mono dark:text-gray-400">{user.key}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">{user.keyType}</div>
                    </td>
             

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:bg-darkOther-200 dark:text-gray-400">
                    {user.dateJoined == 0 ? "Not joined" : 
                        `${date.getDate()} ${['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]}, ${date.getFullYear()}`
                    }
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium dark:bg-darkOther-200">
                        <span className="text-other-200 hover:text-indigo-900"></span>
                    </td>

                </tr>
            )
            
        })
    }



    return (

            <table className="w-full overflow-y-auto" id="table" id='table'>

                <thead className="bg-gray-200 dark:bg-darkOther-100">

                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                            User
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                            Email
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                            Key
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                            Joined
                        </th>
    
                        <th scope="col" className="relative px-6 py-3">
                        </th>

                    </tr>

                </thead>
                
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full">
                    {loaded ? renderTableRows() : 
                    <tr>
                        <td className="px-6 py-4 whitespace-nowra dark:bg-darkOther-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                <SquareLoader color={'#302f2f'} loading={true} size={25} />
                                
                                </div>

                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                    <SquareLoader color={'#302f2f'} loading={true} size={25} />
                                    </div>

                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                    <SquareLoader color={'#302f2f'} loading={true} size={25} />
                                    </div>
                                    
                                </div>
                            </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            <div className="text-sm text-gray-900 dark:text-gray-400"><SquareLoader color={'#302f2f'} loading={true} size={25} /></div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            <div className="text-sm text-gray-700 font-mono dark:text-gray-400"><SquareLoader color={'#302f2f'} loading={true} size={25} /></div>
                            <div className="text-sm text-gray-500 dark:text-gray-300"><SquareLoader color={'#302f2f'} loading={true} size={25} /></div>
                        </td>
                

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:bg-darkOther-200 dark:text-gray-400">
                        <SquareLoader color={'#302f2f'} loading={true} size={25} />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium dark:bg-darkOther-200">
                            <span className="text-other-200 hover:text-indigo-900"></span>
                        </td>

                    </tr>}
                </tbody>
                
            </table>

    )


}
export default LicenseTable