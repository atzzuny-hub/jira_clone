import { toast } from 'sonner';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono';

import {client} from '@/lib/rpc'
import { updateProjectSchema } from '../schemas';
import z from 'zod';
// import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]['$patch'], 200>
// type RequestType = InferRequestType<typeof client.api.projects[":projectId"]['$patch']>

type MutationVariables = {
    // 폼 데이터 (Zod 스키마에서 추론된 타입)
    form: z.infer<typeof updateProjectSchema>; 
    // URL 파라미터 (projectId)
    param: { projectId: string }; 
}

export const useUpdateProject = () => {

    // const router = useRouter();
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        // RequestType
        MutationVariables
    >({
        mutationFn: async({form, param}) => {
            // const response = await client.api.projects[":projectId"]["$patch"]({form, param});

            const response = await client.api.projects[":projectId"]["$patch"]({
                form, 
                param
            } as InferRequestType<typeof client.api.projects[":projectId"]['$patch']>);
            
            if(!response.ok){
                throw new Error("Failed to update projects")
            }

            return response.json()
        },
        onSuccess: ({data}) => {
            toast.success('Projects update')
            // router.refresh();
            queryClient.invalidateQueries({queryKey : ['projects']})
            queryClient.invalidateQueries({queryKey : ['project', data.$id]})
        },
        onError: ()=> {
            toast.error("Failed to update projects")
        }
    })
    return mutation
}
