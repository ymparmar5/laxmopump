import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../Context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../FireBase/FireBaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";
import "../Style/SignUp.css";

const Signup = () => {

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // navigate 
    const navigate = useNavigate();

    // User Signup State 
    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    /**========================================================================
     *                          User Signup Function 
    *========================================================================**/

    const userSignupFunction = async () => {
        // validation 
        if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
            toast.error("All Fields are required");
            return;
        }

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

            // create user object
            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            }

            // create user Reference
            const userReference = collection(fireDB, "user")

            // Add User Detail
            await addDoc(userReference, user);

            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user"
            });

            toast.success("Signup Successfully");

            setLoading(false);
            navigate('/sign-in');
        } catch (error) {
            console.error(error);
            toast.error("Signup Failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div id="sign-up" >
            {loading && <Loader />}
            <div id="signup-form" >

                <h3 id="signup-title">
                    Sign Up
                </h3>

                <input
                    type="text"
                    placeholder='Full Name'
                    value={userSignup.name}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            name: e.target.value
                        })
                    }}
                    className='signup-input'
                />
                <input
                    type="email"
                    placeholder='Email Address'
                    value={userSignup.email}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            email: e.target.value
                        })
                    }}
                    className='signup-input'
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={userSignup.password}
                    onChange={(e) => {
                        setUserSignup({
                            ...userSignup,
                            password: e.target.value
                        })
                    }}
                    className='signup-input'
                />
                    <button
                    id="signup-btn"
                        type='button'
                        onClick={userSignupFunction}
                        className=' '
                    >
                        Sign up
                    </button>

                <div>
                    <p className='signup-text'>Already have an account?<b> <Link className='signup-text' to={'/sign-in'}>Sign-in</Link></b></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
