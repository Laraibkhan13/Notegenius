import React from 'react'

function PdfViewer({fileUrl}) {
    console.log(fileUrl)
  return (
    <div>
        <iframe src={fileUrl+"#toolbar=0"}  width='100%' className=' h-[90vh]'  />
    </div>
  )
}

export default PdfViewer