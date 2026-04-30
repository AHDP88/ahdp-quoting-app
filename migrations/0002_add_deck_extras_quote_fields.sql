ALTER TABLE quotes ADD COLUMN IF NOT EXISTS stair_type TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS fascia_length TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS handrail_lineal_metres TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS handrail_height TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS balustrade_lineal_metres TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS balustrade_finish_painted BOOLEAN;
