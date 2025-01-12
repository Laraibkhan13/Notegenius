import { convexToJson, v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const addNotes=mutation({
    args:{
        fileId:v.string(),
        notes:v.any(),
        createdBy:v.string()
    },
    handler:async(ctx,args)=>{
        const recordId=await ctx.db.query('notes')
        .filter((q)=>q.eq(q.field('field'),args.fieldId)).collect();

        if(recordId?.length==0)
            {
                await ctx.db.insert('notes',{
                    fileId:args.fileId,
                    notes:args.notes,
                    createdBy:args.createdBy

                })
            }
        else{

            await ctx.db.patch(recordId[0]._id,{notes:args.notes})
        }
    }

    
})

export const GetNotes=query({
    args:{
        fileId:v.string()
    },
    handler:async (ctx,args)=>{
        const result=await ctx.db.query('notes')
        .filter((q)=>q.eq(q.field('fileId'),args.fileId)).collect();

        console.log(result[0]?.notes)

        return result[0]?.notes;
    }
})