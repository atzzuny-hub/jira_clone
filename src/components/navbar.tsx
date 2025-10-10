import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"


export const Navbar =() => {
    return(
        <nav className='pt-4 px-6 flex items-center justify-between'>
            <div className='flex-col hidden lg:flex'>
                <h1 className='text-2xl font-semibold'>Home</h1>
                <p className='text-muted-foreground'>여기에서 모든 프로젝트와 작업을 모니터링하세요</p>
            </div>
            <MobileSidebar/>
            <UserButton/>
        </nav>
    )
}