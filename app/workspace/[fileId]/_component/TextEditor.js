import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtension from './EditorExtension'
import { Bold, Code, Italic, List, Underline } from 'lucide-react'
import Highlight from '@tiptap/extension-highlight'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'

import ListItem from '@tiptap/extension-list-item'

import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'


function TextEditor({fileId}) {

    const Mynotes=useQuery(api.notes.GetNotes,{
        fileId:fileId,
    })

    

    // useEffect(()=>{
    //     editor&&editor.commands.setContent(notes)
    // },[notes&&editor])
    console.log(Mynotes);
    

    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder:'Start taking your notes here!'
            }),
            Bold,
            Italic,
            Highlight.configure
            ({ multicolor: true }),
            Strike,
            Document,
            Paragraph,
            Text,
            TextAlign.configure({
                types:['heading','paragraph'],
                defaultAlignment:['right'],
                alignments:['left','center','right','justify']
            }),
            CodeBlock.configure({
                languageClassPrefix: 'language-',
              })
              
          
        ],
        content:'',
        editorProps:{
            
            attributes:{
                class:'focus:outline-none h-screen p-5 '
            }
        }
      })

    //   used to create notes for DB
    useEffect(()=>{
        editor && editor.commands.setContent(Mynotes);

        console.log("useEffect runnning")
    },[Mynotes && editor])
    

    
  return (
    <div>
        
         <EditorExtension editor={editor} fileId={fileId}/>
        <div className=' overflow-scroll  h-[88vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white'>
        <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor