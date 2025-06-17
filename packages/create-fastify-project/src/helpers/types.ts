export interface ProjectOptions {
  install: boolean;
  git: boolean;
  orm: "prisma" | "none";
  db: "sqlite" | "postgres" | "mysql";
  lint: "biome" | "eslint";
}
