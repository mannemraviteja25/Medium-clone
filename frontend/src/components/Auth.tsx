import { signupInput } from "@ravitejam25/common";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
 import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" })               => {

    const navigate = useNavigate();

    const [postInputs, setPostInputs] = useState<signupInput>({
        name: "",
        username: "",
        password: "",
    });

    async function sendRequest() {
        try {
            const url = type === "signup" ? `${BACKEND_URL}api/v1/user/signup` : `${BACKEND_URL}api/v1/user/signin`;
            const response = await axios.post(url, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blog");
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-15">
                        <div className="text-3xl font-extrabold">
                            {type === "signup" ? "Create an account" : "Sign in"}
                        </div>
                        <div className="text-slate-400">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link className="underline pl-2" to={type === "signup" ? "/signin" : "/signup"}>
                                {type === "signin" ? "Sign in" : "Signup"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" ? (
                            <LablledInput
                                label="Name"
                                placeholder="Enter your name"
                                onChange={(e) => {
                                    setPostInputs((c) => ({ ...postInputs, name: e.target.value }));
                                }}
                            />
                        ) : null}
                        <LablledInput
                            label="Username"
                            placeholder="Enter your username"
                            onChange={(e) => {
                                setPostInputs((c) => ({ ...postInputs, username: e.target.value }));
                            }}
                        />
                        <LablledInput
                            label="Password"
                            type={"password"}
                            placeholder="Password"
                            onChange={(e) => {
                                setPostInputs((c) => ({ ...postInputs, password: e.target.value }));
                            }}
                        />
                        <button onClick={sendRequest}
                            type="button"
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Signup" : "Signin"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface LablledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LablledInput({ label, placeholder, type, onChange }: LablledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                id={label.toLowerCase().replace(/\s+/g, "_")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
