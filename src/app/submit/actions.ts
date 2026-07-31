"use server";

import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";

// Mock submit action
export async function submitProduct(data: any) {
  // Mock artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Here we would normally save to the database via Prisma or Supabase.
  // And we would verify the user's session.
  
  console.log("Mock submitted product:", data);

  return { success: true, productId: "mock_id_" + Date.now() };
}

// Scrape and analyze URL
export async function scrapeAndAnalyzeUrl(url: string) {
  try {
    // 1. Fetch HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // 2. Extract content with cheerio
    const $ = cheerio.load(html);

    const ogTitle = $('meta[property="og:title"]').attr("content") || $("title").text();
    const ogDescription = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    
    let favicon = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href");
    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(url);
      favicon = new URL(favicon, urlObj.origin).href;
    }

    // Get some visible text for context (limit to ~2000 chars to save tokens)
    $("script, style, noscript").remove();
    const visibleText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 2000);

    // 3. Send to Claude API
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.warn("No CLAUDE_API_KEY found, returning mock data");
      // Return mock data if no API key
      return {
        success: true,
        data: {
          name: ogTitle ? ogTitle.split('|')[0].trim() : "Unknown App",
          tagline: ogDescription ? ogDescription.substring(0, 60) : "A cool new product",
          description: ogDescription ? `${ogDescription} ${visibleText.substring(0, 500)}` : "Detailed description here...",
          suggestedCategory: "SaaS",
          suggestedTags: ["startup", "tech"],
          pricingType: "freemium",
          favicon: favicon || null,
          ogImage: ogImage || null,
        }
      };
    }

    const anthropic = new Anthropic({ apiKey });
    
    const prompt = `
      Analyze this website content and extract key product details.
      
      URL: ${url}
      Title: ${ogTitle || ""}
      Description: ${ogDescription || ""}
      Visible Text (partial): ${visibleText}
      
      Return ONLY valid JSON with exactly these fields:
      {
        "name": "Product Name",
        "tagline": "A punchy tagline (max 60 chars)",
        "description": "A well-written description of what the product does (150-300 words)",
        "suggestedCategory": "One main category (e.g., Developer Tools, Productivity, SaaS, AI)",
        "suggestedTags": ["tag1", "tag2", "tag3"] (array of strings, max 5 tags),
        "pricingType": "free" or "freemium" or "paid" or "open_source"
      }
    `;

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: "You are an AI product data extractor. You return ONLY valid JSON and nothing else.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const contentText = msg.content.find(block => block.type === 'text')?.text || "";
    
    // Parse the JSON (sometimes Claude includes markdown blocks like ```json ... ```)
    let parsedJson;
    try {
      const jsonMatch = contentText.match(/```json\n([\s\S]*)\n```/) || contentText.match(/```\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : contentText;
      parsedJson = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Failed to parse Claude API response as JSON");
    }

    return {
      success: true,
      data: {
        ...parsedJson,
        favicon: favicon || null,
        ogImage: ogImage || null,
      }
    };
    
  } catch (error: any) {
    console.error("Scraping error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze URL",
    };
  }
}
