"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import useSignUpModal from "@/hooks/useSignUpModal";
interface AuthButtonProps {
    className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ className }) => {
    const authModal = useAuthModal();
    const signUpModal = useSignUpModal();
    const supabaseClient = useSupabaseClient();
    const { user, userDetails } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
    };

    return (
        <div className={twMerge(`h-fit p-6`, className)}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="flex justify-between items-center gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (

                        <div>
                            <button
                                onClick={authModal.onOpen}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
                            >
                                Login
                            </button>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthButton;