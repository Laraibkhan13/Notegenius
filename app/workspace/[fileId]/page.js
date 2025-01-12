"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import WorkspaceHeader from './_component/WorkspaceHeader';
import PdfViewer from './_component/PdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from './_component/TextEditor';


function Workspace() {

    const {fileId}=useParams();
    
    const fileInfo=useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId
    });

    useEffect(()=>{
        console.log(fileInfo)
    },[fileInfo])
  return (
    <div>
        <WorkspaceHeader fileName={fileInfo?.fileName} />

        <div className=' grid grid-cols-2 gap-5'>
            <div>
                {/* {text editor} */}
                <TextEditor fileId={fileId}/>
            </div>
            <div>
                {/* Pdf Viewer */}
                <PdfViewer fileUrl={fileInfo?.fileUrl} />
            </div>
        </div>
    </div>
  )
}

export default Workspace