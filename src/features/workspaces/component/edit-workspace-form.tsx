'use client'

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema } from "../schemas";
import { useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import DottedSeparator from "@/components/dottedSeparator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Workspace } from "../type";
import { APPWRITE_ENDPOINT, IMAGES_BUCKET_ID, PROJECT_ID } from "@/config";

interface EditWorkspaceFormProps{
    onCancel?: () => void;
    initialValues:Workspace;
}

export const EditWorkspaceForm = ({onCancel, initialValues} : EditWorkspaceFormProps) =>{

    const router = useRouter();

    const {mutate, isPending} = useUpdateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues:{
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    })

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : undefined,
        };
        
        mutate({
            form:finalValues,
            param: {workspaceId: initialValues.$id}

        }, {
            onSuccess:({data})=>{
                form.reset();
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image", file)
        } 
    }


    return(
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button 
                    size='sm' 
                    variant="secondary" 
                    onClick={onCancel? 
                    onCancel : ()=> router.push(`/workspaces/${initialValues.$id}`)}
                >
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                </Button>
                <CardTitle className="text-xl font-bold">
                    {initialValues.name}
                </CardTitle>
            </CardHeader>
            <div className="px=7">
                <DottedSeparator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Workstace name"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({field})=>(
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image
                                                        alt="Logo"
                                                        fill
                                                        className="object-cover"
                                                        // src={
                                                        //     field.value instanceof File
                                                        //         ? URL.createObjectURL(field.value)
                                                        //         : field.value
                                                        // }
                                                        src={field.value instanceof File
                                                            ? URL.createObjectURL(field.value)
                                                            : field.value ? 
                                                                // Appwrite ID를 완전한 URL로 변환!
                                                                `${APPWRITE_ENDPOINT.startsWith('https://') ? APPWRITE_ENDPOINT : `https://${APPWRITE_ENDPOINT}`}/storage/buckets/${IMAGES_BUCKET_ID}/files/${field.value}/view?project=${PROJECT_ID}`
                                                                : '' // field.value가 빈 문자열/undefined일 때 빈 값.
                                                        }
                                                    />
                                                </div>
                                            ):(
                                                <Avatar className="size=[72px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400"/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">Workstace Icon</p>
                                                <p className="text-sm text-muted-foreground">
                                                    JPG, PNG, SVG, max 1mb
                                                </p>
                                                <input
                                                    className="hidden"
                                                    type="file"
                                                    accept=".jpg, .png, .svg"
                                                    ref={inputRef}
                                                    onChange={handleImageChange}
                                                    disabled={isPending}
                                                />
                                                {field.value ? (
                                                    <Button
                                                        type="button"
                                                        disabled={isPending}
                                                        variant="tertiary"
                                                        size="xs"
                                                        className="w-fit mt-2"
                                                        onClick={()=>inputRef.current?.click()}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                ):(
                                                    <Button
                                                        type="button"
                                                        disabled={isPending}
                                                        variant="tertiary"
                                                        size="xs"
                                                        className="w-fit mt-2"
                                                        onClick={()=>inputRef.current?.click()}
                                                    >
                                                        Upload Image
                                                    </Button>
                                                )}
                                            </div>    

                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <DottedSeparator className="py-7"/>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size="lg"
                                variant='secondary'
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                                // onCancel prop이 전달되지 않으면 버튼을 invisible 처리하여 레이아웃은 유지하되 시각적으로 숨김
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isPending}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}