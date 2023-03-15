import Layout from "@/components/app/Layout";
import toast, { Toaster } from "react-hot-toast";
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
import Modal from "@/components/Modal";

export default function AppSettings() {
    const { data: session } = useSession();

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const [saving, setSaving] = useState<boolean>(false);
    const [data, setData] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [creatingUser, setCreatingUser] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (session)
    //         setData({
    //             ...session.user,
    //         });
    // }, [session]);
    const sessionId = session?.user?.id;
    useEffect(() => {

        async function fetchUsers() {
            try {
                const res = await fetch("api/users")
                const data = await res.json();
                if (data) {
                    setData(data)
                }

                if (!res.ok) {
                    alert("Failed to get users");
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchUsers()
    }, []);

    async function createUser() {
        try {
            const res = await fetch(`/api/users`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: sessionId,
                    name: nameRef.current?.value,
                    email: emailRef.current?.value,
                }),
            });

            if (res.ok) {
                const user = await res.json();
                setShowModal(false)
                console.log('data post user', user)
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong creating user")
        } finally {
            setCreatingUser(false);
        }
    }
    // function to do
    const saveSettings = () => console.log("SAVING SETINGS")


    return (
        <>
            <Layout>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 10000,
                    }}
                />

                <Modal showModal={showModal} setShowModal={setShowModal}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setCreatingUser(true);
                            createUser();
                        }}
                        className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                    >
                        <h2 className="font-cal text-2xl mb-6">Add new user</h2>
                        <div className="grid gap-y-5 w-5/6 mx-auto">
                            {error && (
                                <p className="px-5 text-left text-red-500">
                                    <b>{error}</b>
                                </p>
                            )}
                            {/* name input */}
                            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                                <span className="pl-5 pr-1">📌</span>
                                <input
                                    className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                                    name="name"
                                    required
                                    placeholder="Name"
                                    ref={nameRef}
                                    type="text"
                                />
                            </div>
                            {/* email input */}
                            <div className="border border-gray-700 rounded-lg flex flex-start items-top">
                                <span className="pl-5 pr-1 mt-3">✍️</span>
                                <input
                                    className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    ref={emailRef}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-10 w-full">
                            <button
                                type="button"
                                className="w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
                                onClick={() => {
                                    setError(null);
                                    setShowModal(false);
                                }}
                            >
                                CANCEL
                            </button>

                            <button
                                type="submit"
                                disabled={creatingUser || error !== null}
                                className={`${creatingUser || error
                                    ? "cursor-not-allowed text-gray-400 bg-gray-50"
                                    : "bg-white text-gray-600 hover:text-black"
                                    } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
                            >
                                {creatingUser ? <LoadingDots /> : "ADD USER"}
                            </button>
                        </div>
                    </form>
                </Modal>

                <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
                    <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
                        <h1 className="font-cal text-5xl">Users</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="font-cal text-lg w-3/4 sm:w-40 tracking-wide text-white bg-black border-black border-2 px-5 py-3 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
                        >
                            New User <span className="ml-2">＋</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16 flex gap-4 flex-wrap">
                    {/* todo render users here */}

                    {data?.users?.map((user: any) => {
                        return (
                            <div key={user.id} className="border  p-2 mb-2 w-max ">
                                <h3 className="text-2xl" > {user.name}</h3 >
                                <p> {user.email}</p>
                            </div>
                        )
                    }
                    )}
                </div>

                <footer className="h-20 z-20 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
                    <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-end items-center">
                        <button
                            onClick={() => {
                                saveSettings();
                            }}
                            disabled={saving}
                            className={`${saving
                                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                                : "bg-black hover:bg-white hover:text-black border-black"
                                } mx-2 w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
                        >
                            {saving ? <LoadingDots /> : "Save Changes"}
                        </button>
                    </div>
                </footer>
            </Layout>
        </>
    );
}



