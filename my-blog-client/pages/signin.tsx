import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Toast from "../components/Toast"
import { signinUserImage, signinUserText } from "../redux/slices/signin"
import { AppDispatch, RootState } from "../redux/store"
import { checkEmail, checkText } from "../utils"

export default function Signup() {
    const dispatch = useDispatch<AppDispatch>()
    const { isUser } = useSelector((state: RootState) => state.user)
    const { error, message } = useSelector((state: RootState) => state.signin)
    const [dis, setDis] = useState<boolean>(false)
    const router = useRouter()
    const [avatar, setAvatar] = useState<string | Blob>('')
    const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null)
    const [user, setUser] = useState({ firstname: '', lastname: '', email: '', password: '', username: '', about: '' })

    const checkUserData = () => {
        const email = checkEmail(user.email)
        const password = checkText(user.password, 8, 20)
        const about = checkText(user.about, 60, 200)
        const username = checkText(user.username, 3, 30)
        const firstname = checkText(user.firstname, 3, 15)
        const lastname = checkText(user.lastname, 3, 15)

        if (!username) Toast('Username should be 3 to 30 characters.')
        if (!firstname) Toast('Firstname should be 3 to 15 characters.')
        if (!lastname) Toast('Lastname should be 3 to 15 characters.')
        if (avatarPreview === null) Toast('Avatar Image should be jpg file.')
        if (!email) Toast('Invalid email id.')
        if (!password) Toast('Password should be 8 to 20 characters.')
        if (!about) Toast('About should be 60 to 200 characters.')

        return email && password && about && avatarPreview !== null && username && firstname && lastname
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setDis(true)

        if (!checkUserData()) {
            setDis(false)
            return
        }

        dispatch(signinUserText(user))
        dispatch(signinUserImage(avatar))
    }

    const handleChange = (e: any) => {
        if (e.target.name === "avatar" && e.target.files[0]) {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) setAvatarPreview(reader.result)
            }

            reader.readAsDataURL(e.target.files[0])

            setAvatar(e.target.files[0])
            const file = e.target.files[0]
            const blob = file.slice(0, file.size, 'image/png')
            const nameChnagedFile = new File([blob], `${Date.now()}`, { type: 'image/png' })

            setAvatar(nameChnagedFile)
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (dis) {
            if (error) {
                setDis(false)
                Toast(error)
            }

            if (message === 'Your account has been created.') {
                Toast(message)
                setDis(false)
                router.push('/')
            }
        }
    }, [error, message])

    useEffect(() => {
        const jwt = localStorage.getItem('jwt')
        if (jwt) {
            router.push('/')
        }
    }, [])

    return (
        <>
            {
                !isUser &&
                <div className="screen-height h-full flex items-center justify-center">
                    <div className="w-[420px] my-20 rounded-lg bg-[#53bd9530]">
                        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col p-8">
                            <h1 className="tracking-[0.2px] font-caveat text-3xl text-center text-gray-700 mb-6">Sign in</h1>
                            <input className="tracking-[0.2px] bg-transparent mb-1 px-2 h-10 focus:outline-none text-gray-600 border border-[#53bd95]" type="text" name="username" placeholder="Username" onChange={(e) => handleChange(e)} />
                            <p className="mb-4  text-gray-600 font-semibold text-xs">Username should be 3 to 30 characters.</p>
                            <input className="tracking-[0.2px] bg-transparent mb-1 px-2 h-10 focus:outline-none text-gray-600 border border-[#53bd95]" type="text" name="firstname" placeholder="Firstname" onChange={(e) => handleChange(e)} />
                            <p className="text-gray-600 mb-4 font-semibold text-xs">Firstname should be 3 to 15 characters.</p>
                            <input className="tracking-[0.2px] bg-transparent mb-1 px-2 h-10 focus:outline-none text-gray-600 border border-[#53bd95]" type="text" name="lastname" placeholder="Lastname" onChange={(e) => handleChange(e)} />
                            <p className="text-gray-600 mb-4 font-semibold text-xs">Lastname should be 3 to 15 characters.</p>
                            <div className="signin flex gap-2">
                                {avatarPreview &&
                                    <img className="h-10 w-10 rounded-full object-cover border border-[#53bd95]" src={avatarPreview} alt="avatar" />
                                }
                                <input className="mb-1 h-10 focus:outline-none tracking-[0.2px] text-gray-600 border border-[#53bd95]" type="file" name="avatar" onChange={(e) => handleChange(e)} />
                            </div>
                            <p className="text-gray-600 mb-4 font-semibold text-xs">Avatar Image should be jpg file.</p>
                            <input className="tracking-[0.2px] bg-transparent mb-1 px-2 h-10 focus:outline-none text-gray-600 border border-[#53bd95]" type="text" name="email" placeholder="Email" onChange={(e) => handleChange(e)} />
                            <p className="text-gray-600 mb-4 font-semibold text-xs">Email should be valid email.</p>
                            <input className="tracking-[0.2px] bg-transparent mb-1 px-2 h-10 focus:outline-none text-gray-600 border border-[#53bd95]" type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                            <p className="text-gray-600 mb-4 font-semibold text-xs">Password Password should be 8 to 20 characters.</p>
                            <textarea className="tracking-[0.2px] bg-transparent mb-1 px-2 h-20 focus:outline-none text-gray-600 border border-[#53bd95] resize-none" name="about" placeholder="About" onChange={(e) => handleChange(e)} />
                            <p className="text-gray-600 mb-4 font-semibold text-xs">About should be 60 to 200 characters.</p>
                            <div className="mt-5 flex items-center justify-center bottom-0 left-0 w-full p-2">
                                <button type="submit" className={`${dis && 'disabled'} text-gray-700 tracking-[0.2px] mt-4 h-[40px] w-20 text-xs font-bold rounded-full bg-[#53bd9560]`}>SIGN IN</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}