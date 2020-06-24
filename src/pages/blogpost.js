import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import {
  faChevronLeft,
  faChevronRight,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons"

import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import useContentfulImage from "../utils/useContentfulImage"

const options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2>
        <FontAwesomeIcon icon={faCheckSquare} />
        {children}
      </h2>
    ),
    [BLOCKS.EMBEDDED_ASSET]: node => (
      <Img
        fluid={useContentfulImage(node.data.target.fields.file["ja-JP"].url)}
        alt={
          node.data.target.fields.description["ja-JP"]
            ? node.data.target.fields.description["ja-JP"]
            : node.data.target.fields.title["ja-JP"]
        }
      />
    ),
  },
  renderText: text => {
    return text.split("\n").reduce((children, textSegment, index) => {
      return [...children, index > 0 && <br key={index} />, textSegment]
    }, [])
  },
}

export const query = graphql`
  query {
    contentfulBlogPost {
      title
      publishDateJP: publishDate(formatString: "YYYY年MM月DD日")
      publishDate
      category {
        category
        categorySlug
        id
      }
      eyecatch {
        fluid(maxWidth: 1600) {
          ...GatsbyContentfulFluid_withWebp
        }
        description
      }
      content {
        json
      }
    }
  }
`

export default ({ data }) => (
  <Layout>
    <div className="eyecatch">
      <figure>
        <Img
          fluid={data.contentfulBlogPost.eyecatch.fluid}
          alt="{data.contentfulBlogPost.eyecatch.description}"
        />
      </figure>
    </div>
    <article className="content">
      <div className="container">
        <h1 className="bar">{data.contentfulBlogPost.title}</h1>
        <aside className="info">
          <time dateTime={data.contentfulBlogPost.publishDate}>
            <FontAwesomeIcon icon={faClock} />
            {data.contentfulBlogPost.publishDateJP}
          </time>
          <div className="cat">
            <FontAwesomeIcon icon={faFolderOpen} />
            <i className="far fa-folder-open" />
            <ul>
              {data.contentfulBlogPost.category.map(cat => (
                <li className={cat.categorySlug} key={cat.id}>
                  {cat.category}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="postbody">
          {documentToReactComponents(
            data.contentfulBlogPost.content.json,
            options
          )}
        </div>
        <ul className="postlink">
          <li className="prev">
            <a href="base-blogpost.html" rel="prev">
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>前の記事</span>
            </a>
          </li>
          <li className="next">
            <a href="base-blogpost.html" rel="next">
              <span>次の記事</span>
              <FontAwesomeIcon icon={faChevronRight} />
              <i className="fas fa-chevron-right" />
            </a>
          </li>
        </ul>
      </div>
    </article>
  </Layout>
)
