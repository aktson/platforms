/***** IMPORTS *****/
import { HttpMethod } from '@/types';
import { signIn } from 'next-auth/react';
import React, { FC, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';


/***** INTERFACES *****/
interface SignInProps {

};


/***** COMPONENT-FUNCTION *****/
const SignIn: FC<SignInProps> = (): JSX.Element => {

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);


    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef?.current?.value.trim();
        const password = passwordRef?.current?.value.trim();

        try {

            const loginResponse = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password
            });
            console.log('loginresponse', loginResponse)

        } catch (error) {
            console.error(error);
        }
    }

    /** return statement */
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign In
                </h2>

                <form className='mt-5 flex flex-col gap-4' onSubmit={(e: React.SyntheticEvent) => handleSignIn(e)}>
                    <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                        <span className="px-5 w-36">Email</span>
                        <input
                            className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                            name="email"
                            required
                            placeholder="Email"
                            ref={emailRef}
                            type="text"
                        />
                    </div>
                    {/* email input */}
                    <div className="border border-gray-700 rounded-lg flex flex-start items-top items-center">
                        <span className="px-5 w-36">Password</span>
                        <input
                            className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                            name="password"
                            type="password"
                            required
                            placeholder="password"
                            ref={passwordRef}
                        />
                    </div>
                    <button className='bg-black text-white group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none'>Sign In</button>
                </form>
                <Toaster />
            </div>
        </div>
    );
};

/***** EXPORTS *****/
export default SignIn;