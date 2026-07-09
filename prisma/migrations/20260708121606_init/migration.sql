-- AlterTable
ALTER TABLE "MockTest" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "passingScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "terms" TEXT;

-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "answers" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "websiteUrl" TEXT;
