"use client";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useSupabaseClient, useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useCallback, useContext, useEffect } from "react";
import useSignUpModal from "@/hooks/useSignUpModal";
import { UserContext } from "@/hooks/useUser";
import * as z from "zod"
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useAuthModal();
    const { onCloseSignUp, isOpenSignUp, onOpenSignUp } = useSignUpModal();
    const context = useContext(UserContext);


    const formSchema = z.object({
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        context?.updateUserDetails({
            name: `${values.firstName} ${values.lastName}`,
            userId: session?.user?.id as string,
            imageUrl: session?.user.user_metadata.picture,
            email: session?.user?.email as string,
            id: session?.user?.id as string,
        });
        onCloseSignUp();
    }
    useEffect(() => {
        if (session && !context?.isLoading) {
            onClose();
        }
    }, [session, onClose, context, onOpenSignUp, onCloseSignUp])



    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }
    return (
        <>
            <Modal title="Welcome back" description="Login to your account" isOpen={isOpen} onChange={onChange}>
                <Auth theme="dark" providers={["github", "google", "discord"]} supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: "#5865F2", brandAccent: "#5865F2" } } } }} />
            </Modal>
            <Modal title="Register" description="Enter additional information" isOpen={isOpenSignUp} onChange={onChange}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </Modal>
        </>
    );
}

export default AuthModal;
