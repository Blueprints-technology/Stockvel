import { Prisma } from "@prisma/client";
import rawPodcastData from "../data/podcasts.json";
import { PodcastSchema, type PodcastInput } from "../utils/validate";
import { logger } from "../utils/logger";

const episodes = rawPodcastData.map((p, i) => {
  try {
    return PodcastSchema.parse(p);
  } catch (err) {
    logger.error(`Invalid podcast at index ${i}: ${err}`);
    throw err;
  }
});

export async function seedPodcasts(tx: Prisma.TransactionClient) {
  logger.info(`Seeding ${episodes.length} podcast episodes...`);

  const BATCH_SIZE = 10;

  for (let i = 0; i < episodes.length; i += BATCH_SIZE) {
    const batch = episodes.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map((episode: PodcastInput) => {
        const { id, createdAt, updatedAt, source, region, ...prismaData } =
          episode;

        const prismaPayload = {
          ...prismaData,
          publishedAt: episode.publishedAt
            ? new Date(episode.publishedAt)
            : new Date(),
          playCount: episode.playCount ?? 0,
          coverImage: episode.coverImage ?? null,
        };

        return tx.podcastEpisode.upsert({
          where: { slug: episode.slug },
          update: prismaPayload,
          create: prismaPayload,
        });
      }),
    );
  }

  logger.info(`✓ Seeded ${episodes.length} podcast episodes`);
}
