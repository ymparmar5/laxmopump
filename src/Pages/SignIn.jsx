import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import myContext from "../Context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../FireBase/FireBaseConfig";
import Loader from "../Components/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "../Style/SignIn.css";



const SignIN = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // navigate 
    const navigate = useNavigate();

    // User Signup State 
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    /**========================================================================
    *========================================================================**/

    const userLoginFunction = async () => {
        // validation 
        if (userLogin.email === "" || userLogin.password === "") {
            toast.error("All Fields are required")
        }

        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
            // console.log(users.user)

            try {
                const q = query(
                    collection(fireDB, "user"),
                    where('uid', '==', users?.user?.uid)
                );
                const data = onSnapshot(q, (QuerySnapshot) => {
                    let user;
                    QuerySnapshot.forEach((doc) => user = doc.data());
                    localStorage.setItem("users", JSON.stringify(user) )
                    setUserLogin({
                        email: "",
                        password: ""
                    })
                    toast.success("Login Successfully");
                    setLoading(false);
                    if(user.role === "user") {
                        navigate('/user');
                    }else{
                        navigate('/admin');
                    }
                });
                return () => data;
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Login Failed");
        }
    }
    return (
        <div  id="sign-in" >
            {loading && <Loader />}
          
            <div id="signin-form" >

                    <h3  id="signin-title">Sign In
                    </h3>
       
             
                    <input
                        type="email"
                        name="email"
                        placeholder='Email Address'
                        value={userLogin.email}
                        onChange={(e) => {
                            setUserLogin({
                                ...userLogin,
                                email: e.target.value
                            })
                        }}
                        className='signin-input'
                    />
          
                    <input
                        type="password"
                        placeholder='Password'
                        value={userLogin.password}
                        onChange={(e) => {
                            setUserLogin({
                                ...userLogin,
                                password: e.target.value
                            })
                        }}
                        className='signin-input'
                    />

                    <button
                     id="signin-btn" 
                        type='button'
                        onClick={userLoginFunction}
                   
                    >Sign In
                    </button>
                <div className='signin-text' >
                    <p >Don't Have an account <b> <Link className='signin-text' to={'/sign-up'}>Sign up</Link>
                    </b>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIN;