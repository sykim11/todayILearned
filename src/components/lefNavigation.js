/**
 * left navigation component that queries for menu data
 * with Gatsby's useStaticQuery component ?
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

const LeftNavigation = ({ data, location }) => {
  const [currentPath, setCurrentPath] = React.useState(
    location.pathname.split("/")[2]
  )
  const [selected, setSelected] = React.useState()

  React.useEffect(() => {
    const currentCategory = location.pathname.split("/")[2]
    setCurrentPath(currentCategory)
    console.log(currentCategory)
    console.log(currentPath)
    console.log(selected)
    console.log(location.host)
    console.log(location.pathname.split("/"))
  }, [])

  const onClickCategory = index => {
    setSelected(index)
    setCurrentPath(location.pathname.split("/")[2])
  }

  return (
    <div className="left-navigation">
      <div className="home">
        <Link to="/">Home</Link>
      </div>
      <ul className="sidebar-links">
        {console.log(data?.categories)}
        {data?.categories?.map((group, index) => (
          <li
            key={index}
            className={
              currentPath === group.name || selected === index ? "open" : ""
            }
            onClick={() => onClickCategory(index)}
          >
            <section>
              <p className="sidebar">{group.name}</p>
              <ul>
                {console.log("group.nodes", group.nodes)}
                {group.posts?.map(({ node }, index) => (
                  <li key={index}>
                    <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
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
