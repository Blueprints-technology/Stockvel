"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPodcasts = seedPodcasts;
const podcasts_json_1 = __importDefault(require("../data/podcasts.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
const episodes = podcasts_json_1.default.map((p, i) => {
    try {
        return validate_1.PodcastSchema.parse(p);
    }
    catch (err) {
        logger_1.logger.error(`Invalid podcast at index ${i}: ${err}`);
        throw err;
    }
});
async function seedPodcasts(tx) {
    logger_1.logger.info(`Seeding ${episodes.length} podcast episodes...`);
    const BATCH_SIZE = 10;
    for (let i = 0; i < episodes.length; i += BATCH_SIZE) {
        const batch = episodes.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((episode) => {
            const { id, createdAt, updatedAt, source, region, ...prismaData } = episode;
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
        }));
    }
    logger_1.logger.info(`✓ Seeded ${episodes.length} podcast episodes`);
}
//# sourceMappingURL=podcasts.js.map