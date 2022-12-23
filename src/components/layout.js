import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import LeftNavigation from "./lefNavigation"
import Seo from "./seo"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header, sidebar

  const data = useStaticQuery(graphql`
    query postsByTags($tag: String) {
      posts: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { tags: { eq: $tag } } }
      ) {
        categories: group(field: frontmatter___tags) {
          name: fieldValue
          totalCount
        }
        nodes {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            tags
            description
            publish
            image {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `)

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <Link to="/">Today I Learn</Link>
      </header>
      <Seo title="All posts" />
      <div className="contents-wrap">
        <main>{children}</main>
        <footer>
          © 2021, COPYRIGHT ALL RIGHT KSY8230
          <a href="https://www.gatsbyjs.com"></a>
        </footer>
      </div>
    </div>
  )
}

export default Layout
