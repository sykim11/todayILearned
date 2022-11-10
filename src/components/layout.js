import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import LeftNavigation from "./lefNavigation"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header, sidebar

  const data = useStaticQuery(graphql`
    query postsByTags {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: ASC }) {
        categories: group(field: frontmatter___tags) {
          name: fieldValue
          posts: edges {
            node {
              frontmatter {
                title
                date
              }
              fields {
                slug
              }
            }
          }
        }
      }
    }
  `)

  const postsByTags = data.allMarkdownRemark

  // if (isRootPath) {
  //   header = (
  //     <h1 className="main-heading">
  //       <Link to="/">{title}</Link>
  //     </h1>
  //   )
  //   sidebar = null
  // } else {
  //   header = (
  //     <Link className="header-link-home" to="/">
  //       {title}
  //     </Link>
  //   )
  //   sidebar = <LeftNavigation data={postsByTags} location={location} />
  // }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <Link to="/">Today I Learn</Link>
      </header>
      <div className="contents-wrap">
        <main>{children}</main>
        <footer>
          © 2021, COPYRIGHT ALL RIGHT
          <a href="https://www.gatsbyjs.com"></a>
        </footer>
      </div>
    </div>
  )
}

export default Layout
