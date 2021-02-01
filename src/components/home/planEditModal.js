import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import { Switch } from '@headlessui/react'


import { AiOutlineClose } from 'react-icons/ai';
import { IoPricetagOutline } from 'react-icons/io5';



const PlanEditModal = (currentPlanData) => {
    console.log(JSON.parse(currentPlanData.role))

    const [availableRoles, setavailableRoles] = useState([])
    const [planName, setplanName] = useState("")
    const [planRole, setplanRole] = useState()
    const [unbinding, setunbinding] = useState(true)

    async function fetchPlans(){
        const res = await fetch('/discord/guild/roles');
        res.json()
        .then(res => {
            var currentRoles = JSON.parse(JSON.stringify(currentPlanData.role))
            setavailableRoles(res.roles)

            setplanRole(currentRoles)
        })
        .catch(err =>  {console.log(err)});
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchPlans()



        return () => {
            abortController.abort();
        };

    }, [])

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: localStorage.getItem('mode') }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          const color = chroma(data.color);
          return {
            ...styles,
            backgroundColor: isDisabled
              ? null
              : isSelected
              ? data.color
              : isFocused
              ? color.alpha(0.1).css()
              : null,
            color: isDisabled
              ? '#ccc'
              : isSelected
              ? chroma.contrast(color, 'white') > 2
                ? 'white'
                : 'black'
              : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',
      
            ':active': {
              ...styles[':active'],
              backgroundColor:
                !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
            },
          };
        },
        multiValue: (styles, { data }) => {
          const color = chroma(data.color);
          return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: data.color,
          ':hover': {
            backgroundColor: data.color,
            color: 'white',
          },
        }),
      };
    const colourStyle = {
        control: styles => ({ ...styles, backgroundColor: localStorage.getItem('mode') }),

    }


    
    const submitHandler = async (e) => {
        e.preventDefault()

        if(planName.length > 0) {
            var response = await fetch('/plans/add', {
                method:'post',
                body:JSON.stringify({
                    
                }),
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            if(response.ok) {

                return
            }else{
                return
            }
        }
        else{
            return;
        }
    }

        
        return (
                <div className="fixed z-10 inset-0 overflow-y-auto hidden" id="plan-modal-edit">
            
                    <form onSubmit={submitHandler}>
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-darkOther-200" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        
                                <div>
                                    <button type="button" onClick={() => {
                                        document.querySelector('#plan-modal-edit').classList.contains('hidden') ? document.querySelector('#plan-modal-edit').classList.remove('hidden') : document.querySelector('#plan-modal-edit').classList.add('hidden')
                                    }}><AiOutlineClose className="text-red-500 h-6 w-6 " id='hide' /></button>


                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            
                                    
                                    <IoPricetagOutline className="h-6 w-6 text-green-600 select-none" id='hide'/>
                                </div>
        

                                <div className="mt-3 text-center sm:mt-5">  
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white select-none" id="modal-headline">
                                    Edit Plan
                                    </h3>
        
                                    <div className="mt-2">
                                        
                                        <div>

                                            <fieldset className="mt-2 bg-white dark:bg-darkOther-200">
                                                <div className="md:grid md:grid-cols-2">
                                                <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Plan Name</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                            <label className="block text-sm font-medium text-gray-700"></label>
                                                            <input  name="planName" id="name" autoComplete="off" className="dark:text-white dark:bg-darkOther-200 focus:ring-other-200 focus:border-other-200 block w-full font-medium text-md rounded-md py-2 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200" 
                                                            placeholder="Member" value={currentPlanData.planName} onChange={e => setplanName(e.target.value)} />                                                         
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Type</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                                <label className="sr-only">type</label>
                                                                
                                                                <Select isDisabled defaultValue={{"label":currentPlanData.type, "value":currentPlanData.type}} styles={colourStyle} placeholder="Plan Type" id="type" name="planType" className="focus:ring-other-200 focus:border-other-200 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md dark:focus:border-darkOther-200 dark:focus:ring-darkOther-200"/>
                                                            </div>
                                                        </div>
                                                    </div>
                
                                                </div>
                
                                            </fieldset>

                                            {currentPlanData.type == "recurring" ?  <fieldset className="mt-2 bg-white dark:bg-darkOther-200">
                                                <div className="md:grid md:grid-cols-2">
                                                <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Interval</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div className="mt-1 flex rounded-md shadow-sm -space-y-px">
                                                                <span className="inline-flex items-center px-3 rounded-l-md border-r-2 border-gray-200 bg-gray-50 text-gray-800 sm:text-sm mr-2 dark:bg-darkOther-100 dark:text-white select-none">
                                                                    every
                                                                </span>
                                                                <input isDisabled name="interval" id="interval" type="text" placeholder="Count" autoComplete="off" className="dark:text-white dark:bg-darkOther-200 block w-full font-medium text-md rounded-md py-2 " value={currentPlanData.interval}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Interval Type</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                                <label className="sr-only select-none">Interval Type</label>
                                                                
                                                                <Select isDisabled styles={colourStyle} id="type" defaultValue={{"label":currentPlanData.intervalType, "value":currentPlanData.intervalType}}  name="intervalType" placeholder="Interval" 
                                                                className="focus:ring-other-200 focus:border-other-200 relative block w-full rounded-none rounded-t-md focus:z-10 font-medium text-md dark:focus:border-darkOther-200 dark:focus:ring-darkOther-200"/>
                                                            </div>
                                                        </div>
                                                    </div>
                
                                                </div>
                
                                            </fieldset> : <div></div> }

                           
                                        

                                            <fieldset className="mt-4 bg-white dark:bg-darkOther-200">
                                                <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Price</legend>
                                                <div className="mt-1 bg-white rounded-md shadow-sm dark:bg-darkOther-200">
                                                    <div>
                                                        <div className="mt-1 relative rounded-md shadow-sm">
                                                            <input isDisabled type="text" name="price" id="price" className="dark:text-white dark:bg-darkOther-200 focus:ring-other-200 focus:border-other-200 block w-full font-medium text-md  rounded-md py-2 dark:focus:border-darkOther-200 dark:focus:ring-darkOther-200" 
                                                            placeholder="0.00" value={currentPlanData.price}/>

                                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                                <label className="sr-only">Currency</label>
                                                                <Select isDisabled styles={colourStyle}  id="type" name="priceCurrency" placeholder="Currency" className="px-3 w-48 dark:bg-darkOther-200"
                                                                defaultValue={{"label":currentPlanData.currency, "value":currentPlanData.currency}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </fieldset>
        
                                            <fieldset className="mt-2 bg-whit dark:bg-darkOther-200" id="interval-fieldset">
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">Roles</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                                <label className="sr-only">roles</label>
                                                                <Select id="roles" defaultValue={JSON.parse(currentPlanData.role)} isMulti placeholder="Roles" name="roles" closeMenuOnSelect={false} styles={colourStyles} name="planRole" isSearchable components={makeAnimated()} options={availableRoles} className="focus:ring-other-200 focus:border-other-200 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md dark:focus:border-darkOther-200 dark:focus:ring-darkOther-200"
                                                                    onChange={e => setplanRole(e)} />
                                                                                                                                    
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                            
                                            </fieldset>

                                            <fieldset className="mt-2 bg-white dark:bg-darkOther-200" id="interval-fieldset">
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left dark:text-gray-300 select-none">{unbinding ? "Unbinding Enabled" : "Unbinding Disabled"}</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div className="text-left">
                                                                <label className="sr-only">allow unbinding</label>
                                                                <Switch 
                                                                checked={unbinding}
                                                                onChange={e => setunbinding(e)}
                                                                as="button" 
                                                                className={`${unbinding ? "bg-green-400" : "bg-gray-200"} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}>

                                                                    {unbinding ? 
                                                                    <span aria-hidden="true" className="pointer-events-none translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span> : 
                                                                    <span aria-hidden="true" className="pointer-events-none translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                                                    }

                                                                </Switch>
                                                                            
                                                                                                                                    
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                            
                                            </fieldset>
        
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button  name="license-modal" type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-other-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-other-200 sm:text-sm dark:focus:ring-darkOther-200 dark:hover:bg-darkOther-200 dark:bg-darkOther-100">
                                    Update
                                </button>
                            </div>

                        </div>
                    
                    </div>
                    </form>
            </div>

        )

}
export default PlanEditModal