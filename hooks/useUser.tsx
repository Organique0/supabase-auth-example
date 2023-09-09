import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { db } from "@/lib/dbClient";
import useSignUpModal from "./useSignUpModal";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    updateUserDetails: (user: UserDetails) => void;
}
export interface UserDetails {
    id: string;
    userId: string;
    name: string;
    imageUrl: string
    email: string
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const { onOpenSignUp } = useSignUpModal();

    const getUserDetails = () => supabase.from('Profile').select('*').eq("userId", user?.id).single();
    useEffect(() => {
        if (user && !isLoadingData && !userDetails) {
            setIsLoadingData(true);
            Promise.allSettled([getUserDetails()]).then((results) => {
                const userDetailsPromise = results[0];

                if (userDetailsPromise.status === "fulfilled") {
                    setUserDetails(userDetailsPromise.value.data as UserDetails);
                    if (!userDetailsPromise.value.data) {
                        onOpenSignUp();
                    }
                }

                setIsLoadingData(false);

            })
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
        }
    }, [user, isLoadingUser]);

    const updateUserDetails = async (newDetails: UserDetails) => {
        const { data, error } = await supabase
            .from('Profile')
            .upsert([
                {
                    userId: newDetails.userId,
                    name: newDetails.name,
                    imageUrl: newDetails.imageUrl,
                    id: newDetails.id,
                    email: newDetails.email,
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                },
            ]);

        if (error) {
            // Handle the error
            console.error('Error inserting data:', error);
        } else {
            // Data was inserted successfully
            console.log('Data inserted successfully:', data);
        }

    };

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        updateUserDetails
    };

    return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within MyUserContextProvider")
    }

    return context;
}