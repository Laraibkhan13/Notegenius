import React from 'react'

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Download, Heading1, Heading2Icon, Heading3, Highlighter, Italic, List, Save, SaveAllIcon, Sparkle, Strikethrough } from 'lucide-react'
import Underline from '@tiptap/extension-underline'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { chatSession } from '@/configs/AIModel'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake'


function EditorExtension({editor,fileId}) {

    const SearchAI=useAction(api.myActions.search)
    const saveNotes=useMutation(api.notes.addNotes)
    
    const{user}=useUser();

    async function onAiClick()
    {
      toast({
        description: "Getting your answer.",
      })
        const selecttedText=editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        )
        console.log(selecttedText);

        const res=await SearchAI({
            query:selecttedText,
            fileId:fileId
        })

        const unformattedAns=JSON.parse(res);
        let answer=''
        unformattedAns&&unformattedAns.forEach(item=>{
            answer=answer+item.pageContent
        })

        const PROMPT="For question :"+selecttedText+" and with the given content as answer,"+" plaese give appropriate answer in HTML format no CSS nothing just ue paragraph tag. The answer content is: "+answer

        const AIModelResult=await chatSession.sendMessage(PROMPT)

        const finalans=AIModelResult
        .response.text()
        .replace('```','').replace('html','')
        // .match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';

        console.log(finalans)

        const alltext=editor.getHTML();
        editor.commands.setContent(alltext+'<p><strong>Answer:</strong>'+finalans+' </p>')

        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress?.emailAddress
        })
        console.log("unformatted answer",unformattedAns)
    }

    function handleSave()
    {
      saveNotes({
        notes:editor.getHTML(),
        fileId:fileId,
        createdBy:user?.primaryEmailAddress?.emailAddress
      })
    }

    function handleDownloadPDF() {
      const content = editor.getHTML();
      const pdfContent = htmlToPdfmake(content);
      const documentDefinition = { content: pdfContent };
  
      pdfMake.createPdf(documentDefinition).download('editor-content.pdf');
    }

  return editor&&(
    <div className=' p-5'>
        <div className="control-group">
        <div className="button-group flex gap-3">

        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive({ level: 1 }) ? 'is-active' : ''}
          >
            <Heading1/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive({ level: 2 }) ? 'is-active' : ''}
          >
            <Heading2Icon/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive({ level: 3 }) ? 'is-active' : ''}
          >
            <Heading3/>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold/>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
          >
            <Highlighter className=' bg-yellow-500'/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#8ce99a' }).run()}
            className={editor.isActive('highlight', { color: '#8ce99a' }) ? 'is-active' : ''}
          >
            <Highlighter className=' bg-green-500'/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'red' }).run()}
            className={editor.isActive('highlight', { color: 'red' }) ? 'is-active' : ''}
          >
            <Highlighter className=' bg-red-500'/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <Strikethrough/>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            <AlignLeft/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          >
            <AlignCenter/>
          </button>
          <button
         onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          >
            <AlignRight/>
          </button>

          <button
         onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            
          >
          <AlignJustify/>
            
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'is-active' : ''}
          >
            <List/>
          </button>
          <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'text-blue-500' : ''}
            >
              <Code/>
            </button>

            <button
              onClick={() => onAiClick()}
              className={' hover:text-blue-500'}
            >
              <Sparkle /> 
            </button>
            <button onClick={handleSave}>
              <SaveAllIcon/>
            </button>

            <button onClick={handleDownloadPDF} className="hover:text-blue-500">
               <Download/>
            </button>


          </div>
        </div>
    </div>
  )
}

export default EditorExtension