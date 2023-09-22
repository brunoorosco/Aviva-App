-- CreateTable
CREATE TABLE `churches` (
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
CREATE TABLE `address` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(50) NULL,
    `number` VARCHAR(10) NULL,
    `city` VARCHAR(20) NULL,
    `state` VARCHAR(15) NULL,
    `cep` VARCHAR(8) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `address_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `session_sessionToken_key`(`sessionToken`),
    INDEX `session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `birth` DATE NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `churchescem` (
    `churches_id` VARCHAR(191) NOT NULL,
    `cem_id` VARCHAR(191) NOT NULL,
    `inserted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `churchescem_churches_id_idx`(`churches_id`),
    INDEX `churchescem_cem_id_idx`(`cem_id`),
    UNIQUE INDEX `churchescem_cem_id_key`(`cem_id`),
    PRIMARY KEY (`churches_id`, `cem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usercem` (
    `user_id` VARCHAR(191) NOT NULL,
    `cem_id` VARCHAR(191) NOT NULL,
    `inserted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `usercem_user_id_idx`(`user_id`),
    INDEX `usercem_cem_id_idx`(`cem_id`),
    PRIMARY KEY (`user_id`, `cem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_token` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_token_token_key`(`token`),
    UNIQUE INDEX `verification_token_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
