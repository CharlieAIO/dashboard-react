import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';


const Settings = () => {
    const [name, setName] = useState("")
    const [logo, setLogo] = useState("")
    const [description, setDescription] = useState("")
    const [loaded, setLoaded] = useState(false)
    
    async function fetchData(){
        const res = await fetch('/accounts/dashboard');
        res.json()
        .then(res => {
            setName(res[0].name)
            setLogo(res[0].branding.logoUrl)
            setDescription(res[0].description)
            setLoaded(true)
        })
        .catch(err =>  {
            fetchData()
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

            <div className="w-full bg-gray-50">
            <div className="w-full bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                    <a href="#">
                        <span className="sr-only">Workflow</span>
                        <img className="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-other-200.svg" alt="" />
                    </a>
                    </div>
                    <div className="-mr-2 -my-2 md:hidden">
                    <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open menu</span>
    
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    </div>

                </div>
                </div>


            
            </div>

            <main className="lg:relative">
                <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
                <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    <span className="block xl:inline select-none">welcome to</span>
                    <span className="block text-other-900 dark:text-darkOther-200 xl:inline select-none"> {loaded ? name : "Placeholder"}</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl select-none">
                    {loaded ? description : "..."}
                    </p>
                    <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                        <a href={'http://127.0.0.1:4000' + '/discord/oauth'} className="select-none dark:bg-darkOther-200 dark:hover:bg-darkOther-300 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-other-900 md:py-4 md:text-lg md:px-10">
                        Dashboard
                        </a>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <a href="/purchase" className="select-none w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-other-200 dark:text-darkOther-200 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                        Purchase
                        </a>
                    </div>
                    </div>
                </div>
                </div>
                <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
                <img className="absolute inset-0 px-24 m-auto" src={logo} alt="" />
                </div>
            </main>
            </div>

        
        </>
    )


}

export default Settings