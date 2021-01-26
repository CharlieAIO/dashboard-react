import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import currencyOptions from '../../static/data/currencies.json'
import { Switch } from '@headlessui/react'

import { AiOutlineClose } from 'react-icons/ai';
import { IoPricetagOutline } from 'react-icons/io5';

var planOptions = [
    {label:'Recurring', value:'recurring'},
    {label:'Lifetime', value:'lifetime'},
    {label:'Rental', value:'rental'}
]
var intervalTypeOptions = [
    {label:'Day', value:'day'},
    {label:'Week', value:'week'},
    {label:'Month', value:'month'},
    {label:'Year', value:'year'}
]

const PlanModal = () => {

    const [availableRoles, setavailableRoles] = useState([])
    const [planName, setplanName] = useState("")
    const [planType, setplanType] = useState("")
    const [planRole, setplanRole] = useState([])
    const [price, setprice] = useState("")
    const [priceCurrency, setpriceCurrency] = useState("")
    const [interval, setinterval] = useState("")
    const [intervalType, setintervalType] = useState("")
    const [unbinding, setunbinding] = useState(true)


    async function fetchPlans(){
        const res = await fetch('/discord/guild/roles');
        res.json()
        .then(res => {setavailableRoles(res.roles)})
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
        control: styles => ({ ...styles, backgroundColor: 'white' }),
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


    
    const submitHandler = async (e) => {
        e.preventDefault()

        if(planName.length > 0 && planType.length > 0 && interval.length > 0) {
            var response = await fetch('/api/v1/plans/add', {
                method:'post',
                body:JSON.stringify({
                    planName:planName,
                    price:price,
                    currency:priceCurrency,
                    type:planType,
                    role:JSON.stringify(planRole),
                    interval:interval,
                    intervalType:intervalType,
                    planId:'',
                    id:'',
                    unbinding:unbinding
                }),
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            if(response.ok) {
                setavailableRoles()
                setinterval("")
                setintervalType("")
                setplanName("")
                setplanRole([])
                setplanType("")
                setprice("")
                setpriceCurrency("")
                setunbinding(true)

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
                <div className="fixed z-10 inset-0 overflow-y-auto hidden" id="plan-modal">
            
                    <form onSubmit={submitHandler}>
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        
                                <div>
                                    <button onClick={() => {
                                        document.querySelector('#plan-modal').classList.contains('hidden') ? document.querySelector('#plan-modal').classList.remove('hidden') : document.querySelector('#plan-modal').classList.add('hidden')
                                    }}><AiOutlineClose className="text-red-500 h-6 w-6" id='hide' /></button>


                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            
                                    
                                    <IoPricetagOutline className="h-6 w-6 text-green-600" id='hide'/>
                                </div>
        

                                <div className="mt-3 text-center sm:mt-5">  
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Create a Plan...
                                    </h3>
        
                                    <div className="mt-2">
                                        
                                        <div>

                                            <fieldset className="mt-2 bg-white">
                                                <div className="md:grid md:grid-cols-2">
                                                <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left">Plan Name</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                            <label className="block text-sm font-medium text-gray-700"></label>
                                                            <input  name="planName" id="name" autoComplete="off" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full font-medium text-md rounded-md py-2" 
                                                            placeholder="Member" value={planName} onChange={e => setplanName(e.target.value)} />                                                         
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left">Type</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                                <label className="sr-only">type</label>
                                                                <Select defaultValue={planOptions[0]}  placeholder="Plan Type" id="type" value={planType} name="planType" options={planOptions} className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md "
                                                                onChange={e => setplanType(e.value)} value={planOptions.filter(function(planOptions) {return planOptions.value === planType})}/>
                                                            </div>
                                                        </div>
                                                    </div>
                
                                                </div>
                
                                            </fieldset>

                                            {planType == "recurring" ? <fieldset className="mt-2 bg-white" id="interval-options">
                                                <legend className="block text-sm font-medium text-gray-700 text-left">Interval</legend>
                                                <div className="mt-1 bg-white rounded-md shadow-sm ">
                                                    <div>
                                                        <div className="mt-1 relative rounded-md shadow-sm">
                                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                                <span className="inline-flex items-center px-3 rounded-l-md border-r-2 border-gray-200 bg-gray-50 text-gray-800 sm:text-sm mr-2">
                                                                    every
                                                                </span>
                                                                <input name="interval" id="interval" type="number" placeholder="Interval Count" autoComplete="off" className="block w-full font-medium text-md rounded-md py-2 " value={interval} onChange={e => setinterval(e.target.value)}/>
                                                            </div>

                                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                                <label className="sr-only">Interval Type</label>
                                                                <Select defaultValue={intervalTypeOptions[3]}  id="type" value={intervalType} name="intervalType" options={intervalTypeOptions} placeholder="Interval" className="px-3 w-32"
                                                                onChange={e => setintervalType(e.value)} value={intervalTypeOptions.filter(function(intervalTypeOptions) {return intervalTypeOptions.value === intervalType})}/>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset> : <div></div>}
                                        

                                            <fieldset className="mt-4 bg-white">
                                                <legend className="block text-sm font-medium text-gray-700 text-left">Price</legend>
                                                <div className="mt-1 bg-white rounded-md shadow-sm ">
                                                    <div>
                                                        <div className="mt-1 relative rounded-md shadow-sm">
                                                            <input type="text" name="price" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full font-medium text-md  rounded-md py-2" 
                                                            placeholder="0.00" value={price} autoComplete="off" onChange={e => setprice(e.target.value)}/>

                                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                                <label className="sr-only">Currency</label>
                                                                <Select defaultValue={currencyOptions[0]}  id="type" value={priceCurrency} name="priceCurrency" placeholder="Currency" options={currencyOptions} className="px-3 w-48"
                                                                onChange={e => setpriceCurrency(e.value)} isSearchable value={currencyOptions.filter(function(currencyOptions) {return currencyOptions.value === priceCurrency})}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </fieldset>
        
                                            <fieldset className="mt-2 bg-white" id="interval-fieldset">
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left">Roles</legend>
                                                        <div className="mt-1 rounded-md shadow-sm -space-y-px">
                                                            <div>
                                                                <label className="sr-only">roles</label>
                                                                <Select id="roles" value={planRole}  placeholder="Roles" closeMenuOnSelect={false} styles={colourStyles} name="planRole" isSearchable components={makeAnimated()} isMulti options={availableRoles} className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 font-medium text-md "
                                                                    onChange={e => setplanRole(e)} />
                                                                                                                                    
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                            
                                            </fieldset>

                                            <fieldset className="mt-2 bg-white" id="interval-fieldset">
                                                    <div className="">
                                                        <legend className="block text-sm font-medium text-gray-700 text-left">{unbinding ? "Unbinding Enabled" : "Unbinding Disabled"}</legend>
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
                                <button  name="license-modal" type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                                    Create
                                </button>
                            </div>

                        </div>
                    
                    </div>
                    </form>
            </div>

        )

}
export default PlanModal