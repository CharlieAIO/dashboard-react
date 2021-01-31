import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';

import {FaUserCircle} from 'react-icons/fa'

const LicenseTable = () => {
    const [users, setUsers] = useState([])
    

    async function fetchUsers(){
        const res = await fetch('/users');
        res.json()
        .then(res => {setUsers(res)})
        .catch(err =>  {});
        
    }


    useEffect(() =>{
        var abortController = new AbortController();
        fetchUsers()


        setInterval(() => {
            abortController = new AbortController();
            fetchUsers()

        }, 5000);


        return () => {
            abortController.abort();
        };

    }, [])



    const renderTableRows = () => {
        return users.map(user => {
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
                    {user.dateJoined == 0 ? "Not joined" : new Date(user.dateJoined * 1000).constructor()}
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                        </th>
    
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                        </th>
    
                        <th scope="col" className="relative px-6 py-3">
                        </th>

                    </tr>

                </thead>
                
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )


}
export default LicenseTable