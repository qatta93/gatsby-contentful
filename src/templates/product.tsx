import React from 'react';
import { graphql } from 'gatsby';


const ProductTemplate = ({ data }: any) => {
  console.log(data);
  const product = data.contentfulProduct;
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <p>{product.description.description}</p>
      <p>{product.price}</p>
    </div>
  )
}

export const query = graphql`
  query ProductBySlug($slug: String!) {
    contentfulProduct(slug: {eq: $slug}) {
      description {
        description
      }
      id
      category
      price
      name
    }
  }
`

export default ProductTemplate;