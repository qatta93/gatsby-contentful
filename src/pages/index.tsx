import * as React from "react"
import { graphql, Link } from "gatsby"

// markup
const IndexPage = ({ data }: any) => {
  return (
  <>
    <h1>Hello world</h1>
    {data.allContentfulProduct.nodes.map((product: any) => (
      <div key={product.id}>
        <p>{product.name}</p>
        <p>{product.price}</p>
        <Link to={`/products/${product.slug}`}>Go to product</Link>
      </div>
    ))}
  </>
  )
}

export const query = graphql`
  query IndexPageQuery {
    allContentfulProduct {
      nodes {
        name
        price
        id
        slug
      }
    }
  }
`

export default IndexPage
