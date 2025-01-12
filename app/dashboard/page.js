"use client"

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

function Dashboard() {

  const {user}=useUser();

  const fileList=useQuery(api.fileStorage.GetUserFiles,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })


  console.log(fileList)
  return (
    <div>
      <h2 className=' font-medium text-3xl'>Workspace</h2>
      <div className=' mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 cursor-pointer'>
        {
          fileList?.length>0?fileList?.map((file,index)=>(
            <Link key={index} href={'/workspace/'+file.fileId}>
            <div  className=' flex p-5 shadow-md rounded-md flex-col  items-center justify-center border border-x-gray-100 hover:scale-95 transition-all'>
              <Image src={'/pdf-file.png'} alt='file' width={40} height={40}/>
              <h2 className=' mt-3 font-medium text-xs'>{file.fileName}</h2>
            </div>
            </Link>
          ))
          :[1,2,3,4,5,6,7].map((item,index)=>(
            <div key={index} className=' bg-slate-200 rounded-md h-[150px] animate-pulse'>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard