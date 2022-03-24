import type { GatsbyConfig } from "gatsby";
require('dotenv').config();

const config: GatsbyConfig = {
  siteMetadata: {
    title: ``,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        "accessToken": process.env.ACCESS_TOKEN,
        "spaceId": process.env.SPACE_ID
      }
    }, 
    "gatsby-plugin-image"
  ]
};

export default config;
