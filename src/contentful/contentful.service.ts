import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, Entry } from 'contentful';

@Injectable()
export class ContentfulService {
  private client;
  private readonly logger = new Logger(ContentfulService.name);

  constructor(private configService: ConfigService) {
    this.client = createClient({
      space: this.configService.getOrThrow<string>('CONTENTFUL_SPACE_ID'),
      accessToken: this.configService.getOrThrow<string>(
        'CONTENTFUL_ACCESS_TOKEN',
      ),
      environment: this.configService.getOrThrow<string>(
        'CONTENTFUL_ENVIRONMENT',
        'master',
      ),
    });
  }

  async fetchAllProducts(): Promise<Entry<any>[]> {
    const allItems: Entry<any>[] = [];
    const limit = 100;
    const contentType = this.configService.get<string>(
      'CONTENTFUL_CONTENT_TYPE',
      'product',
    );
    let skip = 0;

    try {
      while (true) {
        const response = await this.client.getEntries({
          content_type: contentType,
          limit,
          skip,
        });

        allItems.push(...response.items);

        if (response.items.length < limit) break;

        skip += limit;
      }

      return allItems;
    } catch (error) {
      this.logger.error('Error fetching products from Contentful', error);
      return [];
    }
  }
}
