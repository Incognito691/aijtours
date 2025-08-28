#!/usr/bin/env node

// Script to submit sitemap to Google Search Console
// Run with: node scripts/submit-sitemap.js

const https = require("https");
const fs = require("fs");

const SITE_URL = "https://www.afitravelandtourism.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

async function submitSitemap() {
  console.log("🔍 Submitting sitemap to Google Search Console...");
  console.log(`Sitemap URL: ${SITEMAP_URL}`);

  // Check if sitemap is accessible
  try {
    const response = await fetch(SITEMAP_URL);
    if (response.ok) {
      console.log("✅ Sitemap is accessible");
      console.log("📝 Manual steps to complete:");
      console.log("1. Go to Google Search Console");
      console.log("2. Navigate to Sitemaps section");
      console.log("3. Add this sitemap URL: sitemap.xml");
      console.log("4. Click Submit");
    } else {
      console.log("❌ Sitemap is not accessible");
      console.log("Response status:", response.status);
    }
  } catch (error) {
    console.error("❌ Error checking sitemap:", error.message);
  }
}

submitSitemap();
