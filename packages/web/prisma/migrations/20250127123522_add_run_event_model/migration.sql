-- CreateTable
CREATE TABLE "RunEvent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relativeTimeInMs" INTEGER NOT NULL,
    "runId" INTEGER NOT NULL,

    CONSTRAINT "RunEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RunEvent" ADD CONSTRAINT "RunEvent_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
