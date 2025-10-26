'use client'

import { Loader2 } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect } from "react"

// import { FadeLoader } from "react-spinners"

// const { useRouter } = require("next/navigation")
// const { useEffect } = require("react")

const NotFound = ()=> {

    const router = useRouter()
    useEffect(()=> {
        router.push('/')
    }, [router])

    return (
        <div className=' h-screen flex justify-center items-center animate-spin'>
            <Loader2 size={70} color='#0e4e40' />
        </div>
    )
}

export default NotFound
