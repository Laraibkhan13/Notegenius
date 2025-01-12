"use client"

import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"
import { useUser } from '@clerk/nextjs'

import { Layout, LayoutDashboardIcon, Shield } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import UploadPdfDialogue from './UploadPdfDialogue'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Dashboardlayout from '../layout';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function SideBar() {

    const {user}=useUser();
    const path=usePathname();
    
      const fileList=useQuery(api.fileStorage.GetUserFiles,{
        userEmail:user?.primaryEmailAddress?.emailAddress
      })

      const GetUserInfo=useQuery(api.user.GetUserInfo,{
        userEmail:user?.primaryEmailAddress?.emailAddress
      })

      

      console.log("user--",GetUserInfo)

      const [isDialogVisible, setIsDialogVisible] = useState(false);
      useEffect(() => {
        if (fileList?.length >= 5 && GetUserInfo.upgrade==false) {
            setIsDialogVisible(false);
        } else {
            setIsDialogVisible(true);
        }
    }, [fileList])

    
  return (
    <div className=' shadow-sm h-screen p-5'>
        <div className=' flex '>
        <Image src={'/logo.svg'} alt='logo' width={30} height={100}/>
        <p className=' ml-1 font-extrabold text-xl shadow-md'>otegenius</p> </div>

        <div className=' mt-10 w-[90%]'>

            {/* <UploadPdfDialogue >
                <Button disabled={isFileLimitReached}>
                    + Upload PDF</Button>    
            </UploadPdfDialogue> */}
            
            {isDialogVisible && (
                    <UploadPdfDialogue>
                        <Button>
                            + Upload PDF
                        </Button>
                    </UploadPdfDialogue>
                )}
            <Link href={'/dashboard'}>
            <div className={`  flex gap-2 items-center p-3 mt-10 hover:bg-slate-100 rounded-lg cursor-pointer
                ${path=='/dashboard' &&'bg-slate-100'}
            `}>
                <LayoutDashboardIcon/>  
                <h2>Workspace</h2>
            </div>
            </Link>
            <Link href={'/dashboard/upgrade'}>
            <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer
                ${path=='/dashboard/upgrade' && 'bg-slate-100' }    
            `}>
                <Shield/>
                <h2>Upgrade</h2>
            </div>
            </Link>
        </div>
        {!GetUserInfo?.upgrade &&<div className=' absolute bottom-11 w-[80%]'>
        
            <Progress value={(fileList?.length/5)*100}/>
            <p className=' text-sm font-semibold mt-1'>{fileList?.length} out of 5 Pdf Uploaded</p>

            <p className=' text-sm mt-2 text-gray-400'>Upgrade to Upload more PDF</p>

        </div>}
        
    </div>
  )
}

export default SideBar