// ============================================================
// Na Quadra — Schema: Article (MongoDB / Mongoose)
// ============================================================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, collection: 'articles' })
export class Article {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  title!: string;

  @Prop()
  subtitle?: string;

  @Prop({ required: true })
  content!: string;

  @Prop()
  coverImage?: string;

  @Prop({ type: { id: String, name: String, avatar: String }, required: true })
  author!: { id: string; name: string; avatar?: string };

  @Prop({ required: true, enum: ['news', 'analysis', 'feature', 'explainer'] })
  category!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [String], default: [] })
  relatedTeams!: string[];

  @Prop({ type: [String], default: [] })
  relatedPlayers!: string[];

  @Prop({ required: true, enum: ['editorial', 'espn-ingested'], default: 'editorial' })
  source!: string;

  @Prop()
  sourceUrl?: string;

  @Prop({ required: true, enum: ['published', 'draft', 'archived'], default: 'draft' })
  status!: string;

  @Prop({ required: true })
  publishedAt!: Date;

  @Prop({ required: true, default: 3 })
  readTimeMinutes!: number;

  @Prop({ type: [String], default: [] })
  glossaryTerms!: string[];

  // Text index for full-text search
  @Prop({ index: 'text' })
  searchText?: string; // populated by pre-save hook
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// ── Indexes ──
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ category: 1, publishedAt: -1 });
ArticleSchema.index({ relatedTeams: 1 });
ArticleSchema.index({ status: 1 });

// ── Pre-save: populate searchText for full-text ──
ArticleSchema.pre('save', function () {
  this.searchText = [this.title, this.subtitle, this.tags?.join(' ')].filter(Boolean).join(' ');
});
