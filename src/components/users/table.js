import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';


const LicenseTable = () => {
    const [users, setUsers] = useState([])

    async function fetchUsers(){
        const res = await fetch('/api/v1/users');
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
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={user.discordImage} alt="" />
                            </div>

                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.discordName}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {user.discordId}
                                </div>
                                
                            </div>
                        </div>

                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-mono">{user.key}</div>
                        <div className="text-sm text-gray-500">{user.keyType}</div>
                    </td>
             

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        XXX
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-indigo-600 hover:text-indigo-900"></span>
                    </td>

                </tr>
            )
            
        })
    }



    return (

            <table className="bg-white w-full overflow-y-auto" id="table" id='table'>

                <thead className="bg-gray-200">

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
                
                <tbody className="bg-white divide-y divide-gray-200 min-h-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )


}
export default LicenseTable