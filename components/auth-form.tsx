"use client";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            //router.push("/login")
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }
    return (
        <Modal title="Welcome back" description="Login to your account" isOpen={isOpen} onChange={onChange}>
            <Auth theme="dark" magicLink providers={["github", "google"]} supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: "#5865F2", brandAccent: "#5865F2" } } } }} />
        </Modal>
    );
}

export default AuthModal;