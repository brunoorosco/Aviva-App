-- CreateTable
CREATE TABLE `churchescem` (
    `churches_id` VARCHAR(191) NOT NULL,
    `cem_id` VARCHAR(191) NOT NULL,
    `inserted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `churchescem_churches_id_idx`(`churches_id`),
    INDEX `churchescem_cem_id_idx`(`cem_id`),
    UNIQUE INDEX `churchescem_cem_id_key`(`cem_id`),
    PRIMARY KEY (`churches_id`, `cem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
