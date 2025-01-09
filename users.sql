# ************************************************************
# Sequel Ace SQL dump
# バージョン 20066
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# ホスト: localhost (MySQL 5.7.39)
# データベース: myapi
# 生成時間: 2024-09-28 09:58:07 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# テーブルのダンプ users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `avater` int(255) DEFAULT NULL,
  `gid` text COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` text COLLATE utf8mb4_unicode_ci,
  `nickname` int(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_firebase_uid_unique` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `firebase_uid`, `is_admin`, `avater`, `gid`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `avatar`, `token`, `nickname`, `created_at`, `updated_at`)
VALUES
	(1,NULL,0,NULL,NULL,'admin','demo1@example.com','2022-08-29 16:20:17','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','lSWsqnY5u4MvYkBt8nwSLeFqnCqcBrAajGDFrijJhUFRFymkRGcfZfY61jAs',NULL,NULL,NULL,'2022-08-29 16:20:17','2022-08-29 16:20:17'),
	(2,NULL,0,NULL,NULL,'管理画面ユーザー','demo2@example.com','2022-08-29 16:20:17','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','KjYfVk4zv2',NULL,NULL,NULL,'2022-08-29 16:20:17','2022-08-29 16:20:17'),
	(3,NULL,0,NULL,NULL,'Prof. Nicholaus Schinner','demo3@example.com','2022-08-29 16:20:18','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','3AoVgvd5Nv',NULL,NULL,NULL,'2022-08-29 16:20:18','2022-08-29 16:20:18'),
	(4,NULL,0,NULL,NULL,'test','demo4@example.com',NULL,'$2y$10$VWA3Pc4So0DWwR4dMXVZi.r1SEbbI4gxSsTu.rdaq857dtCDtpFvK',NULL,NULL,NULL,NULL,'2022-08-30 02:06:32','2022-08-30 02:06:32'),
	(5,NULL,0,NULL,NULL,'aaa','demo5@example.com',NULL,'$2y$10$QGKPU.c9ShNExxXLm6ZRBOy5A4EpzEev/J65oiacymeKzcwGNOpbS',NULL,NULL,NULL,NULL,'2022-08-30 02:11:54','2022-08-30 02:11:54'),
	(10,NULL,0,NULL,NULL,'test','demo1@example.comaaa',NULL,'$2y$10$QyGOPpcYGoTdpPKEKAvOA.XYbJoPp2JERjjIyemMB3pq6Z.xMP58y',NULL,NULL,NULL,NULL,'2022-08-30 12:22:22','2022-08-30 12:22:22'),
	(15,NULL,0,NULL,NULL,'test','demo1@example.com3',NULL,'$2y$10$a/2B7ycXCDDVNlL0HDmug..9aoSxhAPVlAOY5BAhN/.5sd7DdZht.',NULL,NULL,NULL,NULL,'2022-08-30 18:49:29','2022-08-30 18:49:29'),
	(16,NULL,0,NULL,NULL,'test2','demo1@example.com5',NULL,'$2y$10$3CR.gZ9lTQvJiELAArxnMu1vvZVNrsy3lcwoajh1Dl5WuM3835oy6',NULL,NULL,NULL,NULL,'2022-08-30 18:49:42','2022-08-30 18:49:42'),
	(17,NULL,0,NULL,NULL,'test2','demo1@example.com6',NULL,'$2y$10$20Gw7LaLjI6eLir1c2UCM.X1XIhSP5Wf1fzmquLmIPHWeL.J1FuZu',NULL,NULL,NULL,NULL,'2022-08-30 18:50:04','2022-08-30 18:50:04'),
	(18,NULL,0,NULL,NULL,'test2','demo1@example.com61',NULL,'$2y$10$cOtpnJddu.tIj0rjDrb2kOoDwxMCNir0uzCtmftkcbLkkF8hqtIEG',NULL,NULL,NULL,NULL,'2022-08-30 18:51:10','2022-08-30 18:51:10'),
	(21,NULL,0,NULL,'101530447606747331375','Takashi','tacarz@gmail.com',NULL,'$2y$10$5JA/J683.LNgZQ3JDjknL.k0NIiYt4MnNEmkaUVI48.A/Z430yE36',NULL,'https://lh3.googleusercontent.com/a/AAcHTteWe9M8eAEVuyv7ckyCc7htUe89VjhCtxwLgWt506ggk_g=s96-c','ya29.a0AfB_byAMkfwGnBVA6-j_efTGsoDTW4-DqStAuW4dpGyWzBFRVmlD2Yqt9-jwbN9fNTEM09IjA3cx2aLjhA0aOKDcUEnQsTUuXXkUMV21X5rj9xRyc7MS1zYpT9A3rnzSd3Dw4WPruDkYs05avS1FsTi0iGyCaCgYKAfkSARMSFQHsvYlsXDQzb-Em5hnmT7JsoRZRqA0163',NULL,'2023-08-12 22:16:55','2023-08-15 10:45:31'),
	(31,'kOgmSIDrWvVbzdeGsddIBOMw88C2',1,NULL,NULL,'Admin User','admin@a.com',NULL,'$2y$10$wSC3SehYYS/uRGMFxre7T.xwKxb9f.araEbrNv8Bwr7VLTrcZ77fm',NULL,NULL,NULL,NULL,'2024-09-24 17:03:04','2024-09-24 17:03:04'),
	(32,'CjMn3c4gWVT1l489NflVL5iEGo72',0,NULL,NULL,'Taka','a3@a.com',NULL,'$2y$10$jf/LcjDBB/Qaha/cCzyF8eqmUDI8eWymNgPvkfnADTmZRrcgAkYCW',NULL,NULL,NULL,NULL,'2024-09-24 18:35:05','2024-09-24 18:35:05'),
	(33,'9ar99hDzmtXj2CArjqlEypghCTD2',0,NULL,NULL,'Test','a1@a.com',NULL,'$2y$10$t5nzU.Q07CRd5.HLhBXmlOdW63y.6jumg1c6Nx8ZAn5HUgvupwTbu',NULL,NULL,NULL,NULL,'2024-09-25 05:43:47','2024-09-27 05:49:24'),
	(48,'7ouXxrCa5xWfkAxYuXgaT8DehdI2',0,NULL,NULL,'taka','adamin@a.com',NULL,'$2y$10$2lwrOxkq5xcNDMx33n5dKOVwHuT7CyuN7jPj/7u2I0lxKtFVkCh7u',NULL,NULL,NULL,NULL,'2024-09-26 13:59:21','2024-09-26 13:59:21'),
	(49,'ov9mB1Y4PlYDMSkMYWeBmdX67rd2',0,NULL,NULL,'Unnamed','a@a.com',NULL,'$2y$10$J17lFOtvVGIHh3UNP7MwkeVqmQWi69Hy547SRb9uhxsB5pUXj5Hu6',NULL,NULL,NULL,NULL,'2024-09-26 19:17:08','2024-09-26 19:17:08');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
