import Link from "next/link"
import { useRouter } from "next/router"
import { ICategory } from "../types"
import Image from 'next/image'
import Search from "../images/search.png"
import { useEffect, useState } from "react"

interface IPropTypes {
    categories: ICategory[] | null,
    handleSearch: (query: string) => void
}

let num = 0
let item = 0
let hold = 20
let time = 300
let searchLetters = ''

export default function Tabs({ categories, handleSearch }: IPropTypes) {
    const [placeholder, setPlaceholder] = useState('');
    const [count, setCount] = useState(0)
    const router = useRouter()
    const searchItemsArray = ['nodejs', 'python', 'javascript', 'php', 'java', 'digital marketing'];

    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), time)

        if (num == searchLetters.length) {
            if(num == searchLetters.length && hold > 0){
               hold -= 1
            }
            
            if(num == searchLetters.length && hold == 0){
                num = 0
                hold = 20
                item += 1
            }

            if (item == searchItemsArray.length) {
                item = 0
            }

            searchLetters = searchItemsArray[item]
        } else {
            num += 1
        }

        if(num < searchLetters.length / 3){
            time = 300
        } else if (num < searchLetters.length / 2){
            time = 270
        } else {
            time = 250
        }

        setPlaceholder(searchLetters.substring(0, num))
        return () => clearTimeout(timer)
    }, [count])
    // }, [])

    const isActiveLink = (category: ICategory) => {
        return category.attributes.Slug === router.query.category
    }

    return (
        <div className="flex items-center justify-between borderbottom">
            <ul className="tracking-[0.2px] flex items-center gap-4 mt-4 mb-4">
                <li className={
                    `${router.pathname === '/'
                        ? 'text-primary'
                        : 'text-gray-600'
                    }`
                }>
                    <Link href='/'>Recent</Link>
                </li>
                {
                    categories?.map((category) => {
                        return (
                            <li
                                key={category.id}
                                className={
                                    `${isActiveLink(category)
                                        ? 'text-primary'
                                        : 'text-gray-600'
                                    }`
                                }>
                                <Link href={`/category/${category.attributes.Slug}`}>{category.attributes.Title}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="flex items-center">
                <Image
                    src={Search}
                    alt="Search"
                    height="16"
                />
                <input
                    onChange={(e) => handleSearch(e.target.value)}
                    type="text"
                    placeholder={`blogs on ${placeholder}`}
                    className="tracking-[0.2px] outline-none w-48 ml-3 pt-0.5 text-gray-600 placeholder:text-gray-600"
                />
            </div>
        </div>
    )
}