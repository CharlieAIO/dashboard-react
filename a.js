
import React, { useState, useEffect } from 'react';

const [name, setName] = useState("")

const submitHandler = async (e) => {
        e.preventDefault()

        if(key.length > 0) {
            await fetch('/send', {
                method:'post',
                body:JSON.stringify({
                    name:name
                }),
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            
        }
        else{
            return;
        }
}

<form onSubmit={submitHandler}>
    <div class="mt-1 flex rounded-md shadow-sm">

        <div class="relative flex items-stretch flex-grow focus-within:z-10">
    
            <input value={name} onChange={e => setName(e.target.value)} type="text" name="key" id="key" autoComplete="off" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" placeholder="XXX-XXX-XXX-XXX-XXX" />
        </div>

        <button type="submit" class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            Submit
        </button>

    </div>
</form>