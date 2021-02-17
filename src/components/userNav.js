import '../static/styles/main.css'; 
import React, {useState, useEffect} from 'react';
import BounceLoader from "react-spinners/BounceLoader";



const UserNav = () =>  {
    const [loaded, setLoaded] = useState(false)
    const [img, setImg] = useState("")

    async function fetchData(){
        const res = await fetch('/accounts/user/data');
        res.json()
        .then(res => {
            setImg(res.serverImage)
            setLoaded(true)
        })
        .catch(err =>  {
            fetchData()
        });
        
    }


    useEffect(() =>{
        var abortController = new AbortController();
        fetchData()




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
                            {loaded ? <img className="block h-24 w-auto rounded-full p-2" src={img}/> : <BounceLoader color={'#302f2f'} loading={true} size={25} /> }
                        </div>

                    </div>
                </div>

            </nav>
            </>
        )
}

export default UserNav;