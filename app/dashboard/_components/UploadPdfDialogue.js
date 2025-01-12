"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import uuid4 from 'uuid4'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
  

function UploadPdfDialogue({children}) {
  
  const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl);
  const AddFileEntry=useMutation(api.fileStorage.AddFiletoDB)
  const getFileUrl=useMutation(api.fileStorage.getFileUrl)

  const embeddDocument=useAction(api.myActions.ingest)

  const{user}=useUser();

  const[file,setFile]=useState();
  const[fileName,setFileName]=useState("")
  const[loading,setLoading]=useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const[open,setopen]=useState(false);
 
  
  function OnFileSelect(event)
  {
    setFile(event.target.files[0])
  }

  async function onUpload()
  {

    if (!fileName.trim()) {
      setIsHighlighted(true); // Highlight the input field
      toast({
        description:"filename cannot be empty"
      })
    } else {
      setIsHighlighted(false);
      // Proceed with upload logic
      setLoading(true);

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    
    // Step 3: Save the newly allocated storage id to the database

    console.log('StorageId', storageId)

    const fileUrl=await getFileUrl({storageId:storageId})
    const fileId = uuid4();

    const resp=await AddFileEntry({
      fileId:fileId,
      storageId:storageId,
      fileName:fileName??'Untitled_file',
      fileUrl:fileUrl,
      createdby:user?.primaryEmailAddress?.emailAddress

    })

    console.log(resp)

    // API to Fetch PDF process Data
    const apiResponse=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
    // embeddDocument({});
    console.log(apiResponse.data.result)

    await embeddDocument({
      splitText:apiResponse.data.result,
      fileId:fileId,
    });


    if(resp)
    {
      setLoading(false)
      toast({
        description: "File Uploaded Successfully.",
      })
    }

    setopen(false);
    }
    
  }


  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setopen(true)}>+ Upload PDF file</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Pdf file</DialogTitle>
      <DialogDescription asChild>
        <div>

          <h2 className=' mt-5'>select a file to Upload</h2>
          <div className=' gap-2 p-3 rounded-md border'>
          
            <input type='file' accept='application/pdf'
            onChange={(event)=>OnFileSelect(event)}/>
          </div>
          <div className=' mt-2'>
            <label>File name*</label>
            <Input placeholder="enter your file name"
            value={fileName}
            onChange={(e)=>setFileName(e.target.value)}
            className={isHighlighted ? 'border-2 border-red-500' : ''} />
          </div>
          <DialogFooter className="flex sm:justify-end mt-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={()=>setopen(false)}>
              Close
            </Button> 
          </DialogClose>
          <Button onClick={onUpload} disabled={loading}>
          {
            loading?<Loader2Icon className=' animate-spin'/>:'Upload'
          }
          </Button>
          
        </DialogFooter>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialogue