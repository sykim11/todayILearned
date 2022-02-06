import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import LeftNavigation from "./lefNavigation"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header, sidebar

  // console.log(location, title, children)

  const data = useStaticQuery(graphql`
    query postsByTags {
      allMarkdownRemark {
        group(field: frontmatter___tags) {
          fieldValue
          nodes {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  const postsByTags = data.allMarkdownRemark

  console.log(data)

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
    sidebar = null
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
    sidebar = <LeftNavigation data={postsByTags} location={location} />
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <nav>{sidebar}</nav>
      <div className="contents-wrap">
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </div>
  )
}

export default Layout
