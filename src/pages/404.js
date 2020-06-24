import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default () => (
  <Layout>
    <SEO pagetitle="ページが見つかりません" />
    <h1 style={{ padding: "20vh 0", textAlign: "center" }}>
      お探しのページが見つかりませんでした
    </h1>
  </Layout>
)
