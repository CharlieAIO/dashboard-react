import '../static/styles/main.css'; 
import React, {useState, useEffect} from 'react';




const UserNav = () =>  {

    useEffect(() =>{
        const abortController = new AbortController();
        

        return () => {
            abortController.abort();
        };

    }, [])

    // render() {
        return (

            <div className="h-16 mt-5">
                        
                        <div className="flex-1 px-4 flex justify-between bg-other-100">
                            <div className="flex-1 flex">
                                <h1 className="text-color-900 font-medium text-xl">VenetiaCLI</h1>
                            </div>
            

                        </div>
            </div>
        )
}

export default UserNav;