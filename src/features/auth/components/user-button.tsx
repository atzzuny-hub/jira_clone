"use client"  // 클라이언트 컴포넌트 (상호작용 필요)

// 아이콘
import {Loader, LogOut} from "lucide-react"

// 커스텀 훅들
import { useCurrent } from "../api/use-current"     // 현재 사용자 정보
import { useLogout } from "../api/use-logout"       // 로그아웃 기능

// UI 컴포넌트들
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from "@radix-ui/react-dropdown-menu"

// 커스텀 컴포넌트
import DottedSeparator from "@/components/dottedSeparator"
 

export const UserButton = () => {

    // 상태관리
    const {mutate:logout} = useLogout(); // 로그아웃 버튼 클릭 시 실행할 함수
    const {data: user, isLoading} = useCurrent(); // 현재 로그인한 사용자 정보와 로딩 상태 관리

    // 로딩 상태 처리
    if(isLoading){
        return(
            <div className='size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300'>
                <Loader className='size-4 animate-spin text-muted-foreground'/>
            </div>
        )
    }

    // 미인증 상태 처리
    if(!user) return null;

    // 아바타 이니셜 생성 로직
    const {name, email} = user;

    const avatarFallback = name
    ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? 'U'    


    return(
        // 드롭다운 메뉴 
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-75 transition border border-neutral-300'>
                    <AvatarFallback className='bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' side='bottom' className='w-60' sideOffset={10}>
                <div className='flex flex-col items-center justify-center gap-2 px-2.5 py-4'>
                    <Avatar className='size-[52px] border border-neutral-300'>
                        <AvatarFallback className='bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center'>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-sm font-medium text-neutral-900'>
                            {name || " User"}
                        </p>
                        <p className='text-xs text-neutral-500'>{email}</p>
                    </div>
                </div>
                <DottedSeparator className='mb-1'/>
                <DropdownMenuItem 
                    onClick={()=> logout()}
                    className='h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer'
                >
                    <LogOut className='size-4 mr-2'/>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )


}