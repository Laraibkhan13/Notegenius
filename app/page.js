"use client"

import { Button } from "@/components/ui/button";
import "./globals.css"
import { UserButton, useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";


import HomeHeader from "./HomeHeader";
import Link from "next/link";


export default function Home() {


  const {user}=useUser()
  const createUser=useMutation(api.user.createUser);

  useEffect(()=>{
    user && CheckUser();

  },[user])

  async function CheckUser()
  {
    const result=await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      imageUrl:user?.imageUrl,
      userName:user?.fullName
    })

    console.log(result)
  }

  return (
    <div
    style={{
      background: "radial-gradient(circle, rgba(187,211,255,1) 0%, rgba(234,236,237,0.936) 100%)",
        height: "100vh",
        width: "100vw",
    }}>
      <HomeHeader></HomeHeader>
      <div className="text-center mt-20 p-10">
        <h1 className=" font-bold text-6xl m-2">Simplify<span className=" text-red-500"> PDF</span><span className=" text-blue-500"> Note</span>-Taking with </h1>
        <h1 className=" font-bold text-6xl m-2">with Notegenius</h1>

        {
          user?<Link href={'/dashboard'}><Button className=' m-5 rounded-3xl'>Dashboard</Button></Link>:<Link href={'/sign-in'} className=" cursor-pointer">
          <Button className='m-5 rounded-3xl'>Get Started</Button>
          </Link>
        }
        
      </div>
    </div>
  )
}
