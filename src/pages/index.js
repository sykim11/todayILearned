import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as list from "../components/home.module.css"

const BlogMain = ({ data, location }) => {
  const posts = data.posts.nodes.filter(
    post => post.frontmatter.publish === true
  )
  const categories = data.categories

  if (posts.length === 0) {
    return (
      <Layout location={location}>
        <Seo title="All posts" />
        <Bio />
        <p>블로그 글들을 확인할 수 없습니다.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location}>
      <Seo title="All posts" />
      <Bio />
      <div className={list.tagsWrap}>
        <div className={list.post_tag}>
          <Link to={`/`}>
            <span className={list.post_tag_txt}>전체</span>
            <span className={list.post_tag_count}>{categories.totalCount}</span>
          </Link>
        </div>
        {categories.all?.map(ctr => (
          <div className={list.post_tag}>
            <Link to={`/${ctr.name}`}>
              <span className={list.post_tag_txt}># {ctr.name}</span>
              <span className={list.post_tag_count}>{ctr.totalCount}</span>
            </Link>
          </div>
        ))}
      </div>
      <div className={list.postsWrap}>
        {posts?.map((post, i) => {
          return (
            <div key={i} className={list.post}>
              <div className={list.thumbnail}></div>
              <div className={list.post_content}>
                <span className={list.post_tag}>
                  <span className={list.post_tag_txt}>
                    # {`${post.frontmatter.tags?.[0] || ""}`}
                  </span>
                </span>
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

export default BlogMain

export const pageQuery = graphql`
  query BlogMain($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    categories: allMarkdownRemark(
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      totalCount
      all: group(field: frontmatter___tags) {
        name: fieldValue
        totalCount
      }
    }
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
        }
      }
    }
  }
`
