import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import Renew from './renew'

import { MdAutorenew } from 'react-icons/md';



const Modal = () => {

        
    return (
            <div className="fixed z-10 inset-0 overflow-y-auto" id="renew-modal">
        
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-64 text-center sm:block sm:p-0
                    ">

                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-95"></div>
                        </div>
            
                        <span className="hidden lg:inline-block lg:align-middle lg:h-screen md:inline-block md:align-middle md:h-screen sm:inline-block sm:align-middle sm:h-screen " aria-hidden="true">&#8203;</span>

        
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:align-middle md:align-middle lg:align-middle  max-w-sm w-full p-6 dark:bg-darkOther-200" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    
                            <div>


                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        
                                
                                <MdAutorenew className="h-6 w-6 text-green-600 select-none" id='hide'/>
                            </div>
    

                            <div className="mt-3 text-center sm:mt-5">  
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white select-none" id="modal-headline">
                                Renew Subscription
                                </h3>
    
                                <div className="mt-2">
                                    
                                    <div>

                                        <fieldset className="mt-2 bg-white dark:bg-darkOther-200">
                                            <Renew />
                                        </fieldset>


    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
        </div>

    )

}
export default Modal