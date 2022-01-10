/**
 * left navigation component that queries for menu data
 * with Gatsby's useStaticQuery component ?
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const LeftNavigation = ({ data }) => {
  // const data = useStaticQuery(graphql`
  //   query BioQuery {
  //     site {
  //       siteMetadata {
  //         author {
  //           name
  //           summary
  //         }
  //         social {
  //           twitter
  //         }
  //       }
  //     }
  //   }
  // `)
  React.useEffect(() => {
    console.log(data)
  }, [])

  return (
    <div className="left-navigation">
      <p>
        <Link to="/">Home</Link>
      </p>
      <ul className="sidebar-links">
        {data?.group?.map((group, index) => (
          <li key={index}>
            <section>
              <p className="sidebar">{group.fieldValue}</p>
              <ul>
                {group.nodes?.map((list, index) => (
                  <li key={index}>
                    <Link to={list.fields.slug}>{list.frontmatter.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeftNavigation
