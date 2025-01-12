import React from 'react'
import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

function HomeHeader() {
  return (
    <div className=' flex justify-between p-4 '>
      <div className=' flex '>
              <Image src={'/logo.svg'} alt='logo' width={30} height={100}/>
              <p className=' ml-1 font-extrabold text-xl shadow-md'>otegenius</p>
      </div>
      <div className=' flex items-center gap-3 '>
      <Link href={'/sign-in'} className=" cursor-pointer">
      <Button className='border rounded-3xl '>Get Started</Button>
      </Link>
      <UserButton/>
      </div>
      
      
      
      
    </div>
  )
}

export default HomeHeader