import { toast } from 'sonner';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono';

import {client} from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>
type RequestType = InferRequestType<typeof client.api.projects['$post']>

export const useCreateProject = () => {

    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
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
