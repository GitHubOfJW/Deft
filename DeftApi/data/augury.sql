use augury;
SET NAMES UTF8;

## 创建基础卦象
DROP TABLE IF EXISTS `tbl_base_trigrams`;
CREATE TABLE `tbl_base_trigrams`(
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT COMMENT '卦象编号',
  `nickname` VARCHAR(10) NOT NULL COMMENT '卦象名称',
  `name` VARCHAR(10) NOT NULL COMMENT '卦象对应名称',
  `num` TINYINT NOT NULL DEFAULT 0 COMMENT '基卦编号',
  `trigram` char(3) NOT NULL DEFAULT 0 COMMENT '卦象'
) ENGINE=MYISAM DEFAULT CHARSET=UTF8;


## 创建卦相象
DROP TABLE IF EXISTS `tbl_trigrams`;
CREATE TABLE `tbl_trigrams`(
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT COMMENT '卦象编号',
  `name` VARCHAR(10) NOT NULL COMMENT '卦象名称',
  `top` TINYINT NOT NULL COMMENT '上卦象编号',
  `bottom` TINYINT NOT NULL COMMENT '下卦象编号',
  `num` TINYINT NOT NULL DEFAULT 0 COMMENT '卦象编号',
  unique key (`top`,`bottom`)
) ENGINE=MYISAM DEFAULT CHARSET=UTF8;
