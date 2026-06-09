import { AssetType } from '@prisma/client';
export declare class CreateCommentDto {
    assetType: AssetType;
    assetSymbol: string;
    content: string;
}
