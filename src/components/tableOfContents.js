import React from "react"

const TableOfContents = ({ content }) => {
  return (
    <div className="blog-table">
      <div
        className="table-of-contents"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default TableOfContents
