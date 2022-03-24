const path = require('path')

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const productTemplate = path.resolve('./src/templates/product.tsx')

  const result = await graphql(
    `
      {
        allContentfulProduct {
          nodes {
            slug
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your Contentful products`,
      result.errors
    )
    return
  }

  const products = result.data.allContentfulProduct.nodes
  console.log('Products ===> ', products);

  if (products.length > 0) {
    products.forEach((product) => {
      createPage({
        path: `/products/${product.slug}/`,
        component: productTemplate,
        context: {
          slug: product.slug
        },
      })
    })
  }
}
