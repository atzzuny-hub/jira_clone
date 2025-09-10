interface AuthLayoutProps{
    children:React.ReactNode
}

const AuthLayout = ({children}:AuthLayoutProps) => {
    return(
        <div>
            <h1>auth의 공통 레이아웃</h1>
            {children}
        </div>
    )
}

export default AuthLayout