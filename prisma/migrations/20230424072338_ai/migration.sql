-- CreateTable
CREATE TABLE "Ai" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "Ai_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ai" ADD CONSTRAINT "Ai_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
