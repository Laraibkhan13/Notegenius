"use client"
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from 'next/link'
import { Home, LayoutDashboard, LayoutDashboardIcon } from 'lucide-react'
import Dashboardlayout from '@/app/dashboard/layout'

const WorkspaceHeader = ({fileName}) => {


  return (
    <div className=' p-4 flex justify-between shadow-md'>
        <div className=' flex '>
        <Image src={'/logo.svg'} alt='logo' width={30} height={100}/>
        <p className=' ml-1 font-extrabold text-xl shadow-md'>otegenius</p>
        </div>
        <h2 className=' font-bold'>{fileName}</h2>
        <div className=' flex  items-center gap-3'>
          
          <Link href={'/dashboard'}>
          
          <button className=' mt-1'>
            <LayoutDashboardIcon/>
          </button>
          </Link>

          <Link href={'/'}>
          <button className=' mt-1'>
            <Home/>
          </button>
          </Link>
          
          <UserButton/>
        </div>
        
    </div>
  )
}

export default WorkspaceHeader