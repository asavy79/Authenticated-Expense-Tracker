-- CreateTable
CREATE TABLE "VerificationToekn" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToekn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToekn_token_key" ON "VerificationToekn"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToekn_email_token_key" ON "VerificationToekn"("email", "token");
