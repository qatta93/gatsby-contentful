import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';


const ProductTemplate = ({ data }: any) => {
  const [quantity, setQuantity] = useState(0);
  const product = data.contentfulProduct;

  useEffect(() => {
    const fetchQuantity = async () => {
      const response = await fetch('/.netlify/functions/productQuantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: product.slug
        })
      })
      const data = await response.json();
      setQuantity(data.quantity);
    }
    fetchQuantity();
  }, [])

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <p>{product.description.description}</p>
      <p>{product.price}</p>
      <p>{quantity}</p>
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
      slug
    }
  }
`

export default ProductTemplate;