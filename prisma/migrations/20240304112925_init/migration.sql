-- CreateTable
CREATE TABLE "others" (
    "key" VARCHAR(20) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "others_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "rent_data" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "month" DATE NOT NULL,

    CONSTRAINT "rent_data_pkey" PRIMARY KEY ("id")
);
