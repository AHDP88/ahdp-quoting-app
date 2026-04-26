/**
 * This script creates the database schema required for the application.
 * Run this after making changes to the Drizzle schema.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log("Dropping tables if they exist...");
    await db.execute(sql`DROP TABLE IF EXISTS quotes CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    
    console.log("Creating users table...");
    await db.execute(
      sql`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`
    );

    console.log("Creating quotes table...");
    await db.execute(
      sql`CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        
        -- Basic Info
        project_type TEXT NOT NULL, -- deck, pergola, deck-pergola, carport
        
        -- Decking Section
        decking_required BOOLEAN DEFAULT TRUE,
        length TEXT NOT NULL,
        width TEXT NOT NULL,
        height TEXT NOT NULL,
        joist_size TEXT DEFAULT '',
        bearer_size TEXT DEFAULT '',
        board_size TEXT DEFAULT '',
        custom_board_size TEXT DEFAULT '',
        board_type TEXT DEFAULT '',
        board_direction TEXT DEFAULT '',
        subframe_painted BOOLEAN DEFAULT FALSE,
        joist_protection_tape BOOLEAN DEFAULT FALSE,
        
        -- Fascia/Screening
        fascia_required BOOLEAN DEFAULT FALSE,
        fascia_type TEXT DEFAULT '',
        fascia_type_other TEXT DEFAULT '',
        
        -- Fixing & Ground
        fixing_type TEXT DEFAULT '',
        fixing_type_other TEXT DEFAULT '',
        ground_type TEXT DEFAULT '',
        post_installation TEXT DEFAULT '',
        
        -- Dig Out
        dig_out_required BOOLEAN DEFAULT FALSE,
        dig_out_size TEXT DEFAULT '0',
        
        -- Steps/Ramps
        step_ramp_required BOOLEAN DEFAULT FALSE,
        number_of_steps INTEGER DEFAULT 0,
        step_height TEXT DEFAULT '0',
        step_width TEXT DEFAULT '0',
        step_length TEXT DEFAULT '0',
        tread_material TEXT DEFAULT '',
        handrail_required BOOLEAN DEFAULT FALSE,
        handrail_type TEXT DEFAULT '',
        balustrade_type TEXT DEFAULT '',
        
        -- Deck Lights and Demo
        deck_lights BOOLEAN DEFAULT FALSE,
        demolition_required BOOLEAN DEFAULT FALSE,
        existing_deck_size TEXT DEFAULT '0',
        
        -- Verandah Section
        verandah_required BOOLEAN DEFAULT FALSE,
        structure_type TEXT DEFAULT '', -- Verandah, Pergola, Carport, Other
        material_type TEXT DEFAULT '', -- Steel, Timber
        structure_style TEXT DEFAULT '', -- Flat, Straight Gable, Intersecting Gable, Split Gable
        
        -- Roof details
        roof_type TEXT DEFAULT '', -- CGI, Poly-Standard, Poly-Premium, etc.
        roof_color_up TEXT DEFAULT '',
        roof_color_down TEXT DEFAULT '',
        roof_span TEXT DEFAULT '0',
        roof_length TEXT DEFAULT '0',
        roof_pitch TEXT DEFAULT '0',
        
        -- Frame details
        beam_size TEXT DEFAULT '',
        rafter_size TEXT DEFAULT '',
        post_size TEXT DEFAULT '',
        
        -- Gutter details
        gutter_type TEXT DEFAULT '',
        gutter_color TEXT DEFAULT '',
        
        -- Painting
        painting_required TEXT DEFAULT 'not-required', -- Not Required, By Client, By AHDP
        paint_color TEXT DEFAULT '',
        
        -- Walls & Screening
        screening_required BOOLEAN DEFAULT FALSE,
        wall_type TEXT DEFAULT '', -- FC Cladding, Decking, Rendered Blueboard, etc.
        screen_material TEXT DEFAULT '', -- Merbau, Treated Pine, Hardwood, etc.
        cladding_height TEXT DEFAULT '0',
        number_of_bays INTEGER DEFAULT 0,
        paint_stain_required TEXT DEFAULT 'no', -- Yes - By AHDP, Yes - By Client, No
        paint_stain_color TEXT DEFAULT '',
        
        -- Extras Section
        extras_required BOOLEAN DEFAULT FALSE,
        bin_hire_required BOOLEAN DEFAULT FALSE,
        rubbish_removal BOOLEAN DEFAULT FALSE,
        paving_cut_required BOOLEAN DEFAULT FALSE,
        landscaping_retaining_required BOOLEAN DEFAULT FALSE,
        electrical_work_required BOOLEAN DEFAULT FALSE,
        plumbing_work_required BOOLEAN DEFAULT FALSE,
        asbestos_removal_required BOOLEAN DEFAULT FALSE,
        core_drilling_required BOOLEAN DEFAULT FALSE,
        extra_excavation_required BOOLEAN DEFAULT FALSE,
        stair_handrail_fix_required BOOLEAN DEFAULT FALSE,
        miscellaneous_notes TEXT DEFAULT '',
        extra_trades_required JSONB DEFAULT '[]',
        extra_trades_other TEXT DEFAULT '',
        
        -- Construction Details
        construction_access TEXT DEFAULT 'easy',
        subfloor_height TEXT DEFAULT '0',
        concrete_footings_required BOOLEAN DEFAULT FALSE,
        oversized_posts_required BOOLEAN DEFAULT FALSE,
        slab_cutting_required BOOLEAN DEFAULT FALSE,
        construction_notes TEXT DEFAULT '',
        
        -- Site Requirements
        site_access TEXT DEFAULT 'easy',
        ground_conditions TEXT DEFAULT 'level',
        council_approval BOOLEAN DEFAULT FALSE,
        power_water_available BOOLEAN DEFAULT TRUE,
        site_notes TEXT DEFAULT '',
        
        -- Original fields
        material_id TEXT NOT NULL,
        options JSONB NOT NULL,
        client_name TEXT,
        client_email TEXT,
        client_phone TEXT,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    );

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});