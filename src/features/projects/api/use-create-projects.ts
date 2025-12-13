import { toast } from 'sonner';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { InferResponseType } from 'hono';

import {client} from '@/lib/rpc'
import { createProjectSchema } from '../schemas';
import z from 'zod';

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>
// type RequestType = InferRequestType<typeof client.api.projects['$post']>

type MutationVariables = {
    form: z.infer<typeof createProjectSchema>; // 필드 타입
    param: { projectId: string }; // URL 파라미터 타입
}

export const useCreateProject = () => {

    const queryClient = useQueryClient()
    

    const mutation = useMutation<
        ResponseType,
        Error,
        // RequestType
        MutationVariables
    >({
        mutationFn: async({form}) => {
            const response = await client.api.projects["$post"]({form});

            console.log(response);
            

            if(!response.ok){
                throw new Error("Failed to create projects")
            }

            return response.json()
        },
        onSuccess: () => {
            toast.success('Projects created')
            queryClient.invalidateQueries({queryKey : ['projects']})
        },
        onError: ()=> {
            toast.error("Failed to create projects")
        }
    })
    return mutation
}
