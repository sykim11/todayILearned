const path = require(`path`)
const { fmImagesToRelative } = require("gatsby-remark-relative-images-v2")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for page
  const mainPost = path.resolve(`./src/pages/index.js`)
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
    `
  )
  const groupResult = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }) {
          categories: group(field: frontmatter___tags) {
            name: fieldValue
            totalCount
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }
  if (groupResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      groupResult.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  const groups = groupResult.data.allMarkdownRemark.categories
  console.log(groups)

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  if (groups.length > 0) {
    groups.forEach((ctr, index) => {
      createPage({
        path: `/${ctr.name}`,
        component: mainPost,
        context: {
          tag: ctr.name,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  fmImagesToRelative(node)

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      image: File @fileByRelativePath
    }

    type Fields {
      slug: String
    }
  `)
}
