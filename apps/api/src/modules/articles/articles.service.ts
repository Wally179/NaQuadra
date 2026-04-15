// ============================================================
// Na Quadra — Articles Service (MongoDB)
// ============================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

export interface ArticleQueryOptions {
  category?: string;
  status?: string;
  teamId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  async findAll(options: ArticleQueryOptions = {}) {
    const { category, status = 'published', teamId, search, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { status };

    if (category) filter.category = category;
    if (teamId) filter.relatedTeams = teamId;
    if (search) filter.$text = { $search: search };

    const [data, total] = await Promise.all([
      this.articleModel
        .find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.articleModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const article = await this.articleModel.findOne({ slug, status: 'published' }).lean().exec();
    if (!article) {
      throw new NotFoundException(`Artigo '${slug}' não encontrado`);
    }
    return article;
  }

  async create(data: Partial<Article>) {
    const article = new this.articleModel(data);
    return article.save();
  }

  async update(slug: string, data: Partial<Article>) {
    const article = await this.articleModel
      .findOneAndUpdate({ slug }, data, { new: true })
      .lean()
      .exec();
    if (!article) {
      throw new NotFoundException(`Artigo '${slug}' não encontrado`);
    }
    return article;
  }
}
