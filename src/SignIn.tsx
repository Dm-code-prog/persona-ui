import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { AppConfig } from "./config/app-config";
import { Toaster } from "./components/ui/toaster";
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardFooter, CardHeader } from "./components/ui/card";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2),
});

function SignIn() {
    const supabase = createClient(AppConfig.supabase_url, AppConfig.supabase_key);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSignUp, setIsSignUp] = useState(false);

    const signInWithPassword = async (email: string, password: string) => {
        const { error, data } = isSignUp
            ? await supabase.auth.signUp({
                email,
                password,
            })
            : await supabase.auth.signInWithPassword({
                email,
                password,
            });
        if (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Error with auth" + error.message,
            });
        } else if (isSignUp && data.user) {
            setIsSignUp(false);
        } else if (data.user) {
            navigate("/")
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        } else {
            toast({
                variant: "default",
                title: "Signed out successfully",
            });
            navigate("/signin")
        }
    };

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        signInWithPassword(values.email, values.password).catch((err) => {
            console.error(err);
        });
    }   

    return (
        <div className="flex min-h-screen items-center justify-center relative">
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-blue-500 to-transparent opacity-5"></div>
            <Toaster/>
            <Card className="p-6 w-96"> 
                <div className="flex w-full flex-col items-start">
                    <Form {...form}>
                        <CardHeader className="w-full">
                            <h1 className="text-3xl font-bold text-center">Persona AI</h1>
                        </CardHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="w-full" placeholder="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full"
                                                placeholder="password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" variant="default">Sign In</Button>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default SignIn;