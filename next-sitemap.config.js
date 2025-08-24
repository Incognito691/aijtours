/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.afitravelandtourism.com", // use www
  generateRobotsTxt: true, // generates robots.txt
  sitemapSize: 5000, // number of URLs per sitemap file
  changefreq: "daily", // how often pages are likely to change
  priority: 0.7, // default priority for pages
  exclude: ["/admin/*"], // pages to exclude from sitemap
};
