/* Generated from research/commerce-intelligence/free-source-registry.json. Do not edit by hand. */
(function () {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  window.VorgCommerceLibrary = deepFreeze({
  "schemaVersion": 1,
  "libraryVersion": "VORG Free Commerce Library v1.2",
  "checkedOn": "2026-07-22",
  "truthBoundary": "This registry is a broad maintained portfolio of lawfully accessible sources, not a claim that every free commerce resource on the internet has been exhausted. Public pages, newsletters, platform tools, and operator claims are distilled rather than copied. Local AI-assisted full-text ingestion requires an item-level public-domain basis or an explicit licence whose edition terms, commercial-use conditions, asset exceptions, and AI restrictions permit the intended use.",
  "sources": [
    {
      "id": "S001",
      "name": "Scientific Advertising",
      "publisher": "Library of Congress / Claude C. Hopkins",
      "lens": "Fundamentals",
      "sourceType": "public_domain_book",
      "url": "https://www.loc.gov/item/23009362/",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "B",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E15"
      ],
      "note": "Historical source. Re-test every mechanism in modern channels."
    },
    {
      "id": "S002",
      "name": "My Life in Advertising",
      "publisher": "Library of Congress / Claude C. Hopkins",
      "lens": "Fundamentals",
      "sourceType": "public_domain_book",
      "url": "https://www.loc.gov/item/27024090/",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "B",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E01",
        "E02",
        "E19"
      ],
      "note": "Operator autobiography; useful mechanisms, not controlled evidence."
    },
    {
      "id": "S003",
      "name": "The Garment Buyer's Ad. Book",
      "publisher": "Library of Congress",
      "lens": "Fashion",
      "sourceType": "public_domain_book",
      "url": "https://www.loc.gov/item/07034028/",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "C",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E02",
        "E18",
        "E24",
        "E25"
      ],
      "note": "Historic clothing-ad reference; mine language and merchandising patterns, never modern performance claims."
    },
    {
      "id": "S004",
      "name": "The Science of Applied Salesmanship",
      "publisher": "Library of Congress / James Samuel Knox",
      "lens": "Fundamentals",
      "sourceType": "public_domain_book",
      "url": "https://www.loc.gov/item/11016795/",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "C",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E01",
        "E21",
        "E28"
      ],
      "note": "Historical sales doctrine; validate against modern customer behaviour."
    },
    {
      "id": "S005",
      "name": "Business Administration, Vol. 1",
      "publisher": "Project Gutenberg",
      "lens": "Operations",
      "sourceType": "public_domain_book",
      "url": "https://www.gutenberg.org/ebooks/56018",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "C",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E15",
        "E21",
        "E23"
      ],
      "note": "Public-domain business reference; historically bounded."
    },
    {
      "id": "S006",
      "name": "A History of Advertising from the Earliest Times",
      "publisher": "Project Gutenberg / Henry Sampson",
      "lens": "Fundamentals",
      "sourceType": "public_domain_book",
      "url": "https://www.gutenberg.org/ebooks/54149",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "C",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E02",
        "E03",
        "E12"
      ],
      "note": "Pattern history, not an effectiveness benchmark."
    },
    {
      "id": "S007",
      "name": "An Idea That Saved a Business",
      "publisher": "Project Gutenberg / Leonard Dreyfuss",
      "lens": "Creative",
      "sourceType": "public_domain_book",
      "url": "https://www.gutenberg.org/ebooks/77052",
      "access": "open",
      "rightsBasis": "public-domain",
      "defaultTier": "C",
      "refresh": "static",
      "ingestionMode": "full-text-allowed",
      "feedsTactics": [
        "E03",
        "E12",
        "E20"
      ],
      "note": "Historical case pamphlet; separate its self-promotion from the mechanism."
    },
    {
      "id": "S008",
      "name": "DTC Midas on X",
      "publisher": "DTC Midas",
      "lens": "Creative",
      "sourceType": "operator_public",
      "url": "https://x.com/DTCMidas",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "metadata-and-distill",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E04",
        "E21"
      ],
      "note": "Operator-reported. Full history requires lawful X archive access or a creator export."
    },
    {
      "id": "S009",
      "name": "DTC Midas Public Thread Index",
      "publisher": "Thread Reader",
      "lens": "Creative",
      "sourceType": "operator_public",
      "url": "https://threadreaderapp.com/user/DTCMidas",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "metadata-and-distill",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E04",
        "E21"
      ],
      "note": "Partial public index; do not represent it as all posts."
    },
    {
      "id": "S010",
      "name": "Nik Sharma Free DTC Newsletter",
      "publisher": "Nik Sharma",
      "lens": "Launch",
      "sourceType": "operator_public",
      "url": "https://visit.nik.co/subscribe/",
      "access": "free-opt-in",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "consented-newsletter-distill",
      "feedsTactics": [
        "E09",
        "E15",
        "E21",
        "E26"
      ],
      "note": "Keep summaries and source links; do not republish full issues."
    },
    {
      "id": "S011",
      "name": "Sharma Brands Newsletter Archive",
      "publisher": "Sharma Brands",
      "lens": "Launch",
      "sourceType": "operator_public",
      "url": "https://sharmabrands.com/blogs/newsletter",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E15",
        "E21",
        "E26",
        "E29"
      ],
      "note": "Operator material; claims remain operator-reported."
    },
    {
      "id": "S012",
      "name": "Dara Denney Free Creative Education",
      "publisher": "Dara Denney",
      "lens": "Creative",
      "sourceType": "operator_public",
      "url": "https://www.daradenney.com/about",
      "access": "open",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E01",
        "E03",
        "E04",
        "E06"
      ],
      "note": "Use public YouTube/newsletter material; exclude paid products unless licensed."
    },
    {
      "id": "S013",
      "name": "The Social Savannah",
      "publisher": "Savannah Sanchez",
      "lens": "Creative",
      "sourceType": "operator_public",
      "url": "https://thesocialsavannah.com/",
      "access": "open",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E04",
        "E05",
        "E06",
        "E07"
      ],
      "note": "Use only public articles and creator-posted material."
    },
    {
      "id": "S014",
      "name": "Building Ads With Barry",
      "publisher": "Barry Hott",
      "lens": "Creative",
      "sourceType": "operator_public",
      "url": "https://www.buildingadswithbarry.com/",
      "access": "open-limited",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E03",
        "E04",
        "E05"
      ],
      "note": "Public material only; paid community content requires a licence."
    },
    {
      "id": "S015",
      "name": "Chase Dimond Free Resources",
      "publisher": "Chase Dimond",
      "lens": "Lifecycle",
      "sourceType": "operator_public",
      "url": "https://www.chasedimond.com/",
      "access": "open-limited",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ],
      "note": "Separate free posts from protected paid training."
    },
    {
      "id": "S016",
      "name": "Moiz's Newsletter",
      "publisher": "Moiz Ali",
      "lens": "Finance",
      "sourceType": "operator_public",
      "url": "https://mz-newsletter.beehiiv.com/",
      "access": "free-opt-in",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "consented-newsletter-distill",
      "feedsTactics": [
        "E15",
        "E19",
        "E22",
        "E23"
      ],
      "note": "Operator-reported; retain P&L and scale context when provided."
    },
    {
      "id": "S017",
      "name": "Limited Supply Podcast",
      "publisher": "Limited Supply",
      "lens": "Operations",
      "sourceType": "operator_public",
      "url": "https://podcasts.apple.com/us/podcast/limited-supply/id1635582800",
      "access": "open",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E15",
        "E19",
        "E23",
        "E29"
      ],
      "note": "Distill episodes; do not reproduce transcripts without permission."
    },
    {
      "id": "S018",
      "name": "Common Thread Collective Insights",
      "publisher": "Common Thread Collective",
      "lens": "Finance",
      "sourceType": "operator_public",
      "url": "https://commonthreadco.com/",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E15",
        "E22",
        "E23",
        "E29"
      ],
      "note": "Use public insights only; vendor figures are vendor-reported."
    },
    {
      "id": "S019",
      "name": "The Good Ecommerce Insights",
      "publisher": "Jon MacDonald / The Good",
      "lens": "CRO",
      "sourceType": "operator_public",
      "url": "https://thegood.com/insights/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E24",
        "E25"
      ],
      "note": "Agency-authored; treat examples as directional unless methods are described."
    },
    {
      "id": "S020",
      "name": "Baymard Free Ecommerce UX Articles",
      "publisher": "Baymard Institute",
      "lens": "CRO",
      "sourceType": "research",
      "url": "https://baymard.com/blog",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E24",
        "E25",
        "E27"
      ],
      "note": "Use free published findings only; Premium research is out of scope unless licensed."
    },
    {
      "id": "S021",
      "name": "Shopify Ecommerce Blog",
      "publisher": "Shopify",
      "lens": "Operations",
      "sourceType": "platform_education",
      "url": "https://www.shopify.com/blog",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "weekly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E15",
        "E20",
        "E22",
        "E26"
      ],
      "note": "Platform-authored and commercially interested; verify claims and dates."
    },
    {
      "id": "S022",
      "name": "Shopify Ecommerce Case Studies",
      "publisher": "Shopify",
      "lens": "Operations",
      "sourceType": "platform_case_study",
      "url": "https://www.shopify.com/enterprise/blog/topics/case-study",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E15",
        "E20",
        "E21",
        "E29"
      ],
      "note": "Vendor-reported results; preserve brand, period, scale, and comparison."
    },
    {
      "id": "S023",
      "name": "Meta Ad Library",
      "publisher": "Meta",
      "lens": "Live Ads",
      "sourceType": "live_market_intelligence",
      "url": "https://www.facebook.com/ads/library/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "weekly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E03",
        "E04",
        "E05",
        "E08"
      ],
      "note": "Active-ad presence is not proof of profitability. Record first/last seen and format only."
    },
    {
      "id": "S024",
      "name": "Meta Ad Creative Guide",
      "publisher": "Meta",
      "lens": "Creative",
      "sourceType": "platform_education",
      "url": "https://www.facebook.com/business/ads/ad-creative",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E03",
        "E05",
        "E06"
      ],
      "note": "Platform recommendation; test transfer locally."
    },
    {
      "id": "S025",
      "name": "Meta Performance 5",
      "publisher": "Meta",
      "lens": "Paid Social",
      "sourceType": "platform_education",
      "url": "https://www.facebook.com/business/ads/performance-marketing",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E03",
        "E05",
        "E08",
        "E21"
      ],
      "note": "Platform-reported recommendations and results; preserve footnotes."
    },
    {
      "id": "S026",
      "name": "Meta Advantage+ Creative",
      "publisher": "Meta",
      "lens": "AI",
      "sourceType": "platform_education",
      "url": "https://www.facebook.com/business/ads/meta-advantage-plus/creative",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E03",
        "E05",
        "E06"
      ],
      "note": "AI can produce variants; VORG truth, product accuracy, rights, and performance still require human review."
    },
    {
      "id": "S027",
      "name": "Meta Reels Ads",
      "publisher": "Meta",
      "lens": "Creative",
      "sourceType": "platform_education",
      "url": "https://www.facebook.com/business/ads/facebook-instagram-reels-ads",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E05",
        "E06",
        "E07"
      ],
      "note": "Platform guidance; clear audio, creator, and placement rights."
    },
    {
      "id": "S028",
      "name": "TikTok Creative Center",
      "publisher": "TikTok for Business",
      "lens": "Live Ads",
      "sourceType": "live_market_intelligence",
      "url": "https://ads.tiktok.com/business/creativecenter/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "weekly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E03",
        "E04",
        "E05",
        "E08"
      ],
      "note": "Use patterns and timing; never copy footage, music, likeness, or wording."
    },
    {
      "id": "S029",
      "name": "TikTok Creative Center Trends",
      "publisher": "TikTok for Business",
      "lens": "Discovery",
      "sourceType": "live_market_intelligence",
      "url": "https://ads.tiktok.com/help/article/how-to-use-trends",
      "access": "free-account",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "weekly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E04",
        "E08",
        "E30"
      ],
      "note": "Filter by geography and industry. Trend momentum is not purchase intent."
    },
    {
      "id": "S030",
      "name": "TikTok Creative Solutions",
      "publisher": "TikTok for Business",
      "lens": "Creative",
      "sourceType": "platform_education",
      "url": "https://ads.tiktok.com/business/en/products/creative",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E03",
        "E04",
        "E05",
        "E06"
      ],
      "note": "Platform-authored. Diversification recommendations need VORG budget limits."
    },
    {
      "id": "S031",
      "name": "TikTok Fashion Playbook",
      "publisher": "TikTok for Business",
      "lens": "Fashion",
      "sourceType": "platform_playbook",
      "url": "https://ads.tiktok.com/business/library/ENG_TikTok_Fashion_META_Playbook_New.pdf",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E04",
        "E06",
        "E07",
        "E25"
      ],
      "note": "Platform fashion guidance. Cite edition and date; do not copy creative assets."
    },
    {
      "id": "S032",
      "name": "Google Free Product Listings",
      "publisher": "Google Merchant Center",
      "lens": "Discovery",
      "sourceType": "platform_documentation",
      "url": "https://support.google.com/merchants/answer/13889434?hl=en",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E30"
      ],
      "note": "Official requirements. Eligibility does not guarantee impressions."
    },
    {
      "id": "S033",
      "name": "Google Free Local Listings",
      "publisher": "Google Merchant Center",
      "lens": "Local",
      "sourceType": "platform_documentation",
      "url": "https://support.google.com/merchants/answer/15310605?hl=en-001",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E20",
        "E30"
      ],
      "note": "Relevant only when accurate local inventory and store information exist."
    },
    {
      "id": "S034",
      "name": "Merchant Center Key Event Tracking",
      "publisher": "Google Merchant Center",
      "lens": "Measurement",
      "sourceType": "platform_documentation",
      "url": "https://support.google.com/merchants/answer/14166401?hl=en-001",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E23",
        "E30"
      ],
      "note": "Official measurement setup; test site handling of URL parameters."
    },
    {
      "id": "S035",
      "name": "GA4 Recommended Ecommerce Events",
      "publisher": "Google Analytics",
      "lens": "Measurement",
      "sourceType": "platform_documentation",
      "url": "https://support.google.com/analytics/answer/12200568",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E15",
        "E21",
        "E22",
        "E23",
        "E26",
        "E27"
      ],
      "note": "Use as the event naming spine; verify implementation in DebugView and reports."
    },
    {
      "id": "S036",
      "name": "Google Analytics Academy",
      "publisher": "Google",
      "lens": "Measurement",
      "sourceType": "free_course",
      "url": "https://support.google.com/analytics/answer/15440208?hl=en",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "course-notes-only",
      "feedsTactics": [
        "E21",
        "E22",
        "E23",
        "E26",
        "E30"
      ],
      "note": "Free official training. Store notes and completions, not copied course content."
    },
    {
      "id": "S037",
      "name": "Google Ads Transparency Center",
      "publisher": "Google",
      "lens": "Live Ads",
      "sourceType": "live_market_intelligence",
      "url": "https://adstransparency.google.com/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "weekly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E03",
        "E08",
        "E21"
      ],
      "note": "Presence and longevity are observational signals, not ROAS proof."
    },
    {
      "id": "S038",
      "name": "Pinterest Trends",
      "publisher": "Pinterest Business",
      "lens": "Discovery",
      "sourceType": "live_market_intelligence",
      "url": "https://help.pinterest.com/en/business/article/pinterest-trends",
      "access": "free-account",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "monthly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E04",
        "E24",
        "E30"
      ],
      "note": "Historic search/save/shopping interest; validate Ottawa/Gatineau relevance separately."
    },
    {
      "id": "S039",
      "name": "Pinterest Predicts 2026 Marketing Playbook",
      "publisher": "Pinterest Business",
      "lens": "Fashion",
      "sourceType": "platform_playbook",
      "url": "https://business.pinterest.com/en-gb/pdf/pinterest-predicts/2026-marketing-playbook",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E04",
        "E24",
        "E30"
      ],
      "note": "Platform-reported trend forecasts; use as prompts, not demand forecasts."
    },
    {
      "id": "S040",
      "name": "Klaviyo Academy",
      "publisher": "Klaviyo",
      "lens": "Lifecycle",
      "sourceType": "free_course",
      "url": "https://academy.klaviyo.com/en-us",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "course-notes-only",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ],
      "note": "Vendor training. Use first-party VORG outcomes to validate flow choices."
    },
    {
      "id": "S041",
      "name": "Klaviyo Campaign Fundamentals",
      "publisher": "Klaviyo Academy",
      "lens": "Lifecycle",
      "sourceType": "free_course",
      "url": "https://academy.klaviyo.com/en-us/learning-paths/getting-started-with-klaviyo/courses/getting-started-with-campaigns",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "course-notes-only",
      "feedsTactics": [
        "E26",
        "E27"
      ],
      "note": "Vendor course. Pair with CASL and actual deliverability data."
    },
    {
      "id": "S042",
      "name": "Mailchimp Ecommerce Resource Library",
      "publisher": "Mailchimp",
      "lens": "Lifecycle",
      "sourceType": "platform_education",
      "url": "https://mailchimp.com/resources/e-commerce/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "monthly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ],
      "note": "Vendor-authored; compliance and performance claims need independent checks."
    },
    {
      "id": "S043",
      "name": "Mailchimp Ecommerce Email Guide",
      "publisher": "Mailchimp",
      "lens": "Lifecycle",
      "sourceType": "platform_education",
      "url": "https://mailchimp.com/resources/ecommerce-email-marketing/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ],
      "note": "Use journey concepts; do not import generic benchmarks as VORG targets."
    },
    {
      "id": "S044",
      "name": "Mailchimp Ecommerce Automation Guide",
      "publisher": "Mailchimp",
      "lens": "Lifecycle",
      "sourceType": "platform_education",
      "url": "https://mailchimp.com/resources/ecommerce-email-automation/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ],
      "note": "Automation must preserve consent, suppression, and truthful triggers."
    },
    {
      "id": "S045",
      "name": "HubSpot Ecommerce Marketing Course",
      "publisher": "HubSpot Academy",
      "lens": "Fundamentals",
      "sourceType": "free_course",
      "url": "https://academy.hubspot.com/courses/ecommerce-marketing",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "course-notes-only",
      "feedsTactics": [
        "E15",
        "E21",
        "E26",
        "E28"
      ],
      "note": "Free official course; retain notes, not copied lessons."
    },
    {
      "id": "S046",
      "name": "Baymard Checkout Research Launch",
      "publisher": "Baymard Institute",
      "lens": "CRO",
      "sourceType": "research",
      "url": "https://baymard.com/blog/checkout-2024-launch",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E27"
      ],
      "note": "Research-based UX evidence. Apply only to relevant flow conditions."
    },
    {
      "id": "S047",
      "name": "Baymard Product Page UX",
      "publisher": "Baymard Institute",
      "lens": "CRO",
      "sourceType": "research",
      "url": "https://baymard.com/research/product-page",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ],
      "note": "Use only free published findings and examples unless Premium is licensed."
    },
    {
      "id": "S048",
      "name": "Core Web Vitals",
      "publisher": "web.dev / Google",
      "lens": "CRO",
      "sourceType": "platform_documentation",
      "url": "https://web.dev/articles/vitals",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22"
      ],
      "note": "Technical quality metrics; relate changes to VORG conversion evidence rather than assuming causality."
    },
    {
      "id": "S049",
      "name": "Google Ecommerce Search Documentation",
      "publisher": "Google Search Central",
      "lens": "Discovery",
      "sourceType": "platform_documentation",
      "url": "https://developers.google.com/search/docs/specialty/ecommerce",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E30"
      ],
      "note": "Official discovery guidance; search visibility is not guaranteed."
    },
    {
      "id": "S050",
      "name": "Merchant Center Product Data Specification",
      "publisher": "Google Merchant Center",
      "lens": "Operations",
      "sourceType": "platform_documentation",
      "url": "https://support.google.com/merchants/answer/7052112",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E30"
      ],
      "note": "Product data must match the live store, inventory, price, image, and policy truth."
    },
    {
      "id": "S051",
      "name": "CASL Frequently Asked Questions",
      "publisher": "CRTC",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.crtc.gc.ca/eng/com500/faq500.htm",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E26",
        "E27",
        "E30"
      ],
      "note": "Primary Canadian guidance. Consent, identification, and unsubscribe controls apply to commercial email/SMS."
    },
    {
      "id": "S052",
      "name": "CASL Implied Consent Guidance",
      "publisher": "CRTC",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://web.crtc.gc.ca/eng/com500/guide.htm",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E26",
        "E27"
      ],
      "note": "Do not stretch implied consent. Keep source and expiry records."
    },
    {
      "id": "S053",
      "name": "PIPEDA E-Marketing Guidance",
      "publisher": "Office of the Privacy Commissioner of Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/canadas-anti-spam-legislation/casl-compliance-help-for-businesses/casl_guide/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E09",
        "E26",
        "E27",
        "E30"
      ],
      "note": "No electronic-address harvesting; third-party lists still require meaningful consent and accountability."
    },
    {
      "id": "S054",
      "name": "Deceptive Marketing Practices",
      "publisher": "Competition Bureau Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/misleading-representations-and-deceptive-marketing-practices",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E13",
        "E15",
        "E17",
        "E18",
        "E22",
        "E23",
        "E28"
      ],
      "note": "Truth, total price, urgency, discounts, guarantees, and testimonials must be supportable."
    },
    {
      "id": "S055",
      "name": "Canadian Textile Labelling Requirements",
      "publisher": "Competition Bureau Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://competition-bureau.canada.ca/en/labelling/textile-labelling/textile-labelling-requirements",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ],
      "note": "Fibre content, dealer identity, and optional claims must be accurate before sale."
    },
    {
      "id": "S056",
      "name": "Textile Labelling in a Nutshell",
      "publisher": "Competition Bureau Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://competition-bureau.canada.ca/en/labelling/textile-labelling/labelling-textile-requirements-nutshell",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ],
      "note": "Operational preflight summary; consult the Act and regulations for exact cases."
    },
    {
      "id": "S057",
      "name": "Textile Flammability Industry Guide",
      "publisher": "Health Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.canada.ca/en/health-canada/services/consumer-product-safety/reports-publications/industry-professionals/industry-guide-flammability-textile.html",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ],
      "note": "Safety requirements constrain product and marketing claims."
    },
    {
      "id": "S058",
      "name": "Canadian Influencer Disclosure Guidelines",
      "publisher": "Ad Standards Canada",
      "lens": "Compliance",
      "sourceType": "industry_guidance",
      "url": "https://adstandards.ca/resources/influencer-marketing/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E05",
        "E07",
        "E10",
        "E19",
        "E28"
      ],
      "note": "Material connections should be clear, prominent, and close to the representation."
    },
    {
      "id": "S059",
      "name": "FTC Disclosures 101",
      "publisher": "U.S. Federal Trade Commission",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E05",
        "E07",
        "E10",
        "E19",
        "E28"
      ],
      "note": "Cross-border reference for U.S.-reachable campaigns; Canadian rules still require separate review."
    },
    {
      "id": "S060",
      "name": "FTC Reviews and Testimonials Rule Q&A",
      "publisher": "U.S. Federal Trade Commission",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E07",
        "E28"
      ],
      "note": "No fake reviews, conditioned positive sentiment, or misleading testimonial use."
    },
    {
      "id": "S061",
      "name": "Dark Patterns at Scale",
      "publisher": "Princeton researchers / arXiv",
      "lens": "CRO",
      "sourceType": "research",
      "url": "https://arxiv.org/abs/1907.07032",
      "access": "open",
      "rightsBasis": "open-research",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E15",
        "E17",
        "E18",
        "E22",
        "E23"
      ],
      "note": "Use as an anti-pattern library; do not optimize coercion."
    },
    {
      "id": "S062",
      "name": "Bootstrapping Complete The Look",
      "publisher": "Pinterest researchers / arXiv",
      "lens": "Fashion",
      "sourceType": "research",
      "url": "https://arxiv.org/abs/2006.10792",
      "access": "open",
      "rightsBasis": "open-research",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E18",
        "E24",
        "E29"
      ],
      "note": "System research; translate to manual styling tests before building technology."
    },
    {
      "id": "S063",
      "name": "Shop The Look Visual Shopping System",
      "publisher": "Pinterest researchers / arXiv",
      "lens": "Fashion",
      "sourceType": "research",
      "url": "https://arxiv.org/abs/2006.10866",
      "access": "open",
      "rightsBasis": "open-research",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E18",
        "E24",
        "E29"
      ],
      "note": "Large-platform system evidence; VORG should test a manual low-cost version first."
    },
    {
      "id": "S064",
      "name": "StreetStyle Worldwide Clothing Research",
      "publisher": "Cornell/Georgia Tech researchers / arXiv",
      "lens": "Fashion",
      "sourceType": "research",
      "url": "https://arxiv.org/abs/1706.01869",
      "access": "open",
      "rightsBasis": "open-research",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E04",
        "E10",
        "E25",
        "E30"
      ],
      "note": "Research-scale visual analysis; watch dataset and cultural-context limits."
    },
    {
      "id": "S065",
      "name": "Free Shipping Threshold Case",
      "publisher": "Intelligems",
      "lens": "Finance",
      "sourceType": "vendor_case_study",
      "url": "https://www.intelligems.io/resources/customer-stories/testing-your-free-shipping-threshold-can-improve-aov-and-revenue",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E22"
      ],
      "note": "Vendor-reported case; reproduce the test design, not the expected lift."
    },
    {
      "id": "S066",
      "name": "Pricing Experiment Case",
      "publisher": "Intelligems",
      "lens": "Finance",
      "sourceType": "vendor_case_study",
      "url": "https://www.intelligems.io/resources/blog/getting-scientific-with-pricing",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "static",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E23"
      ],
      "note": "Vendor-reported; require margin, conversion, refund, and brand-sentiment guardrails."
    },
    {
      "id": "S067",
      "name": "Shopify Conversion Rate Optimization Guide",
      "publisher": "Shopify",
      "lens": "CRO",
      "sourceType": "platform_education",
      "url": "https://www.shopify.com/blog/cro",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E24",
        "E25",
        "E27"
      ],
      "note": "Platform-authored. Prioritize tests supported by VORG funnel evidence."
    },
    {
      "id": "S068",
      "name": "Google Trends",
      "publisher": "Google",
      "lens": "Discovery",
      "sourceType": "live_market_intelligence",
      "url": "https://trends.google.com/trends/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "monthly",
      "ingestionMode": "manual-live-observation",
      "feedsTactics": [
        "E04",
        "E30"
      ],
      "note": "Relative search interest is not sales demand; record geography, period, category, and comparison terms."
    },
    {
      "id": "S069",
      "name": "Library of Congress Open Access Books",
      "publisher": "Library of Congress",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://www.loc.gov/collections/open-access-books/about-this-collection/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "catalog-and-item-license-check",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E21"
      ],
      "note": "Discovery gateway for openly licensed books. Record and follow each title's licence before local full-text use."
    },
    {
      "id": "S070",
      "name": "Open Library",
      "publisher": "Internet Archive",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://docs.openlibrary.org/everyone/index.html",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "C",
      "refresh": "quarterly",
      "ingestionMode": "catalog-only-unless-item-rights-clear",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E21"
      ],
      "note": "Use as discovery. Borrow/preview availability is not permission to ingest; only item-level public-domain or open-licence works qualify."
    },
    {
      "id": "S071",
      "name": "HathiTrust Full View",
      "publisher": "HathiTrust Digital Library",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://www.hathitrust.org/",
      "access": "open-limited",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "catalog-and-item-rights-check",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E21"
      ],
      "note": "Full View can reflect public-domain or rights-holder-opened access; download and reuse rules remain item- and location-specific."
    },
    {
      "id": "S072",
      "name": "Directory of Open Access Books",
      "publisher": "DOAB Foundation",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://www.doabooks.org/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "catalog-and-item-license-check",
      "feedsTactics": [
        "E01",
        "E03",
        "E21",
        "E23"
      ],
      "note": "Discovery service for peer-reviewed open-access books. Preserve each book's publisher, peer-review status, version, and licence."
    },
    {
      "id": "S073",
      "name": "OAPEN Library",
      "publisher": "OAPEN Foundation",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://oapen.org/oapen",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "catalog-and-item-license-check",
      "feedsTactics": [
        "E01",
        "E03",
        "E21",
        "E23"
      ],
      "note": "Quality-controlled open-access book collection; use item-level licence and version metadata."
    },
    {
      "id": "S074",
      "name": "Open Textbook Library",
      "publisher": "University of Minnesota Open Education Network",
      "lens": "Fundamentals",
      "sourceType": "open_library",
      "url": "https://open.umn.edu/opentextbooks/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "catalog-and-item-license-check",
      "feedsTactics": [
        "E01",
        "E03",
        "E21",
        "E23",
        "E26"
      ],
      "note": "Use reviewed open textbooks as framework sources; record edition, licence, review date, and platform-age limits."
    },
    {
      "id": "S075",
      "name": "Principles of Marketing",
      "publisher": "OpenStax / Rice University",
      "lens": "Fundamentals",
      "sourceType": "open_textbook",
      "url": "https://openstax.org/books/principles-marketing/pages/preface",
      "access": "open",
      "rightsBasis": "open-license",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "manual-read-and-cite-no-ai-full-text",
      "feedsTactics": [
        "E01",
        "E03",
        "E18",
        "E21",
        "E22",
        "E23"
      ],
      "note": "CC BY-NC-SA edition, but the current OpenStax attribution notice separately prohibits LLM or generative-AI ingestion without permission. Read and cite manually; do not send full text to AI unless OpenStax grants permission."
    },
    {
      "id": "S076",
      "name": "Foundations in Digital Marketing",
      "publisher": "BCcampus / Rochelle Grayson",
      "lens": "Fundamentals",
      "sourceType": "open_textbook",
      "url": "https://opentextbc.ca/foundationsdigitalmarketing/",
      "access": "open",
      "rightsBasis": "open-license",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "full-text-license",
      "feedsTactics": [
        "E01",
        "E03",
        "E04",
        "E21",
        "E26",
        "E27",
        "E30"
      ],
      "note": "CC BY 4.0 except where noted; useful for journeys, storytelling, channels, A/B testing, attribution, CRO, and analytics."
    },
    {
      "id": "S077",
      "name": "eMarketing: The Essential Guide to Marketing in a Digital World, 7th Edition",
      "publisher": "Red & Yellow / Open Textbook Library",
      "lens": "Fundamentals",
      "sourceType": "open_textbook",
      "url": "https://open.umn.edu/opentextbooks/textbooks/14",
      "access": "open",
      "rightsBasis": "open-license",
      "defaultTier": "B",
      "refresh": "annual",
      "ingestionMode": "manual-read-and-cite-noncommercial-license",
      "feedsTactics": [
        "E01",
        "E03",
        "E04",
        "E21",
        "E26",
        "E27",
        "E30"
      ],
      "note": "CC BY-NC-SA edition. Because VORG is commercial, use it for manual reading and attributed citation unless the intended reuse is confirmed noncommercial or separately permitted; verify fast-changing examples against current official documentation."
    },
    {
      "id": "S078",
      "name": "Meta Blueprint",
      "publisher": "Meta",
      "lens": "Paid Social",
      "sourceType": "free_course",
      "url": "https://www.facebookblueprint.com/student/catalog?locale=en",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "course-notes-and-current-doc-links",
      "feedsTactics": [
        "E03",
        "E05",
        "E06",
        "E08"
      ],
      "note": "Official platform mechanics and recommendations; not independent evidence of profitability or transfer."
    },
    {
      "id": "S079",
      "name": "Google Skillshop",
      "publisher": "Google",
      "lens": "Discovery",
      "sourceType": "free_course",
      "url": "https://skillshop.withgoogle.com/",
      "access": "free-account",
      "rightsBasis": "creator-provided-free",
      "defaultTier": "B",
      "refresh": "quarterly",
      "ingestionMode": "course-notes-and-current-doc-links",
      "feedsTactics": [
        "E21",
        "E22",
        "E23",
        "E30"
      ],
      "note": "Official product training for Ads and Analytics; pair mechanics with current documentation and VORG outcome evidence."
    },
    {
      "id": "S080",
      "name": "Monthly Retail Trade E-commerce Sales",
      "publisher": "Statistics Canada",
      "lens": "Finance",
      "sourceType": "official_market_data",
      "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2010005603",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "monthly",
      "ingestionMode": "official-data-distill",
      "feedsTactics": [
        "E23",
        "E30"
      ],
      "note": "Canadian retailer context with quality flags and scope limits; national or regional aggregates are not a Drop 001 sales forecast."
    },
    {
      "id": "S081",
      "name": "Quebec Online Commerce Merchant Obligations",
      "publisher": "Office de la protection du consommateur",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.opc.gouv.qc.ca/enligne/",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E21",
        "E22",
        "E23",
        "E24",
        "E27"
      ],
      "note": "Primary Quebec merchant guidance for pre-transaction disclosures, contract copies, delivery, cancellation, and refund obligations."
    },
    {
      "id": "S082",
      "name": "Quebec Language of Commerce and Business",
      "publisher": "Office québécois de la langue française",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://www.oqlf.gouv.qc.ca/francisation/droits_linguistiques/droits/langue-du-commerce-et-des-affaires.html",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E19",
        "E20",
        "E21",
        "E24",
        "E25",
        "E26",
        "E27"
      ],
      "note": "Primary Quebec language guidance for service, websites, social content, commercial documents, product information, and public advertising."
    },
    {
      "id": "S083",
      "name": "Environmental Claims and Greenwashing",
      "publisher": "Competition Bureau Canada",
      "lens": "Compliance",
      "sourceType": "regulatory",
      "url": "https://competition-bureau.canada.ca/en/how-we-foster-competition/education-and-outreach/environmental-claims-and-greenwashing",
      "access": "open",
      "rightsBasis": "public-permitted",
      "defaultTier": "A",
      "refresh": "quarterly",
      "ingestionMode": "link-and-distill",
      "feedsTactics": [
        "E01",
        "E07",
        "E21",
        "E24",
        "E25",
        "E28"
      ],
      "note": "Current federal guidance. Product and business environmental claims must be truthful and supported under the applicable standard; recheck after guidance changes."
    }
  ],
  "claims": [
    {
      "id": "EC-2026-001",
      "title": "Sell like a clear salesperson",
      "claim": "Advertising should explain the product and the buyer-relevant reason to act with the clarity of a capable salesperson.",
      "mechanism": "Clear product truth reduces interpretation cost and connects attention to a concrete next action.",
      "sourceIds": [
        "S001",
        "S004"
      ],
      "evidenceTier": "B",
      "confidence": 78,
      "conditions": "The product, price, delivery, returns, fit, and claim are accurate.",
      "vorgMutation": "One objection, one physical proof demonstration, one next action per creative.",
      "funnelStage": "creative-to-PDP",
      "metric": "qualified-action rate",
      "successThreshold": "Beat the median qualified-action rate by 25% with at least ten qualified actions.",
      "killCondition": "The ad creates attention without product action or requires unsupported claims.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E01",
        "E21"
      ]
    },
    {
      "id": "EC-2026-002",
      "title": "Specific proof beats vague superiority",
      "claim": "Concrete, checkable details are more decision-useful than generic quality language.",
      "mechanism": "Specific information gives the buyer something credible to compare and remember.",
      "sourceIds": [
        "S001",
        "S047",
        "S055"
      ],
      "evidenceTier": "B",
      "confidence": 82,
      "conditions": "Every material, construction, fit, origin, delivery, and quantity detail is verified.",
      "vorgMutation": "Replace premium adjectives with measured garment facts and visible construction evidence.",
      "funnelStage": "PDP",
      "metric": "proof-module engagement and qualified action",
      "successThreshold": "Improve proof-module engagement and at least one purchase-proximate action without increasing support confusion.",
      "killCondition": "Any stated detail lacks a supplier, sample, measurement, or policy source.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E01",
        "E21",
        "E25"
      ]
    },
    {
      "id": "EC-2026-003",
      "title": "Test the mechanism, not the guru",
      "claim": "A source's authority or follower count is not transferable evidence for VORG-EAVY.",
      "mechanism": "Holding the offer, audience, window, and primary metric stable makes a tactic decision interpretable.",
      "sourceIds": [
        "S001",
        "S018",
        "S034",
        "S035",
        "S078",
        "S079"
      ],
      "evidenceTier": "C",
      "confidence": 88,
      "conditions": "The pre-test baseline, comparison, threshold, spend, and decision rule are locked before launch.",
      "vorgMutation": "Every imported tactic remains zero-score until a controlled result receipt exists.",
      "funnelStage": "experiment governance",
      "metric": "decision-grade completed tests",
      "successThreshold": "Every completed test has a valid receipt and adopt/adapt/retest/reject decision.",
      "killCondition": "A tactic is scaled because a creator called it proven rather than because VORG evidence cleared the gate.",
      "risk": "Green",
      "status": "adopted-policy",
      "feedsTactics": [
        "E03",
        "E08",
        "E23"
      ]
    },
    {
      "id": "EC-2026-004",
      "title": "Demonstration lowers uncertainty",
      "claim": "Showing the object, construction, fit, movement, or use can answer purchase objections more credibly than assertion alone.",
      "mechanism": "Visible product evidence reduces uncertainty about what arrives and how it behaves.",
      "sourceIds": [
        "S001",
        "S031",
        "S047"
      ],
      "evidenceTier": "B",
      "confidence": 83,
      "conditions": "The demonstrated sample matches the product that will be sold.",
      "vorgMutation": "Use fit relays, movement shots, closures, fabric hand, and measured details from approved samples.",
      "funnelStage": "creative-and-PDP",
      "metric": "fit-question reduction and qualified-action rate",
      "successThreshold": "Reduce repeated fit/material questions while increasing size-guide or checkout progression.",
      "killCondition": "The content uses a concept sample that misrepresents production truth.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E01",
        "E25"
      ]
    },
    {
      "id": "EC-2026-005",
      "title": "Historic garment language is a prompt, not proof",
      "claim": "Old garment advertising can reveal enduring buyer questions and merchandising structures but cannot establish modern channel performance.",
      "mechanism": "Historical examples widen the angle bank without importing false causal certainty.",
      "sourceIds": [
        "S003",
        "S006"
      ],
      "evidenceTier": "C",
      "confidence": 72,
      "conditions": "Language is translated into current product truth and tested with today's audience.",
      "vorgMutation": "Mine categories such as occasion, construction, silhouette, care, status, and utility; rewrite from scratch.",
      "funnelStage": "research",
      "metric": "new non-duplicate angle count",
      "successThreshold": "Produce five original, truthful angles with distinct buyer jobs.",
      "killCondition": "The output copies period language, stereotypes, or unsupported superiority claims.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E02",
        "E03",
        "E24"
      ]
    },
    {
      "id": "EC-2026-006",
      "title": "Live ads reveal patterns, not profits",
      "claim": "Ad libraries can show active formats, hooks, offers, and landing continuity but usually do not reveal profitability.",
      "mechanism": "Repeated observable patterns create hypotheses while first-seen dates and variants help prioritize what to inspect.",
      "sourceIds": [
        "S023",
        "S028",
        "S037"
      ],
      "evidenceTier": "C",
      "confidence": 94,
      "conditions": "Record advertiser, geography, first/last seen, format, mechanism, and destination without copying assets.",
      "vorgMutation": "Scan apparel ads weekly and translate only the underlying mechanism into original VORG work.",
      "funnelStage": "creative research",
      "metric": "novel mechanism candidates",
      "successThreshold": "Ten non-duplicate mechanisms mapped to a VORG objection or buyer job each week.",
      "killCondition": "Ad longevity is described as ROAS proof or protected creative is imitated closely.",
      "risk": "Yellow",
      "status": "adopted-policy",
      "feedsTactics": [
        "E03",
        "E04",
        "E08"
      ]
    },
    {
      "id": "EC-2026-007",
      "title": "Diversify concepts before cosmetic variants",
      "claim": "Platforms need meaningfully different creative concepts, not only small visual or copy changes.",
      "mechanism": "Distinct promises, objections, situations, and formats give delivery systems and humans real alternatives to evaluate.",
      "sourceIds": [
        "S024",
        "S025",
        "S030"
      ],
      "evidenceTier": "B",
      "confidence": 84,
      "conditions": "The test has sufficient time and spend or organic reach for interpretation.",
      "vorgMutation": "Build cells across buyer tension × proof type × format, then make variants only inside winning cells.",
      "funnelStage": "paid-social creative",
      "metric": "qualified actions per concept",
      "successThreshold": "At least three genuinely different concepts each produce enough reach for a qualified-action comparison.",
      "killCondition": "The matrix creates volume without distinct hypotheses or stretches the proof budget.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E03",
        "E05",
        "E06"
      ]
    },
    {
      "id": "EC-2026-008",
      "title": "Simpler paid structure protects learning",
      "claim": "Fragmenting small budgets across too many similar campaigns and ad sets can starve learning and interpretation.",
      "mechanism": "Fewer overlapping cells concentrate feedback while the creative carries most of the hypothesis variation.",
      "sourceIds": [
        "S025"
      ],
      "evidenceTier": "A",
      "confidence": 80,
      "conditions": "Budget remains capped and audience/placement constraints are justified.",
      "vorgMutation": "Use one small founder-approved proof cell before adding campaign complexity.",
      "funnelStage": "paid-social",
      "metric": "spend reaching decision-grade creative cells",
      "successThreshold": "Most capped test spend reaches predeclared concept cells without reset-causing changes.",
      "killCondition": "Simplification removes a required geography, consent, inventory, or measurement control.",
      "risk": "Yellow",
      "status": "library",
      "feedsTactics": [
        "E05",
        "E08"
      ]
    },
    {
      "id": "EC-2026-009",
      "title": "Translate formats; do not clone them",
      "claim": "Native pacing and platform grammar can improve relevance, but copying another creator's footage, words, music, or likeness creates rights and brand risk.",
      "mechanism": "Rebuild the opening tension, information order, and reveal logic with original VORG assets.",
      "sourceIds": [
        "S027",
        "S028",
        "S030",
        "S031"
      ],
      "evidenceTier": "B",
      "confidence": 90,
      "conditions": "All footage, audio, talent, and claims are owned or licensed.",
      "vorgMutation": "Document the abstract format in one sentence, then shoot an unmistakably VORG execution.",
      "funnelStage": "creative",
      "metric": "retention plus qualified action",
      "successThreshold": "Improve both retention and purchase-proximate action against the original VORG baseline.",
      "killCondition": "Similarity creates plausible attribution confusion or a rights concern.",
      "risk": "Yellow",
      "status": "adopted-policy",
      "feedsTactics": [
        "E04",
        "E06"
      ]
    },
    {
      "id": "EC-2026-010",
      "title": "Trend signals require local confirmation",
      "claim": "Platform trends, search interest, and market aggregates identify context shifts, not guaranteed Ottawa/Gatineau purchase demand.",
      "mechanism": "Cross-platform direction plus local waitlist, survey, DM, RSVP, or search evidence reduces false positives.",
      "sourceIds": [
        "S029",
        "S038",
        "S039",
        "S068",
        "S080"
      ],
      "evidenceTier": "C",
      "confidence": 88,
      "conditions": "Every trend or market record includes geography, period, scope, quality flag where available, comparison, and product relevance.",
      "vorgMutation": "Advance a trend only after it maps to a VORG object and a local qualified signal.",
      "funnelStage": "demand research",
      "metric": "verified local signals",
      "successThreshold": "At least two distinct local evidence sources support the same product-relevant direction.",
      "killCondition": "A global aesthetic spike or aggregate ecommerce number dictates production units without local proof.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E04",
        "E30"
      ]
    },
    {
      "id": "EC-2026-011",
      "title": "Free product surfaces require feed truth",
      "claim": "Eligible products may appear without ad spend across Google surfaces when product data and policies meet requirements.",
      "mechanism": "Accurate structured product information lets high-intent discovery surfaces match a query to a purchasable item.",
      "sourceIds": [
        "S032",
        "S049",
        "S050"
      ],
      "evidenceTier": "A",
      "confidence": 92,
      "conditions": "Price, availability, images, shipping, returns, identifiers, and landing-page content agree.",
      "vorgMutation": "Prepare the five Drop 001 SKUs for Merchant Center only after vendor-backed product truth is ready.",
      "funnelStage": "organic discovery",
      "metric": "eligible products, free-listing clicks, and purchases",
      "successThreshold": "All active sellable SKUs are approved and tracked with zero feed/store mismatches.",
      "killCondition": "The feed publishes TBD, inconsistent, unavailable, or misleading product data.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E21",
        "E24",
        "E30"
      ]
    },
    {
      "id": "EC-2026-012",
      "title": "Local inventory can bridge pop-up and search",
      "claim": "Free local listings can surface accurate nearby product availability across Google when the required local data exists.",
      "mechanism": "Local intent connects to an actual place, schedule, and inventory state.",
      "sourceIds": [
        "S033"
      ],
      "evidenceTier": "A",
      "confidence": 84,
      "conditions": "Venue, hours, location, available units, and pickup/sale terms are confirmed and current.",
      "vorgMutation": "Use only for the controlled Ottawa/Gatineau pop-up with an exact inventory allocation.",
      "funnelStage": "local discovery",
      "metric": "local listing actions and attributable visits",
      "successThreshold": "No inventory or venue mismatch and at least one verified local action path.",
      "killCondition": "The pop-up or inventory can change faster than the listing can remain accurate.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E20",
        "E30"
      ]
    },
    {
      "id": "EC-2026-013",
      "title": "Events must form one measurement spine",
      "claim": "Creative, product, cart, checkout, purchase, refund, RSVP, and offline signals need consistent event definitions before optimization.",
      "mechanism": "Comparable events keep source, funnel stage, and experiment outcome connected.",
      "sourceIds": [
        "S034",
        "S035",
        "S036"
      ],
      "evidenceTier": "A",
      "confidence": 95,
      "conditions": "Events are tested, deduplicated, timestamped, and reconciled against orders or attendance.",
      "vorgMutation": "Use GA4 recommended ecommerce events plus VORG experiment IDs in UTMs and result receipts.",
      "funnelStage": "measurement",
      "metric": "verified event coverage",
      "successThreshold": "Every active experiment has a valid source-to-qualified-action chain before spend.",
      "killCondition": "A channel report cannot be reconciled to a real VORG action or order.",
      "risk": "Green",
      "status": "adopted-policy",
      "feedsTactics": [
        "E21",
        "E22",
        "E23",
        "E26",
        "E27",
        "E30"
      ]
    },
    {
      "id": "EC-2026-014",
      "title": "Checkout friction is an evidence surface",
      "claim": "Checkout usability problems can stop otherwise qualified buyers and should be tested directly rather than inferred from low sales alone.",
      "mechanism": "Removing confusion, unnecessary demands, and errors reduces avoidable abandonment.",
      "sourceIds": [
        "S046",
        "S061",
        "S067"
      ],
      "evidenceTier": "A",
      "confidence": 91,
      "conditions": "The audit uses device-level recordings or moderated checks without collecting sensitive payment data.",
      "vorgMutation": "Run five mobile checkout rehearsals across shipping, policy, address, payment, confirmation, and error recovery.",
      "funnelStage": "checkout",
      "metric": "task completion and blocking defects",
      "successThreshold": "Five rehearsals complete with no severity-one blocker and every fee disclosed before commitment.",
      "killCondition": "A conversion improvement depends on hidden costs, forced continuity, or coercive interface patterns.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E21",
        "E22",
        "E27"
      ]
    },
    {
      "id": "EC-2026-015",
      "title": "The PDP must carry visual and fit proof",
      "claim": "Product pages are a primary decision surface where buyers need relevant images, fit, materials, size, delivery, returns, and product-state truth.",
      "mechanism": "A complete evidence stack answers uncertainty at the moment of product evaluation.",
      "sourceIds": [
        "S047",
        "S049",
        "S050"
      ],
      "evidenceTier": "A",
      "confidence": 93,
      "conditions": "Images and measurements represent approved physical samples and the exact SKU state.",
      "vorgMutation": "Build each Drop 001 PDP around silhouette, movement, construction, closeups, size guidance, delivery, returns, and stock truth.",
      "funnelStage": "PDP",
      "metric": "size-guide use, support questions, add-to-cart, and returns",
      "successThreshold": "All active PDPs pass the evidence checklist and common questions decrease after proof modules ship.",
      "killCondition": "Editorial styling obscures the product or concept imagery is presented as production truth.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ]
    },
    {
      "id": "EC-2026-016",
      "title": "Speed is a guardrail, not a story",
      "claim": "Loading and interaction quality can prevent customers from using the commerce experience, but technical scores alone do not prove sales lift.",
      "mechanism": "Stable, responsive pages preserve the path from interest to product evidence and checkout.",
      "sourceIds": [
        "S048"
      ],
      "evidenceTier": "A",
      "confidence": 90,
      "conditions": "Measure field data where possible and test the exact launch devices and network conditions.",
      "vorgMutation": "Set performance budgets for hero media, PDP modules, size guide, cart, and checkout before launch.",
      "funnelStage": "site performance",
      "metric": "Core Web Vitals plus task completion",
      "successThreshold": "No launch-critical flow fails the agreed performance budget or mobile task rehearsal.",
      "killCondition": "A visual treatment materially blocks interaction or delays product truth.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E21"
      ]
    },
    {
      "id": "EC-2026-017",
      "title": "Lifecycle messages follow real customer state",
      "claim": "Welcome, browse/cart recovery, post-purchase, review, and win-back messages work best when triggered by a real customer state and one clear job.",
      "mechanism": "State-based relevance reduces noise and keeps each message connected to an action the customer understands.",
      "sourceIds": [
        "S040",
        "S041",
        "S042",
        "S043",
        "S044"
      ],
      "evidenceTier": "B",
      "confidence": 84,
      "conditions": "Consent, suppression, identity, unsubscribe, frequency, inventory, and promise truth are valid.",
      "vorgMutation": "Build the smallest Drop 001 flow set: welcome, launch notice, cart recovery, order education, delivery, review/service, and next-city signal.",
      "funnelStage": "lifecycle",
      "metric": "qualified action, complaint, unsubscribe, and order contribution",
      "successThreshold": "Each flow has one verified trigger, one job, one measurement path, and acceptable complaint/opt-out behaviour.",
      "killCondition": "The flow sends after consent withdrawal, duplicates transactional messages, or promotes unavailable inventory.",
      "risk": "Yellow",
      "status": "library",
      "feedsTactics": [
        "E26",
        "E27",
        "E28",
        "E29"
      ]
    },
    {
      "id": "EC-2026-018",
      "title": "Segment by intent before demographics",
      "claim": "Declared product, size, city, timing, and purchase-state signals can make lifecycle communication more relevant than broad demographic guesses.",
      "mechanism": "First-party intent maps directly to a customer job and suppresses irrelevant messages.",
      "sourceIds": [
        "S040",
        "S043",
        "S045"
      ],
      "evidenceTier": "B",
      "confidence": 82,
      "conditions": "The data is collected transparently, minimized, and used for the stated purpose.",
      "vorgMutation": "Ask waitlist entrants for product, size, and city; keep optional fields optional.",
      "funnelStage": "lead capture",
      "metric": "qualified opt-in and segment action rate",
      "successThreshold": "Intent segments improve a purchase-proximate action without worsening consent quality or complaints.",
      "killCondition": "Segmentation requires sensitive or unnecessary personal data.",
      "risk": "Yellow",
      "status": "library",
      "feedsTactics": [
        "E26",
        "E30"
      ]
    },
    {
      "id": "EC-2026-019",
      "title": "Owned channels still require consent",
      "claim": "Email and SMS give the brand a direct relationship, but ownership of the channel does not remove consent, identification, unsubscribe, privacy, or frequency duties.",
      "mechanism": "Permission and suppression controls preserve deliverability, trust, and defensibility.",
      "sourceIds": [
        "S043",
        "S051",
        "S052",
        "S053"
      ],
      "evidenceTier": "A",
      "confidence": 98,
      "conditions": "Consent basis, source, timestamp, scope, identity, and unsubscribe state are stored and checked before send.",
      "vorgMutation": "Make the Drop 001 waitlist a clean express-consent ledger, not a scraped audience list.",
      "funnelStage": "lifecycle governance",
      "metric": "consent coverage, complaints, and unsubscribe execution",
      "successThreshold": "Every commercial recipient has a documented valid basis and functioning unsubscribe path.",
      "killCondition": "An address is added because it is public, purchased, scraped, or inferred without a lawful basis.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E09",
        "E26",
        "E27",
        "E30"
      ]
    },
    {
      "id": "EC-2026-020",
      "title": "Referral outreach is narrow under CASL",
      "claim": "Canada's referral exception is conditional and does not create permission for repeated commercial follow-up.",
      "mechanism": "A compliant referral identifies the referrer, satisfies the conditions, and stops unless the recipient consents.",
      "sourceIds": [
        "S051",
        "S052"
      ],
      "evidenceTier": "A",
      "confidence": 96,
      "conditions": "Counsel or a qualified operator confirms the exact referral flow and records the required relationship and message evidence.",
      "vorgMutation": "Prefer participant-controlled referral links and landing pages; avoid VORG emailing referred contacts directly unless the basis is verified.",
      "funnelStage": "referral",
      "metric": "valid referred opt-ins",
      "successThreshold": "Referrals convert through recipient-controlled action with no complaint or unauthorized follow-up.",
      "killCondition": "The ladder imports referred addresses into a send sequence without verified consent.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E09"
      ]
    },
    {
      "id": "EC-2026-021",
      "title": "Public contact data is not a growth list",
      "claim": "Scraping or buying electronic addresses can create privacy and consent exposure even when the information was visible online.",
      "mechanism": "Source permission and purpose limitation must be established before collection and use.",
      "sourceIds": [
        "S053"
      ],
      "evidenceTier": "A",
      "confidence": 99,
      "conditions": "Research never captures personal addresses for marketing unless a valid basis is documented.",
      "vorgMutation": "Use public posts for aggregate mechanism research; use voluntary VORG opt-ins for messaging.",
      "funnelStage": "source governance",
      "metric": "permitted-source coverage",
      "successThreshold": "Every stored contact and source record has an allowed purpose and evidence trail.",
      "killCondition": "A crawler, broker, enrichment tool, or copied list supplies addresses without meaningful consent or permission.",
      "risk": "Red",
      "status": "adopted-policy",
      "feedsTactics": [
        "E26",
        "E27",
        "E30"
      ]
    },
    {
      "id": "EC-2026-022",
      "title": "Urgency, price, and guarantees must be real",
      "claim": "Scarcity, discounts, total price, testimonials, and guarantees must match genuine inventory, terms, comparisons, and customer outcomes.",
      "mechanism": "Truthful boundaries create urgency without deception and reduce refund or trust damage.",
      "sourceIds": [
        "S054",
        "S061",
        "S065",
        "S066"
      ],
      "evidenceTier": "A",
      "confidence": 98,
      "conditions": "The comparison price, unit count, window, fees, threshold, and remedy are documented before publication.",
      "vorgMutation": "Use only real unit limits and fixed windows; disclose total cost and guarantee conditions beside the claim.",
      "funnelStage": "offer",
      "metric": "conversion, margin, refund, complaint, and sentiment",
      "successThreshold": "An offer improves contribution or qualified action with no misleading state or complaint pattern.",
      "killCondition": "The tactic relies on fake countdowns, hidden fees, invented comparison prices, or impossible remedies.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E15",
        "E17",
        "E22",
        "E23"
      ]
    },
    {
      "id": "EC-2026-023",
      "title": "Textile truth starts before the PDP",
      "claim": "Canadian apparel sold or advertised must carry accurate fibre and dealer information, and optional performance, care, origin, and size claims must not mislead.",
      "mechanism": "Supplier evidence and approved labels constrain every downstream product and marketing claim.",
      "sourceIds": [
        "S055",
        "S056",
        "S057"
      ],
      "evidenceTier": "A",
      "confidence": 98,
      "conditions": "Final material composition, dealer identity, imported-product treatment, safety, and any optional claims are verified for the exact SKU.",
      "vorgMutation": "Add a textile truth preflight before PDP, ad, packaging, seeding, or pop-up approval.",
      "funnelStage": "product governance",
      "metric": "SKU compliance evidence coverage",
      "successThreshold": "Every active SKU has linked composition, label, dealer, and applicable safety evidence before sale.",
      "killCondition": "Marketing launches while fibre, origin, performance, or label truth is unresolved.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E21",
        "E24",
        "E25"
      ]
    },
    {
      "id": "EC-2026-024",
      "title": "Creator material connections must be obvious",
      "claim": "Payment, gifting, discounts, employment, or other material connections should be disclosed clearly and close to the endorsement.",
      "mechanism": "Visible disclosure lets the audience weigh the recommendation honestly and protects both creator and brand.",
      "sourceIds": [
        "S058",
        "S059"
      ],
      "evidenceTier": "A",
      "confidence": 97,
      "conditions": "The disclosure works in the actual format, placement, duration, language, and target market.",
      "vorgMutation": "Put the disclosure in the creative and caption where relevant; pre-approve claims and keep proof of the relationship.",
      "funnelStage": "creator",
      "metric": "disclosure compliance and content incidents",
      "successThreshold": "Every incentivized asset passes the disclosure/claim/rights checklist before use.",
      "killCondition": "A creator is asked to hide the relationship, guarantee praise, or make an unverified claim.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E05",
        "E07",
        "E10",
        "E19",
        "E28"
      ]
    },
    {
      "id": "EC-2026-025",
      "title": "Dark patterns are not conversion wins",
      "claim": "Interfaces that coerce, obstruct, hide costs, fabricate urgency, or make cancellation harder can raise short-term actions while damaging consent, trust, and legal defensibility.",
      "mechanism": "A clean decision path measures genuine buyer intent instead of accidental or pressured actions.",
      "sourceIds": [
        "S054",
        "S061"
      ],
      "evidenceTier": "A",
      "confidence": 98,
      "conditions": "UX review includes pricing, consent, stock, countdowns, defaults, cancellation, returns, and subscription state.",
      "vorgMutation": "Add a dark-pattern preflight to every offer, waitlist, cart, checkout, contest, and recovery flow.",
      "funnelStage": "CRO governance",
      "metric": "clean conversion, refund, complaint, and cancellation completion",
      "successThreshold": "No severity-one deceptive pattern and no lift dependent on accidental commitment.",
      "killCondition": "The test wins only because information or exit controls became harder to find.",
      "risk": "Red",
      "status": "adopted-policy",
      "feedsTactics": [
        "E15",
        "E17",
        "E18",
        "E22",
        "E23",
        "E27"
      ]
    },
    {
      "id": "EC-2026-026",
      "title": "AI creates variants, not truth",
      "claim": "Generative tools can accelerate classification, scripts, layouts, and creative variants, but they do not establish product facts, rights, customer consent, or market performance.",
      "mechanism": "AI lowers production cost while evidence gates prevent fluent output from becoming an unsupported claim or duplicated strategy.",
      "sourceIds": [
        "S026",
        "S028",
        "S030"
      ],
      "evidenceTier": "C",
      "confidence": 96,
      "conditions": "A human verifies source provenance, product truth, rights, disclosure, brand fit, and the unchanged experiment rule before publication.",
      "vorgMutation": "Use AI to expand an evidence-backed angle cell, then require physical-product review and result receipts.",
      "funnelStage": "knowledge and creative operations",
      "metric": "usable original variants per verified claim",
      "successThreshold": "AI cuts production time while every published asset passes truth/rights review and is evaluated on qualified action.",
      "killCondition": "AI fabricates evidence, impersonates creators, copies protected expression, or floods the test with undifferentiated variants.",
      "risk": "Yellow",
      "status": "adopted-policy",
      "feedsTactics": [
        "E01",
        "E02",
        "E03",
        "E04"
      ]
    },
    {
      "id": "EC-2026-027",
      "title": "Repeated guru advice collapses into one mechanism",
      "claim": "Ten creators repeating the same recommendation do not create ten independent pieces of evidence, especially when the material may be derivative or AI-assisted.",
      "mechanism": "Semantic deduplication prevents popularity from inflating confidence and keeps the original conditions visible.",
      "sourceIds": [
        "S008",
        "S010",
        "S012",
        "S013",
        "S014",
        "S015",
        "S016",
        "S018"
      ],
      "evidenceTier": "C",
      "confidence": 94,
      "conditions": "Claims are fingerprinted by objective, mechanism, conditions, metric, and risk rather than wording.",
      "vorgMutation": "Merge duplicates into one atomic claim with multiple source references and one VORG test.",
      "funnelStage": "knowledge governance",
      "metric": "duplicate-collapse rate and unique mechanism count",
      "successThreshold": "Every intake batch reports raw claims, unique mechanisms, conflicts, and the best primary source.",
      "killCondition": "Source count is used as causal confidence without independent evidence or distinct conditions.",
      "risk": "Green",
      "status": "adopted-policy",
      "feedsTactics": [
        "E01",
        "E03",
        "E08",
        "E21"
      ]
    },
    {
      "id": "EC-2026-028",
      "title": "Visual intent can reveal styling jobs",
      "claim": "Search, save, and visual-shopping behaviour can reveal combinations and aesthetics people explore, but it needs manual product and city validation.",
      "mechanism": "Styling intent creates useful bundle, content, and merchandising hypotheses without committing inventory.",
      "sourceIds": [
        "S038",
        "S039",
        "S062",
        "S063"
      ],
      "evidenceTier": "B",
      "confidence": 82,
      "conditions": "The products fit together operationally, sizes remain independent, and the bundle does not conceal price or return restrictions.",
      "vorgMutation": "Create manual complete-look boards for the five Drop 001 objects and test saves, qualified opt-ins, and assisted add-to-cart.",
      "funnelStage": "merchandising",
      "metric": "look engagement and assisted qualified action",
      "successThreshold": "One look improves a purchase-proximate action without increasing size or return confusion.",
      "killCondition": "The aesthetic demands unquoted SKUs, forced bundles, or inventory beyond the cap.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E18",
        "E24",
        "E29"
      ]
    },
    {
      "id": "EC-2026-029",
      "title": "Discovery promise must match the destination",
      "claim": "Search, feed, ad, and creator promises should continue accurately on the landing page and product page.",
      "mechanism": "Message continuity reduces surprise and keeps the source hypothesis measurable through the funnel.",
      "sourceIds": [
        "S032",
        "S034",
        "S049",
        "S050"
      ],
      "evidenceTier": "A",
      "confidence": 94,
      "conditions": "Creative, title, image, price, availability, size, delivery, and policy states are synchronized.",
      "vorgMutation": "Give every promoted concept a matching page proof module and source-specific tracking.",
      "funnelStage": "source-to-PDP",
      "metric": "landing engagement, proof interaction, and qualified action by source",
      "successThreshold": "The matching page beats a generic destination on qualified action without higher complaints or returns.",
      "killCondition": "The destination changes the product, offer, stock, claim, or delivery expectation.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E21"
      ]
    },
    {
      "id": "EC-2026-030",
      "title": "Manual proof precedes fashion-tech scale",
      "claim": "Large visual-shopping systems can inspire styling and recommendation mechanics, but a five-SKU micro-label should prove the buyer job manually before building automation.",
      "mechanism": "Concierge and manual tests expose useful combinations, language, edge cases, and demand at near-zero technical cost.",
      "sourceIds": [
        "S062",
        "S063",
        "S064"
      ],
      "evidenceTier": "A",
      "confidence": 89,
      "conditions": "The manual service is capacity-capped and records product relevance, size choices, and outcome.",
      "vorgMutation": "Run founder-curated look recommendations or a pop-up styling station before any recommender build.",
      "funnelStage": "service and merchandising",
      "metric": "qualified styling requests and assisted purchases",
      "successThreshold": "A repeatable styling job produces qualified action and reusable content inside the cap.",
      "killCondition": "Technology work begins before a repeatable buyer problem and measurable outcome exist.",
      "risk": "Green",
      "status": "library",
      "feedsTactics": [
        "E18",
        "E24",
        "E29"
      ]
    },
    {
      "id": "EC-2026-031",
      "title": "Repository access is not item-level permission",
      "claim": "A library, catalog, preview, or borrowing route does not by itself authorize local full-text ingestion, model training, or republication.",
      "mechanism": "Item-level rights checks separate discoverability and reading access from public-domain status or an explicit open licence.",
      "sourceIds": [
        "S069",
        "S070",
        "S071",
        "S072",
        "S073",
        "S074"
      ],
      "evidenceTier": "A",
      "confidence": 99,
      "conditions": "Every locally ingested full text records the exact edition, rights holder where applicable, licence or public-domain basis, source URL, geography limit, and checked date.",
      "vorgMutation": "Make the library build fail if a full-text ingestion mode lacks public-domain or explicit open-licence evidence.",
      "funnelStage": "knowledge governance",
      "metric": "item-level rights coverage",
      "successThreshold": "One hundred percent of full-text records have a validated item-level rights route and required attribution metadata.",
      "killCondition": "A preview, borrow button, free account, repository label, or uploader assertion is treated as blanket reuse permission.",
      "risk": "Red",
      "status": "adopted-policy",
      "feedsTactics": [
        "E01",
        "E03",
        "E08",
        "E21"
      ]
    },
    {
      "id": "EC-2026-032",
      "title": "Open textbooks provide frameworks, not current platform truth",
      "claim": "Open marketing textbooks can strengthen durable concepts and operating checklists, but fast-changing platform mechanics must be rechecked against current official documentation.",
      "mechanism": "Framework-plus-current-doc pairing preserves conceptual depth without fossilizing obsolete interfaces, channel rules, or benchmarks.",
      "sourceIds": [
        "S075",
        "S076",
        "S077",
        "S078",
        "S079"
      ],
      "evidenceTier": "B",
      "confidence": 94,
      "conditions": "Each extracted claim records edition date, licence, durable mechanism, and any platform-specific detail requiring a current check.",
      "vorgMutation": "Use open textbooks for journeys, positioning, testing, attribution, and channel structure; bind execution steps to dated platform docs and a VORG test.",
      "funnelStage": "knowledge operations",
      "metric": "claims with durable/current separation",
      "successThreshold": "Every platform-dependent claim has a current official source and no textbook example is presented as a modern performance benchmark.",
      "killCondition": "A dated textbook interface, tactic, or case result is executed without current platform and market verification.",
      "risk": "Green",
      "status": "adopted-policy",
      "feedsTactics": [
        "E01",
        "E03",
        "E08",
        "E21",
        "E26",
        "E30"
      ]
    },
    {
      "id": "EC-2026-033",
      "title": "Gatineau commerce requires French and distance-contract truth",
      "claim": "Selling to Quebec customers requires the storefront, commercial communications, transaction information, and post-purchase documents to satisfy applicable French-language and distance-contract obligations.",
      "mechanism": "Bilingual product and policy parity plus complete pre-transaction and retained contract information reduce cancellation, complaint, and trust risk.",
      "sourceIds": [
        "S081",
        "S082"
      ],
      "evidenceTier": "A",
      "confidence": 98,
      "conditions": "A qualified Quebec review confirms the exact business, channel, product, advertising, contract, delivery, cancellation, and language requirements before launch.",
      "vorgMutation": "Add a Quebec storefront gate covering complete French content, PDPs, service, pricing, delivery, cancellation/returns, order confirmation, invoices, social content, and pop-up advertising.",
      "funnelStage": "storefront and fulfilment governance",
      "metric": "Quebec launch-check coverage and blocking defects",
      "successThreshold": "Every applicable Quebec requirement is linked, owner-approved, rehearsed on mobile, and free of severity-one gaps before selling into Gatineau.",
      "killCondition": "The open drop accepts Quebec orders while material French content, required disclosures, contract copies, delivery, cancellation, or refund handling remains unresolved.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E19",
        "E20",
        "E21",
        "E24",
        "E25",
        "E26",
        "E27"
      ]
    },
    {
      "id": "EC-2026-034",
      "title": "Environmental fashion claims need claim-level substantiation",
      "claim": "Environmental product or business claims must be truthful, specific, and supported under the applicable Canadian standard rather than inferred from aesthetic, material name, supplier language, or good intent.",
      "mechanism": "Claim-level evidence prevents broad sustainability language from outrunning test reports, chain-of-custody records, lifecycle scope, or the general impression conveyed to customers.",
      "sourceIds": [
        "S054",
        "S055",
        "S083"
      ],
      "evidenceTier": "A",
      "confidence": 99,
      "conditions": "Current Competition Act guidance and the exact product/business claim are reviewed with supporting tests, scope, qualifications, supplier evidence, and general-impression analysis.",
      "vorgMutation": "Block words such as sustainable, eco-friendly, responsible, low-impact, recycled, or carbon claims until a named approver links adequate support for the exact SKU and wording.",
      "funnelStage": "product and claim governance",
      "metric": "environmental-claim evidence coverage and incidents",
      "successThreshold": "Every environmental representation has claim-level substantiation, scope, qualifications, approval, and a current source before publication.",
      "killCondition": "A claim relies only on supplier copy, a single material attribute, an AI summary, or an undefined environmental benefit.",
      "risk": "Orange",
      "status": "adopted-policy",
      "feedsTactics": [
        "E01",
        "E07",
        "E21",
        "E24",
        "E25",
        "E28"
      ]
    }
  ]
});
})();
