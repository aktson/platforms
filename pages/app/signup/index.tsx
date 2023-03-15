import Layout from "@/components/app/Layout";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import { fetcher } from "@/lib/fetcher";
import LoadingDots from "@/components/app/loading-dots";
import { HttpMethod } from "@/types";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import type { UserSettings } from "@/types";
import { User } from "@prisma/client";
import router from "next/router";


export default function SignUp() {


    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [creatingUser, setCreatingUser] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);



    async function createUser() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        try {

            const loginResponse = await register('credentials', {
                redirect: false,
                email: email,
                password: password
            });
            console.log('loginresponse', loginResponse)

        } catch (error) {
            console.error(error);
        }

    }


    return (
        <>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 10000,
                }}
            />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setCreatingUser(true);
                            createUser();
                        }}
                        className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                    >
                        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign Up
                        </h2>
                        <div className="grid gap-y-5 w-5/6 mx-auto">
                            {error && (
                                <p className="px-5 text-left text-red-500">
                                    <b>{error}</b>
                                </p>
                            )}
                            {/* name input */}
                            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
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
                            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                                <input
                                    className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                                    name="password"
                                    required
                                    placeholder="Password"
                                    ref={passwordRef}
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-10 w-full">

                            <button
                                type="submit"
                                disabled={creatingUser || error !== null}
                                className={`${creatingUser || error
                                    ? "cursor-not-allowed text-gray-400 bg-gray-50"
                                    : "bg-black text-white group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none"
                                    } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
                            >
                                {creatingUser ? <LoadingDots /> : "ADD USER"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </>
    );
}



