import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {client} from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$patch']>

export const useUpdateMember = () => {

    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        /// @ts-expect-error RequestType 인수의 타입 불명확
        mutationFn: async({param, json}) => {
            // @ts-expect-error RequestType 인수의 타입 불명확
            const response = await client.api.members[':memberId']['$patch']({param, json});

            if(!response.ok){
                throw new Error("Failed to update member")
            }

            return await response.json()
        },
        onSuccess: () => {            
            toast.success("Member update")
            queryClient.invalidateQueries({queryKey : ['members']})
        },
        onError:()=>{
            toast.error("Failed to update member ")
        }
    })
    return mutation
}