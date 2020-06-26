import React from "react"
import { graphql, Link } from "gatsby"
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
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import useContentfulImage from "../utils/useContentfulImage"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"

import SEO from "../components/seo"

import styled from "styled-components"

const IframeContainer = styled.span`
  padding-bottom: 56.25%;
  position: relative;
  display: block;
  width: 100%;

  > iframe {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`

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
          node.data.target.fields.description
            ? node.data.target.fields.description["ja-JP"]
            : node.data.target.fields.title["ja-JP"]
        }
      />
    ),
    [INLINES.HYPERLINK]: node => {
      if (node.data.uri.includes("youtube.com/embed")) {
        return (
          <IframeContainer>
            <iframe
              title={node.data.url}
              src={node.data.uri}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </IframeContainer>
        )
      } else if (node.data.uri.includes("tableau.com")) {
        return (
          <IframeContainer>
            <iframe
              title={node.data.url}
              src={`${node.data.uri}&:showVizHome=no&:embed=true`}
            ></iframe>
          </IframeContainer>
        )
      }
    },
  },
  renderText: text => {
    return text.split("\n").reduce((children, textSegment, index) => {
      return [...children, index > 0 && <br key={index} />, textSegment]
    }, [])
  },
}

export const query = graphql`
  query($id: String!) {
    contentfulBlogPost(id: { eq: $id }) {
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
        file {
          details {
            image {
              width
              height
            }
          }
          url
        }
      }
      content {
        json
      }
      tableauTitle
      tableauUrl {
        tableauUrl
      }
      tableauWidth
      tableauHeight
    }
  }
`

export default ({ data, pageContext, location }) => (
  <Layout>
    <SEO
      pagetitle={data.contentfulBlogPost.title}
      pagedesc={`${documentToPlainTextString(
        data.contentfulBlogPost.content.json
      ).slice(0, 70)}…`}
      pagepath={location.pathname}
      blogimg={`https:${data.contentfulBlogPost.eyecatch.file.url}`}
      pageimgw={data.contentfulBlogPost.eyecatch.file.details.image.width}
      pageimgh={data.contentfulBlogPost.eyecatch.file.details.image.height}
    />
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
            <ul>
              {data.contentfulBlogPost.category.map(cat => (
                <li className={cat.categorySlug} key={cat.id}>
                  <Link to={`/cat/${cat.categorySlug}/`}>{cat.category}</Link>
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
          {data.contentfulBlogPost.tableauUrl && (
            <iframe
              title={data.contentfulBlogPost.tableauTitle}
              src={`${data.contentfulBlogPost.tableauUrl.tableauUrl}&:showVizHome=no&:embed=true`}
              width={data.contentfulBlogPost.tableauWidth}
              height={data.contentfulBlogPost.tableauHeight}
            />
          )}
        </div>
        <ul className="postlink">
          {pageContext.next && (
            <li className="prev">
              <Link to={`/blog/post/${pageContext.next.slug}`} rel="prev">
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>{pageContext.next.title}</span>
              </Link>
            </li>
          )}
          {pageContext.previous && (
            <li className="next">
              <Link to={`/blog/post/${pageContext.previous.slug}`} rel="prev">
                <span>次の記事</span>
                <FontAwesomeIcon icon={faChevronRight} />
                <span>{pageContext.previous.title}</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </article>
  </Layout>
)
