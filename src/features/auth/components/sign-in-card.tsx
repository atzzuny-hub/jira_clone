'use client'

import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'

import DottedSeparator from "@/components/dottedSeparator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { loginSchema } from '../schemas'
import { useLogin } from '../api/use-login'


export const SignInCard = () => {

    const { mutate, isPending } = useLogin()
 
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver:zodResolver(loginSchema), 
        defaultValues:{
            email:'',
            password: ''
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>)=>{
        mutate({json : values})
        console.log(values);        
    }

    return(
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Welcome Back!
                </CardTitle>
            </CardHeader>

            <div className="px-7 mb-2">
                <DottedSeparator/>
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            type="email"
                                            placeholder="Enter email address"                                        
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='password'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            type="password"
                                            placeholder="Enter password"                                        
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            className="w-full" 
                            disabled={isPending} 
                            size={'lg'}
                        >
                            Login
                        </Button>
                        <div className="px-7">
                            <DottedSeparator/>
                        </div>
                        <CardContent className="p-7 flex flex-col gap-y-4">
                            <Button
                                disabled={false}
                                variant={"secondary"}
                                size={'lg'}
                                className="w-full"
                            >
                                <FcGoogle className='mr-2 size-5'/>
                                Login width Google
                            </Button>
                            <Button
                                disabled={false}
                                variant={"secondary"}
                                size={'lg'}
                                className="w-full"
                            >
                                <FaGithub className='mr-2 size-5'/>
                                Login width Github
                            </Button> 
                        </CardContent>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SignInCard