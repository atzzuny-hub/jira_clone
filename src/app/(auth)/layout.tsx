import Image from "next/image"

interface AuthLayoutProps{
    children:React.ReactNode
}

const AuthLayout = ({children}:AuthLayoutProps) => {
    return(
        <div>            
             <Image src={'/logo.svg'} height={50} width={150} alt="logo"/>
            {children}
        </div>
    )
}

export default AuthLayout