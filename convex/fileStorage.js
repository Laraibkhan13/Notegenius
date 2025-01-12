import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});


export const AddFiletoDB=mutation({
    args:{
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        fileUrl:v.string(),
        createdby:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.insert('pdffiles',{
            fileId:args.fileId,
            fileName:args.fileName,
            storageId:args.storageId,
            fileUrl:args.fileUrl,
            createdby:args.createdby
        })
        return 'Inserted'
    }
})

export const getFileUrl=mutation({
    args:{
        storageId:v.string()
    },
    handler:async(ctx,args)=>{
        const url=await ctx.storage.getUrl(args.storageId);
        return url;
    }
})


export const GetFileRecord=query({
    args:{
        fileId:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('pdffiles').filter((q)=>q.eq(q.field('fileId'),args.fileId)).collect();
 
        console.log(result[0]);
        return result[0];
    },
    

})

export const GetUserFiles=query({
    args:{
        userEmail:v.string()
    },
    handler:async(ctx,args)=>{

        if(!args?.userEmail)
        {
            return ;
        }

        const result=await ctx.db.query('pdffiles')
        .filter((q)=>q.eq(q.field('createdby'),args?.userEmail)).collect()

        return result;
    }
})