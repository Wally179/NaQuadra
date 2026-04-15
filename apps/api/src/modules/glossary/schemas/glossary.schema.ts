// ============================================================
// Na Quadra — Schema: Glossary (MongoDB / Mongoose)
// ============================================================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GlossaryDocument = HydratedDocument<GlossaryEntry>;

@Schema({ timestamps: true, collection: 'glossary' })
export class GlossaryEntry {
  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  term!: string;

  @Prop({ required: true })
  shortDefinition!: string;

  @Prop()
  fullDefinition?: string;

  @Prop({
    required: true,
    enum: ['plays', 'positions', 'stats', 'rules', 'culture', 'competition'],
  })
  category!: string;

  @Prop({ type: [String], default: [] })
  relatedTerms!: string[];

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty!: string;
}

export const GlossarySchema = SchemaFactory.createForClass(GlossaryEntry);

// ── Indexes ──
GlossarySchema.index({ category: 1 });
GlossarySchema.index({ difficulty: 1 });
GlossarySchema.index({ term: 'text', shortDefinition: 'text' });
