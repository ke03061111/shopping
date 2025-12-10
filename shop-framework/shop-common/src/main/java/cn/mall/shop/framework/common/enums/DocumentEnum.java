package cn.mall.shop.framework.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 文档地址
 *
 * @author admin
 */
@Getter
@AllArgsConstructor
public enum DocumentEnum {

    REDIS_INSTALL("xxx", "Redis 安装文档"),
    TENANT("xxx", "SaaS 多租户文档");

    private final String url;
    private final String memo;

}
