import * as React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import * as list from "../components/home.module.css"
import Img from "gatsby-image"

const BlogMain = ({ data, location }) => {
  const posts = data.posts.nodes.filter(post => post.frontmatter.publish)
  const categories = data.categories
  const default_tag = "전체"

  const [postList, setPostList] = React.useState(posts)
  const [currentTag, setCurrentTag] = React.useState(default_tag)

  const handleClickTag = tag => {
    const filteredPost = posts?.filter(post =>
      post?.frontmatter?.tags.includes(tag)
    )
    setPostList(filteredPost)
    setCurrentTag(tag)
  }
  const handleGetAll = () => {
    setPostList(posts)
    setCurrentTag(default_tag)
  }

  if (posts.length === 0) {
    return (
      <Layout location={location}>
        <Bio />
        <p>블로그 글들을 확인할 수 없습니다.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location}>
      <Bio />
      <div className={list.tagsWrap}>
        <div
          onClick={handleGetAll}
          className={`${currentTag === "전체" && list.post_tag_active} ${
            list.post_tag
          }`}
        >
          <span className={list.post_tag_txt}>전체</span>
          <span className={list.post_tag_count}>{categories.totalCount}</span>
        </div>
        {categories.all?.map((ctr, i) => (
          <div
            key={i}
            onClick={() => handleClickTag(ctr.name)}
            className={`${currentTag === ctr.name && list.post_tag_active} ${
              list.post_tag
            }`}
          >
            <span className={list.post_tag_txt}># {ctr.name}</span>
            <span className={list.post_tag_count}>{ctr.totalCount}</span>
          </div>
        ))}
      </div>
      <div className={list.postsWrap}>
        {postList?.map((post, i) => {
          return (
            <div key={i} className={list.post}>
              <div className={list.thumbnail}>
                <Img fluid={post.frontmatter.image?.childImageSharp?.fluid} />
              </div>

              <div className={list.post_content}>
                {post.frontmatter.tags?.map(tag => (
                  <span className={list.post_list_tag}>#{tag}</span>
                ))}
                <p className={list.post_content_title}>
                  <Link to={`${post.fields.slug}`} itemProp="url">
                    {post.frontmatter.title}
                  </Link>
                </p>
                <small>{post.frontmatter.date}</small>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default React.memo(BlogMain)

export const pageQuery = graphql`
  query BlogMain {
    site {
      siteMetadata {
        title
      }
    }
    categories: allMarkdownRemark(
      sort: { fields: frontmatter___date, order: ASC }
      filter: { frontmatter: { publish: { eq: true } } }
    ) {
      totalCount
      all: group(field: frontmatter___tags) {
        name: fieldValue
        totalCount
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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
`
