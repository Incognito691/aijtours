/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://afitravelandtourism.com", // Replace with your real domain
  generateRobotsTxt: true, // optional, generates robots.txt
  sitemapSize: 5000, // optional, number of URLs per sitemap file
  changefreq: "daily", // optional, how often pages are likely to change
  priority: 0.7, // optional, default priority for pages
  exclude: ["/admin/*"], // optional, pages to exclude from sitemap
};
