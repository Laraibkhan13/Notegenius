import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfUrl="https://rosy-mouse-963.convex.cloud/api/storage/573be5e0-6ac1-4f23-86c4-9a72ad21b43d"

export async function GET(req)
{
    const reqUrl=req.url;
    const{searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl')
    console.log(pdfUrl);


    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load()

    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });

      const output = await splitter.createDocuments([pdfTextContent]);

      let splitterlist=[];

      output.forEach(doc=>{
        splitterlist.push(doc.pageContent)
      })

    return NextResponse.json({result:splitterlist})
}