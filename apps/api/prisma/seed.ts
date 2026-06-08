import {
  ArticleStatus,
  AssetType,
  FetchStrategy,
  NewsletterStatus,
  NotificationType,
  PrismaClient,
  ProviderHealthStatus,
  ResearchReportStatus,
  ResearchReportType,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD ?? 'ChangeMe123!', 12);
  const userPassword = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com' },
    update: {},
    create: {
      email: process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          displayName: 'Platform Admin',
          username: 'market_admin',
          bio: 'Administrator for the Financial Market Platform.',
        },
      },
    },
    include: { profile: true },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@fmp.com' },
    update: {},
    create: {
      email: 'demo@fmp.com',
      passwordHash: userPassword,
      role: Role.USER,
      profile: {
        create: {
          displayName: 'Demo Investor',
          username: 'smart_naira_001',
          bio: 'Retail investor focused on Nigerian equities and major cryptocurrencies.',
        },
      },
    },
    include: { profile: true },
  });

  const newsCategories = await Promise.all(
    [
      { name: 'Equities', slug: 'equities', description: 'Nigerian stocks and company updates' },
      { name: 'Crypto', slug: 'crypto', description: 'Cryptocurrency markets and blockchain insights' },
      { name: 'Economy', slug: 'economy', description: 'Macroeconomic developments and policy updates' },
      { name: 'Education', slug: 'education', description: 'Financial literacy and explainers' },
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      }),
    ),
  );

  const sectorCategories = await Promise.all(
    [
      { name: 'Banking', slug: 'banking', description: 'Banks and diversified financial services', icon: 'Landmark', color: '#0f766e' },
      { name: 'Consumer Goods', slug: 'consumer-goods', description: 'Food, household, and packaged goods companies', icon: 'ShoppingBasket', color: '#ea580c' },
      { name: 'Oil & Gas', slug: 'oil-gas', description: 'Energy producers and downstream operators', icon: 'Fuel', color: '#dc2626' },
      { name: 'Telecommunications', slug: 'telecommunications', description: 'Connectivity, towers, and telecom infrastructure', icon: 'Signal', color: '#7c3aed' },
      { name: 'Layer 1', slug: 'layer-1', description: 'Core blockchain settlement networks', icon: 'Cpu', color: '#2563eb' },
      { name: 'Stablecoins', slug: 'stablecoins', description: 'Dollar-pegged digital assets and settlement rails', icon: 'Shield', color: '#059669' },
      { name: 'Payments', slug: 'payments', description: 'Financial rails, merchant services, and payment infrastructure', icon: 'Wallet', color: '#0891b2' },
      { name: 'Commodities', slug: 'commodities', description: 'Commodity-linked businesses and inflation hedges', icon: 'Gem', color: '#ca8a04' },
    ].map((category) =>
      prisma.sectorCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      }),
    ),
  );

  const stockProviders = await Promise.all(
    [
      { name: 'NGX Group', slug: 'ngx', baseUrl: 'https://ngxgroup.com', priority: 1, rateLimitPerMin: 30 },
      { name: 'NGX Pulse', slug: 'ngx-pulse', baseUrl: 'https://ngxgroup.com', priority: 2, rateLimitPerMin: 30 },
      { name: 'NGN Market Mirror', slug: 'ngn-market', baseUrl: 'https://example.com/ngn-market', priority: 3, rateLimitPerMin: 20 },
      { name: 'iTick', slug: 'itick', baseUrl: 'https://example.com/itick', priority: 4, rateLimitPerMin: 20 },
      { name: 'EODHD', slug: 'eodhd', baseUrl: 'https://eodhd.com', priority: 5, rateLimitPerMin: 60 },
    ].map((provider) =>
      prisma.stockDataProvider.upsert({
        where: { slug: provider.slug },
        update: provider,
        create: provider,
      }),
    ),
  );

  const primaryStockProvider = stockProviders[0];

  const stocks = [
    { ticker: 'ACCESSCORP', companyName: 'Access Holdings Plc', sector: 'Banking', currentPrice: 25.3, dailyChange: 0, percentChange: 0, marketCap: 1350000000000, eps: 4.2, peRatio: 6.1, dividendYield: 0.072, volume: 52225684, week52High: 28.9, week52Low: 14.4, trendScore: 92 },
    { ticker: 'GTCO', companyName: 'Guaranty Trust Holding Company Plc', sector: 'Banking', currentPrice: 62.5, dailyChange: 1.7, percentChange: 2.8, marketCap: 1840000000000, eps: 9.8, peRatio: 6.4, dividendYield: 0.088, volume: 24500000, week52High: 68.2, week52Low: 33.1, trendScore: 89 },
    { ticker: 'ZENITHBANK', companyName: 'Zenith Bank Plc', sector: 'Banking', currentPrice: 49.8, dailyChange: 0.8, percentChange: 1.63, marketCap: 1550000000000, eps: 8.7, peRatio: 5.7, dividendYield: 0.094, volume: 19800000, week52High: 54.9, week52Low: 28.4, trendScore: 87 },
    { ticker: 'DANGSUGAR', companyName: 'Dangote Sugar Refinery Plc', sector: 'Consumer Goods', currentPrice: 35.4, dailyChange: -0.6, percentChange: -1.67, marketCap: 430000000000, eps: 3.1, peRatio: 11.4, dividendYield: 0.041, volume: 5400000, week52High: 48.7, week52Low: 29.2, trendScore: 74 },
    { ticker: 'BUAFOODS', companyName: 'BUA Foods Plc', sector: 'Consumer Goods', currentPrice: 967, dailyChange: 0, percentChange: 0, marketCap: 17400000000000, eps: 24.6, peRatio: 39.3, dividendYield: 0.014, volume: 129323, week52High: 1101, week52Low: 220, trendScore: 85 },
    { ticker: 'MTNN', companyName: 'MTN Nigeria Communications Plc', sector: 'Telecommunications', currentPrice: 245, dailyChange: 5.5, percentChange: 2.3, marketCap: 5100000000000, eps: 14.5, peRatio: 16.9, dividendYield: 0.035, volume: 3800000, week52High: 289, week52Low: 168, trendScore: 83 },
    { ticker: 'SEPLAT', companyName: 'Seplat Energy Plc', sector: 'Oil & Gas', currentPrice: 5800, dailyChange: 120, percentChange: 2.11, marketCap: 3410000000000, eps: 102.3, peRatio: 56.7, dividendYield: 0.021, volume: 192000, week52High: 6200, week52Low: 2800, trendScore: 78 },
    { ticker: 'ARADEL', companyName: 'Aradel Holdings Plc', sector: 'Oil & Gas', currentPrice: 1836, dailyChange: 0, percentChange: 0, marketCap: 2400000000000, eps: 61.7, peRatio: 29.8, dividendYield: 0.009, volume: 2837953, week52High: 2300, week52Low: 690, trendScore: 80 },
  ];

  const sectorMap = new Map(sectorCategories.map((item) => [item.slug, item]));

  for (const stock of stocks) {
    const created = await prisma.stock.upsert({
      where: { ticker: stock.ticker },
      update: { ...stock, lastUpdatedAt: new Date() },
      create: { ...stock, lastUpdatedAt: new Date() },
    });

    const sectorSlug = stock.sector === 'Banking'
      ? 'banking'
      : stock.sector === 'Consumer Goods'
        ? 'consumer-goods'
        : stock.sector === 'Oil & Gas'
          ? 'oil-gas'
          : stock.sector === 'Telecommunications'
            ? 'telecommunications'
            : null;

    if (sectorSlug) {
      const category = sectorMap.get(sectorSlug);
      if (category) {
        await prisma.assetCategory.findFirst({ where: { stockId: created.id, categoryId: category.id } }).then(async (existing) => {
          if (!existing) {
            await prisma.assetCategory.create({ data: { stockId: created.id, categoryId: category.id } });
          }
        });
      }
    }

    const now = new Date();
    for (let i = 30; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const base = stock.currentPrice * (1 - i * 0.0015);
      await prisma.stockPrice.upsert({
        where: { stockId_date: { stockId: created.id, date } },
        update: { providerId: primaryStockProvider.id },
        create: {
          stockId: created.id,
          providerId: primaryStockProvider.id,
          date,
          open: Number((base * 0.99).toFixed(2)),
          high: Number((base * 1.02).toFixed(2)),
          low: Number((base * 0.97).toFixed(2)),
          close: Number(base.toFixed(2)),
          volume: Math.max((stock.volume ?? 10000) * (1 - i * 0.01), 1000),
        },
      });
    }
  }

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin', currentPrice: 103500, marketCap: 2050000000000, change24h: 2.8, volume24h: 45000000000, circulatingSupply: 19700000, trendScore: 100, imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum', currentPrice: 3800, marketCap: 456000000000, change24h: 4.1, volume24h: 29000000000, circulatingSupply: 120200000, trendScore: 97, imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { symbol: 'SOL', name: 'Solana', coingeckoId: 'solana', currentPrice: 182, marketCap: 84000000000, change24h: 5.4, volume24h: 4500000000, circulatingSupply: 467000000, trendScore: 91, imageUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { symbol: 'USDT', name: 'Tether', coingeckoId: 'tether', currentPrice: 1, marketCap: 140000000000, change24h: 0.02, volume24h: 96000000000, circulatingSupply: 140000000000, trendScore: 70, imageUrl: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
    { symbol: 'BNB', name: 'BNB', coingeckoId: 'binancecoin', currentPrice: 710, marketCap: 103000000000, change24h: 1.8, volume24h: 2200000000, circulatingSupply: 145000000, trendScore: 83, imageUrl: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  ];

  for (const crypto of cryptos) {
    const created = await prisma.cryptoAsset.upsert({
      where: { symbol: crypto.symbol },
      update: { ...crypto, lastUpdatedAt: new Date() },
      create: { ...crypto, lastUpdatedAt: new Date() },
    });

    const sectorSlug = ['BTC', 'ETH', 'SOL'].includes(crypto.symbol)
      ? 'layer-1'
      : crypto.symbol === 'USDT'
        ? 'stablecoins'
        : crypto.symbol === 'BNB'
          ? 'payments'
          : null;

    if (sectorSlug) {
      const category = sectorMap.get(sectorSlug);
      if (category) {
        await prisma.assetCategory.findFirst({ where: { cryptoAssetId: created.id, categoryId: category.id } }).then(async (existing) => {
          if (!existing) {
            await prisma.assetCategory.create({ data: { cryptoAssetId: created.id, categoryId: category.id } });
          }
        });
      }
    }

    const now = new Date();
    for (let i = 30; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const base = crypto.currentPrice * (1 - i * 0.0025);
      await prisma.cryptoPrice.upsert({
        where: { cryptoAssetId_date: { cryptoAssetId: created.id, date } },
        update: {},
        create: {
          cryptoAssetId: created.id,
          date,
          open: Number((base * 0.99).toFixed(2)),
          high: Number((base * 1.03).toFixed(2)),
          low: Number((base * 0.96).toFixed(2)),
          close: Number(base.toFixed(2)),
          volume: Math.max((crypto.volume24h ?? 10000) * (1 - i * 0.01), 1000),
        },
      });
    }
  }

  await prisma.marketIndex.upsert({
    where: { symbol: 'NGXASI' },
    update: {
      name: 'NGX All-Share Index',
      value: 98512.44,
      change: 111.7,
      percentChange: 0.11,
      marketCap: 56300000000000,
      breadthAdvancers: 31,
      breadthDecliners: 17,
      fearGreed: 58,
      tradeDate: new Date(),
    },
    create: {
      symbol: 'NGXASI',
      name: 'NGX All-Share Index',
      value: 98512.44,
      change: 111.7,
      percentChange: 0.11,
      marketCap: 56300000000000,
      breadthAdvancers: 31,
      breadthDecliners: 17,
      fearGreed: 58,
      tradeDate: new Date(),
    },
  });

  const newsSources = await Promise.all(
    [
      { name: 'Nairametrics', slug: 'nairametrics', baseUrl: 'https://nairametrics.com', fetchStrategy: FetchStrategy.RSS },
      { name: 'Punch Business', slug: 'punch-business', baseUrl: 'https://punchng.com/topics/business/', fetchStrategy: FetchStrategy.RSS },
      { name: 'The Guardian Business', slug: 'guardian-business', baseUrl: 'https://guardian.ng/category/business-services/', fetchStrategy: FetchStrategy.RSS },
      { name: 'BusinessDay', slug: 'businessday', baseUrl: 'https://businessday.ng', fetchStrategy: FetchStrategy.RSS },
      { name: 'TechCabal', slug: 'techcabal', baseUrl: 'https://techcabal.com', fetchStrategy: FetchStrategy.RSS },
      { name: 'Techpoint Africa', slug: 'techpoint-africa', baseUrl: 'https://techpoint.africa', fetchStrategy: FetchStrategy.RSS },
      { name: 'CoinGecko', slug: 'coingecko', baseUrl: 'https://www.coingecko.com', fetchStrategy: FetchStrategy.API },
    ].map((source) =>
      prisma.newsSource.upsert({
        where: { slug: source.slug },
        update: source,
        create: source,
      }),
    ),
  );

  const newsItems = [
    {
      categoryId: newsCategories.find((category) => category.slug === 'equities')?.id,
      sourceId: newsSources.find((source) => source.slug === 'nairametrics')?.id,
      slug: 'nigeria-ftse-russell-return-foreign-inflows',
      title: 'Nigeria’s FTSE Russell return could trigger fresh foreign inflows',
      excerpt: 'Analysts expect improved visibility for Nigerian equities after the market re-enters key benchmark conversations.',
      content: 'Nigeria’s re-entry into global index discussions is expected to improve discoverability, liquidity, and foreign participation across the Nigerian Exchange. This release expands content layering with category browsing, research surfaces, and provider-aware news ingestion.',
      source: 'Nairametrics',
      sourceUrl: 'https://nairametrics.com/2026/05/30/ftse-russell-return-demo',
      publishedAt: new Date(),
      assetType: AssetType.STOCK,
      assetSymbol: 'NGXASI',
      isInsight: true,
      trendingScore: 82,
      categoryLabel: 'Equities',
    },
    {
      categoryId: newsCategories.find((category) => category.slug === 'crypto')?.id,
      sourceId: newsSources.find((source) => source.slug === 'coingecko')?.id,
      slug: 'bitcoin-strengthens-above-100k',
      title: 'Bitcoin strengthens above $100k as institutional appetite returns',
      excerpt: 'Crypto market breadth broadens with Bitcoin dominance stabilizing and altcoins gaining momentum.',
      content: 'Bitcoin sustained momentum above the six-figure mark, while Ethereum and Solana also posted healthy gains. The platform uses CoinGecko-backed synchronization for market data and internal curation for market explainers.',
      source: 'CoinGecko',
      sourceUrl: 'https://www.coingecko.com/en/news/demo-bitcoin-strength',
      publishedAt: new Date(),
      assetType: AssetType.CRYPTO,
      assetSymbol: 'BTC',
      isInsight: true,
      trendingScore: 90,
      categoryLabel: 'Crypto',
    },
    {
      categoryId: newsCategories.find((category) => category.slug === 'education')?.id,
      sourceId: newsSources.find((source) => source.slug === 'techcabal')?.id,
      slug: 'how-to-build-a-balanced-ngn-crypto-portfolio',
      title: 'How to build a balanced NGN and crypto portfolio',
      excerpt: 'A beginner-friendly breakdown of diversification, position sizing, and risk management.',
      content: 'Investors can blend stable Nigerian dividend stocks with carefully selected crypto assets to create a diversified, multi-asset portfolio. Always review risk tolerance, liquidity, taxes, and time horizon.',
      source: 'Financial Market Platform',
      sourceUrl: 'https://example.com/education/balanced-portfolio',
      publishedAt: new Date(),
      assetType: null,
      assetSymbol: null,
      isInsight: true,
      trendingScore: 78,
      categoryLabel: 'Education',
    },
    {
      categoryId: newsCategories.find((category) => category.slug === 'economy')?.id,
      sourceId: newsSources.find((source) => source.slug === 'businessday')?.id,
      slug: 'treasury-bill-yields-hold-above-20-percent',
      title: 'Treasury bill yields hold above 20% as liquidity stays selective',
      excerpt: 'Short-dated instruments remain attractive to conservative allocators watching inflation and naira volatility.',
      content: 'Treasury yields remain compelling for local investors who want lower volatility instruments while preserving flexibility around duration.',
      source: 'BusinessDay',
      sourceUrl: 'https://businessday.ng/markets/demo-treasury-yields',
      publishedAt: new Date(),
      assetType: null,
      assetSymbol: null,
      isInsight: false,
      trendingScore: 70,
      categoryLabel: 'Economy',
    },
  ];

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { sourceUrl: news.sourceUrl },
      update: news,
      create: news,
    });
  }

  const articleCategories = await Promise.all(
    [
      { name: 'Investing Basics', slug: 'investing-basics', description: 'Foundational investing concepts for beginners' },
      { name: 'NGX Playbook', slug: 'ngx-playbook', description: 'How to approach Nigerian equities with clarity' },
      { name: 'Crypto Education', slug: 'crypto-education', description: 'Core crypto concepts and risk management' },
      { name: 'Personal Finance', slug: 'personal-finance', description: 'Cash flow, saving, and compounding ideas' },
    ].map((category) =>
      prisma.articleCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      }),
    ),
  );

  const articles = [
    {
      title: 'How dividend investing works on the NGX',
      slug: 'how-dividend-investing-works-on-the-ngx',
      excerpt: 'A plain-English guide to dividend dates, yield traps, and total return thinking.',
      content: 'Dividend investing on the NGX can be rewarding, but investors need to distinguish cash return from real total return. Focus on earnings resilience, board consistency, and payout sustainability.',
      author: 'MarketPulse Research Desk',
      categoryId: articleCategories.find((item) => item.slug === 'ngx-playbook')?.id,
      tags: ['dividends', 'ngx', 'equities'],
      isFeatured: true,
      readTime: 6,
      publishedAt: new Date(),
      status: ArticleStatus.PUBLISHED,
    },
    {
      title: 'Understanding support and resistance without hype',
      slug: 'understanding-support-and-resistance-without-hype',
      excerpt: 'A practical introduction to technical levels and how not to overfit them.',
      content: 'Support and resistance are useful because market participants cluster around visible levels. Use them with context, not as magic lines.',
      author: 'MarketPulse Research Desk',
      categoryId: articleCategories.find((item) => item.slug === 'investing-basics')?.id,
      tags: ['technical-analysis', 'trading'],
      isFeatured: false,
      readTime: 7,
      publishedAt: new Date(),
      status: ArticleStatus.PUBLISHED,
    },
    {
      title: 'What every Nigerian investor should know about treasury bills',
      slug: 'what-every-nigerian-investor-should-know-about-treasury-bills',
      excerpt: 'Why treasury bills matter for capital preservation, yield comparison, and portfolio ballast.',
      content: 'Treasury bills can serve as a portfolio anchor when risk appetite falls. Compare real yields, tenor risk, and reinvestment assumptions.',
      author: 'MarketPulse Research Desk',
      categoryId: articleCategories.find((item) => item.slug === 'personal-finance')?.id,
      tags: ['treasury-bills', 'fixed-income', 'naira'],
      isFeatured: true,
      readTime: 5,
      publishedAt: new Date(),
      status: ArticleStatus.PUBLISHED,
    },
    {
      title: 'Stablecoins for beginners: settlement, safety, and pitfalls',
      slug: 'stablecoins-for-beginners-settlement-safety-and-pitfalls',
      excerpt: 'How stablecoins are used, and where counterparty and depeg risks can appear.',
      content: 'Stablecoins improve transfer speed and access, but users should still understand custody, collateral, and platform concentration risks.',
      author: 'MarketPulse Research Desk',
      categoryId: articleCategories.find((item) => item.slug === 'crypto-education')?.id,
      tags: ['stablecoins', 'crypto', 'risk'],
      isFeatured: false,
      readTime: 8,
      publishedAt: new Date(),
      status: ArticleStatus.PUBLISHED,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  const bookmarkedArticle = await prisma.article.findUnique({ where: { slug: 'how-dividend-investing-works-on-the-ngx' } });
  if (bookmarkedArticle) {
    await prisma.articleBookmark.upsert({
      where: { userId_articleId: { userId: demoUser.id, articleId: bookmarkedArticle.id } },
      update: {},
      create: { userId: demoUser.id, articleId: bookmarkedArticle.id },
    });
  }

  const researchReports = [
    {
      title: 'Nigerian Banking Sector Outlook 2026',
      slug: 'nigerian-banking-sector-outlook-2026',
      type: ResearchReportType.MARKET_COVERAGE,
      summary: 'A concise review of capital, margins, liquidity, and valuation for major listed banks.',
      content: 'The banking sector remains central to liquidity transmission in Nigeria. Key watchpoints include FX normalization, capital adequacy, and funding cost discipline.',
      reportYear: 2026,
      reportDate: new Date(),
      author: 'MarketPulse Research Desk',
      tags: ['banking', 'ngx', 'outlook'],
      downloadCount: 114,
      isPremium: false,
      status: ResearchReportStatus.PUBLISHED,
    },
    {
      title: 'Crypto Liquidity and Stablecoin Flows in Africa',
      slug: 'crypto-liquidity-and-stablecoin-flows-in-africa',
      type: ResearchReportType.ANALYSIS,
      summary: 'An overview of how stablecoins, on-ramps, and exchange access shape market structure.',
      content: 'Stablecoins continue to play an important role in cross-border value transfer, liquidity buffering, and informal treasury management.',
      reportYear: 2026,
      reportDate: new Date(),
      author: 'MarketPulse Research Desk',
      tags: ['crypto', 'stablecoins', 'africa'],
      downloadCount: 92,
      isPremium: false,
      status: ResearchReportStatus.PUBLISHED,
    },
    {
      title: 'Treasury Bill Laddering for Income Stability',
      slug: 'treasury-bill-laddering-for-income-stability',
      type: ResearchReportType.STRATEGY,
      summary: 'How investors can stagger fixed income duration to improve flexibility and reinvestment timing.',
      content: 'A laddering strategy can reduce reinvestment concentration and allow investors to respond to changing yield conditions with more flexibility.',
      reportYear: 2026,
      reportDate: new Date(),
      author: 'MarketPulse Research Desk',
      tags: ['treasury-bills', 'strategy', 'income'],
      downloadCount: 67,
      isPremium: false,
      status: ResearchReportStatus.PUBLISHED,
    },
  ];

  for (const report of researchReports) {
    await prisma.researchReport.upsert({
      where: { slug: report.slug },
      update: report,
      create: report,
    });
  }

  const podcasts = [
    {
      title: 'Morning Call: NGX rotation and bank leadership',
      slug: 'morning-call-ngx-rotation-and-bank-leadership',
      description: 'A quick market briefing on sector rotation, breadth, and what is driving today’s tape.',
      audioUrl: 'https://example.com/audio/morning-call.mp3',
      duration: 780,
      episodeNumber: 1,
      seasonNumber: 1,
      tags: ['ngx', 'banking', 'morning-call'],
      publishedAt: new Date(),
    },
    {
      title: 'Crypto Watch: why stablecoin rails matter',
      slug: 'crypto-watch-why-stablecoin-rails-matter',
      description: 'A practical conversation about stablecoin utility, payment rails, and risk awareness.',
      audioUrl: 'https://example.com/audio/crypto-watch.mp3',
      duration: 920,
      episodeNumber: 2,
      seasonNumber: 1,
      tags: ['crypto', 'stablecoins', 'payments'],
      publishedAt: new Date(),
    },
  ];

  for (const episode of podcasts) {
    await prisma.podcastEpisode.upsert({
      where: { slug: episode.slug },
      update: episode,
      create: episode,
    });
  }

  const treasurySeries = [
    { tenor: '91D', rate: '18.2500', source: 'CBN Demo Feed' },
    { tenor: '182D', rate: '19.4000', source: 'CBN Demo Feed' },
    { tenor: '364D', rate: '21.0500', source: 'CBN Demo Feed' },
  ];

  for (let offset = 0; offset < 4; offset += 1) {
    for (const entry of treasurySeries) {
      const date = new Date();
      date.setDate(date.getDate() - offset * 7);
      await prisma.treasuryBill.create({
        data: {
          tenor: entry.tenor,
          rate: entry.rate,
          date,
          source: entry.source,
        },
      }).catch(() => null);
    }
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: 'demo@marketpulse.ng' },
    update: { isActive: true, preferences: { topics: ['learn', 'research', 'markets'] } },
    create: {
      email: 'demo@marketpulse.ng',
      preferences: { topics: ['learn', 'research', 'markets'] },
    },
  });

  await prisma.newsletter.upsert({
    where: { id: 'weekly-market-wrap' },
    update: {
      subject: 'Weekly Market Wrap',
      content: 'A concise weekly round-up of NGX, crypto, and research highlights.',
      status: NewsletterStatus.SENT,
      sentAt: new Date(),
      recipientCount: 1,
      openCount: 1,
    },
    create: {
      id: 'weekly-market-wrap',
      subject: 'Weekly Market Wrap',
      content: 'A concise weekly round-up of NGX, crypto, and research highlights.',
      status: NewsletterStatus.SENT,
      sentAt: new Date(),
      recipientCount: 1,
      openCount: 1,
    },
  });

  for (const provider of stockProviders) {
    await prisma.providerStatusLog.create({
      data: {
        providerId: provider.id,
        status: provider.slug === 'ngx' ? ProviderHealthStatus.HEALTHY : ProviderHealthStatus.DEGRADED,
        responseTimeMs: provider.slug === 'ngx' ? 480 : 930,
        errorMessage: provider.slug === 'ngx' ? null : 'Fallback mode sample status.',
      },
    }).catch(() => null);
  }

  await prisma.watchlist.upsert({
    where: { id: 'demo-watchlist-id' },
    update: {},
    create: {
      id: 'demo-watchlist-id',
      userId: demoUser.id,
      name: 'My Watchlist',
      items: {
        create: [
          { assetType: AssetType.STOCK, assetSymbol: 'ACCESSCORP', position: 0 },
          { assetType: AssetType.STOCK, assetSymbol: 'GTCO', position: 1 },
          { assetType: AssetType.CRYPTO, assetSymbol: 'BTC', position: 2 },
          { assetType: AssetType.CRYPTO, assetSymbol: 'ETH', position: 3 },
        ],
      },
    },
  }).catch(() => null);

  const portfolioAssets = [
    { assetType: AssetType.STOCK, assetSymbol: 'ACCESSCORP', quantity: 1250, buyPrice: 19.8, notes: 'Long-term NGX banking exposure' },
    { assetType: AssetType.STOCK, assetSymbol: 'MTNN', quantity: 75, buyPrice: 210, notes: 'Quality telecom cash flow play' },
    { assetType: AssetType.CRYPTO, assetSymbol: 'BTC', quantity: 0.12, buyPrice: 82500, notes: 'Core crypto allocation' },
    { assetType: AssetType.CRYPTO, assetSymbol: 'ETH', quantity: 1.5, buyPrice: 2950, notes: 'Smart contract ecosystem bet' },
  ];

  for (const asset of portfolioAssets) {
    await prisma.portfolioAsset.create({
      data: {
        userId: demoUser.id,
        ...asset,
      },
    }).catch(() => null);
  }

  const comment = await prisma.comment.create({
    data: {
      userId: demoUser.id,
      assetType: AssetType.STOCK,
      assetSymbol: 'ACCESSCORP',
      content: 'Access is still one of the strongest liquidity stories on the NGX in my view.',
      upvotes: 12,
    },
  }).catch(async () => prisma.comment.findFirstOrThrow({ where: { assetSymbol: 'ACCESSCORP' } }));

  await prisma.reply.create({
    data: {
      userId: admin.id,
      commentId: comment.id,
      content: 'Watch net interest margin and capital adequacy updates as catalysts.',
      upvotes: 4,
    },
  }).catch(() => null);

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Watchlist updated',
        message: 'BTC and ACCESSCORP remain on your watchlist with new price activity.',
        type: NotificationType.MARKET,
      },
      {
        userId: demoUser.id,
        title: 'New insight published',
        message: 'A new learning article and research report are available.',
        type: NotificationType.NEWS,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
