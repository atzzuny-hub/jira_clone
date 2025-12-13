"use client"

import {MenuIcon} from 'lucide-react'
import { Sidebar } from './sidebar'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export const MobileSidebar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname();

    useEffect(()=>{
        setIsOpen(false)
    },[pathname])
    
    return(
        <Sheet modal={isOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant={'secondary'} className='lg:hidden'>
                    <MenuIcon className='size-4 text-neutral-500'/>
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className='p-0'>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}