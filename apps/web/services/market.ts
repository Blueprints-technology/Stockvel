import { api } from './api';
import type {
  LearnArticlesResponse,
  LearningArticle,
  LearningCategory,
  NewsletterSubscriber,
  PodcastEpisode,
  ResearchLatestItem,
  ResearchReport,
  ResearchReportsResponse,
  SectorCategory,
  SectorCategoryDetail,
  TreasurySeries,
} from '@/types';

export async function fetchOverview() {
  const { data } = await api.get('/dashboard/overview');
  return data;
}

export async function fetchInsights() {
  const { data } = await api.get('/dashboard/insights');
  return data;
}

export async function fetchStocks(params?: Record<string, string | number | undefined>) {
  const { data } = await api.get('/stocks', { params });
  return data;
}

export async function fetchStock(ticker: string) {
  const { data } = await api.get(`/stocks/${ticker}`);
  return data;
}

export async function fetchCrypto(params?: Record<string, string | number | undefined>) {
  const { data } = await api.get('/crypto', { params });
  return data;
}

export async function fetchCryptoAsset(symbol: string) {
  const { data } = await api.get(`/crypto/${symbol}`);
  return data;
}

export async function fetchNews(params?: Record<string, string | number | boolean | undefined>) {
  const { data } = await api.get('/news', { params });
  return data;
}

export async function fetchNewsItem(slug: string) {
  const { data } = await api.get(`/news/${slug}`);
  return data;
}

export async function searchEverything(query: string) {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
}

export async function fetchLearnArticles(params?: Record<string, string | number | undefined>) {
  const { data } = await api.get<LearnArticlesResponse>('/learn/articles', { params });
  return data;
}

export async function fetchLearnArticle(slug: string) {
  const { data } = await api.get<LearningArticle>(`/learn/articles/${slug}`);
  return data;
}

export async function fetchLearnCategories() {
  const { data } = await api.get<LearningCategory[]>('/learn/categories');
  return data;
}

export async function toggleLearnBookmark(slug: string) {
  const { data } = await api.post(`/learn/articles/${slug}/bookmark`);
  return data;
}

export async function fetchResearchReports(params?: Record<string, string | number | undefined>) {
  const { data } = await api.get<ResearchReportsResponse>('/research/reports', { params });
  return data;
}

export async function fetchResearchReport(slug: string) {
  const { data } = await api.get<ResearchReport>(`/research/reports/${slug}`);
  return data;
}

export async function trackResearchDownload(slug: string) {
  const { data } = await api.post(`/research/reports/${slug}/download`);
  return data;
}

export async function fetchPodcasts() {
  const { data } = await api.get<PodcastEpisode[]>('/research/podcasts');
  return data;
}

export async function fetchPodcast(slug: string) {
  const { data } = await api.get<PodcastEpisode>(`/research/podcasts/${slug}`);
  return data;
}

export async function fetchTreasuries() {
  const { data } = await api.get<TreasurySeries[]>('/research/treasuries');
  return data;
}

export async function fetchResearchLatest() {
  const { data } = await api.get<ResearchLatestItem[]>('/research/latest');
  return data;
}

export async function fetchSectorCategories() {
  const { data } = await api.get<SectorCategory[]>('/categories');
  return data;
}

export async function fetchSectorCategory(slug: string) {
  const { data } = await api.get<SectorCategoryDetail>(`/categories/${slug}`);
  return data;
}

export async function subscribeNewsletter(payload: { email: string; preferences?: string[] }) {
  const { data } = await api.post('/newsletter/subscribe', payload);
  return data;
}

export async function unsubscribeNewsletter(payload: { email: string }) {
  const { data } = await api.post('/newsletter/unsubscribe', payload);
  return data;
}

export async function fetchNewsletterSubscribers() {
  const { data } = await api.get<NewsletterSubscriber[]>('/newsletter/subscribers');
  return data;
}

export async function draftNewsletter(payload: { subject: string; content: string; scheduledFor?: string }) {
  const { data } = await api.post('/newsletter/draft', payload);
  return data;
}

export async function sendNewsletter(payload: { subject: string; content: string }) {
  const { data } = await api.post('/newsletter/send', payload);
  return data;
}
