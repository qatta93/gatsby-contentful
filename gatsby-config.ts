import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: ``,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: 'gatsby-source-contentful',
    options: {
      "accessToken": "BuEhC6zA1nAZj-Uo4dC7B3oJ7hIc3u9YsixD1e1ejKc",
      "spaceId": ""
    }
  }]
};

export default config;
