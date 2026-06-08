export type AssetType = 'STOCK' | 'CRYPTO';
export type ResearchReportType = 'MARKET_COVERAGE' | 'ANALYSIS' | 'ECONOMY' | 'STRATEGY';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  percentChange: number;
  marketCap?: number;
  breadthAdvancers: number;
  breadthDecliners: number;
  fearGreed: number;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  dailyChange: number;
  percentChange: number;
  marketCap?: number;
  eps?: number;
  peRatio?: number;
  dividendYield?: number;
  volume?: number;
  week52High?: number;
  week52Low?: number;
  prices?: PricePoint[];
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap?: number;
  change24h: number;
  volume24h?: number;
  circulatingSupply?: number;
  imageUrl?: string;
  prices?: PricePoint[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  imageUrl?: string;
  categoryLabel?: string;
  category?: { name: string; slug: string };
}

export interface CommentItem {
  id: string;
  content: string;
  upvotes: number;
  createdAt: string;
  user: { profile?: { displayName?: string; username?: string } };
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: { profile?: { displayName?: string; username?: string } };
  }>;
}

export interface LearningCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { articles: number };
}

export interface LearningArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string | null;
  authorAvatar?: string | null;
  readTime: number;
  viewCount: number;
  tags: string[];
  isFeatured: boolean;
  isBookmarked?: boolean;
  publishedAt: string;
  category?: LearningCategory | null;
  related?: LearningArticle[];
}

export interface LearnArticlesResponse {
  items: LearningArticle[];
  featured?: LearningArticle | null;
  trending: LearningArticle[];
  categories: LearningCategory[];
  pagination: PaginationMeta;
}

export interface ResearchReport {
  id: string;
  title: string;
  slug: string;
  type: ResearchReportType;
  summary: string;
  content: string;
  coverPage?: string | null;
  pdfUrl?: string | null;
  reportYear: number;
  reportDate: string;
  author: string;
  tags: string[];
  downloadCount: number;
  isPremium: boolean;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  duration: number;
  coverImage?: string | null;
  episodeNumber: number;
  seasonNumber: number;
  tags: string[];
  publishedAt: string;
  playCount: number;
}

export interface TreasurySeries {
  tenor: string;
  latestRate: number;
  previousRate: number | null;
  direction: number;
  updatedAt: string | null;
  source: string;
  series: Array<{ date: string; rate: number; source: string }>;
}

export interface ResearchLatestItem {
  kind: 'report' | 'podcast';
  date: string;
  item: ResearchReport | PodcastEpisode;
}

export interface ResearchReportsResponse {
  items: ResearchReport[];
  years: number[];
  latest: ResearchLatestItem[];
  analysis: ResearchReport[];
  marketCoverage: ResearchReport[];
  pagination: PaginationMeta;
}

export interface SectorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  assetCount?: number;
  topMover?: {
    id: string;
    ticker: string;
    companyName: string;
    currentPrice: number;
    percentChange: number;
    dailyChange: number;
  } | null;
}

export interface SectorCategoryDetail extends SectorCategory {
  stocks: Stock[];
  crypto: CryptoAsset[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  preferences?: { topics?: string[] } | Record<string, unknown>;
  subscribedAt: string;
  unsubscribedAt?: string | null;
}
