import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Parser from 'rss-parser';

@Injectable()
export class NewsProvider {
  private readonly parser = new Parser();

  constructor(private readonly configService: ConfigService) {}

  async fetchNews() {
    const feedUrl = this.configService.get<string>('integrations.newsFeedUrl') ?? 'https://nairametrics.com/feed/';
    const feed = await this.parser.parseURL(feedUrl);
    return (feed.items ?? []).slice(0, 25).map((item) => ({
      title: item.title ?? 'Untitled',
      excerpt: item.contentSnippet ?? item.content?.slice(0, 160) ?? 'Financial market update',
      content: item.content ?? item.contentSnippet ?? 'No content available',
      source: feed.title ?? 'Nairametrics',
      sourceUrl: item.link ?? feedUrl,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      categories: item.categories ?? [],
    }));
  }
}
