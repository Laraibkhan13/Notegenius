import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {

    await ConvexVectorStore.fromTexts(
      args.splitText,//array
      args.fileId,//string
      new GoogleGenerativeAIEmbeddings({
        apiKey:process.env.NEXT_PUBLIC_GEMINI_API_KYE,
        modelName: "embedding-001", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Documen title",
      }),
      { ctx }
    );

    return 'completed'
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {

    console.log("Search query:", args.query);
    console.log("File ID:", args.fileId);
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyB7QIP435ATna0-VE9Nt2DwbkEl-IP47bY',
        modelName: "embedding-001", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Documen title",
      }),{ ctx });

     

    // const resultOne = (await vectorStore.similaritySearch(args.query, 1))
    // .filter(q => q.metadata=== args.fileId);
    // // console.log(resultOne);

  //   const resultOne = (await vectorStore.similaritySearch(args.query, 1))
  // .filter(q => {
  //   const metadataString = q.metadata.join('');
  //   console.log("Metadata:", q.metadata);  // Log metadata to understand its structure
  //   return q.metadata === args.fileId;  // Try this if metadata is a direct string
  // });

  const resultOne = (await vectorStore.similaritySearch(args.query, 1))
  .filter(q => {
    // console.log("Metadata:", q.metadata);  // Log metadata to inspect its type and structure
    
    // Convert metadata object to a string
    const metadataString = Object.values(q.metadata).join('');
    console.log("Metadata as string:",metadataString);  // Log the result to verify
    
    // Compare with fileId
    return metadataString === args.fileId;
  });


    return JSON.stringify(resultOne)
  },
});