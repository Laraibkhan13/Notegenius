
import { UserButton, useUser } from '@clerk/nextjs'
import { Home, LucideHome } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Header() {
 
  return (
    <div className=' flex justify-end p-5 shadow-sm rounded-sm gap-5 my-auto'>
      {/* <p className=' m-2'>Hello, {user.firstName}</p> */}
      

          <Link href={'/'}>
          <button className='my-1 cursor-pointer' >
            <Home/>
          
          </button>
          </Link>
      <UserButton/>
    </div>
  )
}

export default Header