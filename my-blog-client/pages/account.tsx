import { useRouter } from "next/router"
import { useContext } from "react"
import Loading from "../components/Loading"
import { AppContext } from "./_app"

export default function Account() {
    const { user, isLoading, isLoggedIn, setIsLoggedIn } = useContext(AppContext)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        setIsLoggedIn(false)
        router.push('/')
    }

    return (
        <div className="screen-height h-full flex items-center justify-center">
            {isLoading && (
                <Loading />
            )}
            {!isLoggedIn && !isLoading && (
                <div className="w-[400px] my-20 rounded-lg bg-[#53bd9530]">
                    <div className="flex flex-col p-8">
                        <p className="text-sm font-medium text-gray-600">
                            You cannot show your account without signup so please go for signup and then you can show your profile.
                        </p>
                        <div className="mt-5 flex items-center justify-center bottom-0 left-0 w-full p-2">
                            <a href="/signup" className="flex items-center justify-center  text-gray-700 pt-[2px] h-[42px] w-24 text-sm font-medium rounded-full bg-[#53bd9560]">GO</a>
                        </div>
                    </div>
                </div>
            )}
            {isLoggedIn && !isLoading && (
                <div className="w-[400px] p-8 my-20 rounded-lg bg-[#53bd9530]">
                    <div className="flex items-center justify-center">
                        <img
                            src={`http://localhost:1337${user.avatarurl}`} alt=""
                            className="w-32 h-32 cursor-pointer rounded-full"
                        />
                    </div>
                    <h1 className="pt-5 font-caveatbrush text-2xl text-center text-gray-600">{user.username}</h1>
                    <div className="mt-5 pb-5 text-sm font-medium">
                        <span className="text-gray-600">{user.about}</span>
                        <span className="text-gray-600"> My email id is {user.email}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-center bottom-0 left-0 w-full p-2">
                        <button onClick={() => handleLogout()} className="text-gray-700 pt-[2px] h-[42px] w-24 text-sm font-medium rounded-full bg-[#53bd9560]">LOGOUT</button>
                    </div>
                </div>
            )}
        </div>
    )
}