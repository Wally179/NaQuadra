// ============================================================
// Na Quadra — Glossary Module (MongoDB)
// ============================================================
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlossaryEntry, GlossarySchema } from './schemas/glossary.schema';
import { GlossaryService } from './glossary.service';
import { GlossaryController } from './glossary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GlossaryEntry.name, schema: GlossarySchema }]),
  ],
  controllers: [GlossaryController],
  providers: [GlossaryService],
  exports: [GlossaryService],
})
export class GlossaryModule {}
