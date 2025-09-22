
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";



type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>

export const useRegister = () => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn : async ({json}) => {
            const response = await client.api.auth.register["$post"]({json});
            return await response.json()
        },
        onSuccess: () => {
            router.refresh()
            queryClient.invalidateQueries({queryKey :["current"]}) // 데이터를 강제로 "무효화"시켜서 다시 가져온다.
        }
    })

    return mutation
}