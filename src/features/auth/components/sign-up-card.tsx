import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'

import DottedSeparator from "@/components/dottedSeparator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { registerSchema } from '../schemas'

export const SignUpCard = () => {

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver:zodResolver(registerSchema),
        defaultValues:{
            name:'',
            email:'',
            password:'',
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>)=>{
        console.log(values);        
    }
    

    return(
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Sign Up
                </CardTitle>
                <CardDescription>
                    By signing up, you agree to our{""}
                    <Link href={"/privacy"}>
                        <span className='text-blue-700'>Privacy Policy</span>
                    </Link>
                    {""}and{""}
                    <Link href={"/privacy"}>
                        <span className='text-blue-700'>Terms of Service</span>
                    </Link>
                </CardDescription>
            </CardHeader>

            <div className="px-7 mb-2">
                <DottedSeparator/>
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your name"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
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
                                            // required
                                            // value={''}
                                            // onChange={()=>{}}
                                            {...field}
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
                            disabled={false} 
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

export default SignUpCard