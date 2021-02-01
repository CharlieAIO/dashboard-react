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

            <>
            <nav>
                <div className="">
                    <div className="h-16 text-left">

                        <div className="text-left">
                            <img className="block h-24 w-auto" src="https://venetiacli.io/images/logo.png"/>
                        </div>

                    </div>
                </div>

            </nav>
            </>
        )
}

export default UserNav;