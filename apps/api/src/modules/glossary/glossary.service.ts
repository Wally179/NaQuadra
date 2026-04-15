// ============================================================
// Na Quadra — Glossary Service (MongoDB)
// ============================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlossaryEntry, GlossaryDocument } from './schemas/glossary.schema';

export interface GlossaryQueryOptions {
  category?: string;
  difficulty?: string;
  search?: string;
}

@Injectable()
export class GlossaryService {
  constructor(
    @InjectModel(GlossaryEntry.name)
    private readonly glossaryModel: Model<GlossaryDocument>,
  ) {}

  async findAll(options: GlossaryQueryOptions = {}) {
    const { category, difficulty, search } = options;
    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.$text = { $search: search };

    const data = await this.glossaryModel
      .find(filter)
      .sort({ term: 1 })
      .lean()
      .exec();

    return data;
  }

  async findBySlug(slug: string) {
    const entry = await this.glossaryModel.findOne({ slug }).lean().exec();
    if (!entry) {
      throw new NotFoundException(`Termo '${slug}' não encontrado`);
    }
    return entry;
  }

  async upsert(data: Partial<GlossaryEntry> & { slug: string }) {
    return this.glossaryModel.findOneAndUpdate(
      { slug: data.slug },
      data,
      { upsert: true, new: true, lean: true },
    ).exec();
  }

  async count() {
    return this.glossaryModel.countDocuments().exec();
  }
}
