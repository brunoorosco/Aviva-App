-- CreateTable
CREATE TABLE `cem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `street` VARCHAR(50) NULL,
    `number` VARCHAR(10) NULL,
    `city` VARCHAR(20) NULL,
    `state` VARCHAR(15) NULL,
    `cep` VARCHAR(8) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usercem` (
    `user_id` VARCHAR(191) NOT NULL,
    `cem_id` VARCHAR(191) NOT NULL,
    `inserted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `cem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usercem` ADD CONSTRAINT `usercem_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usercem` ADD CONSTRAINT `usercem_cem_id_fkey` FOREIGN KEY (`cem_id`) REFERENCES `cem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
