package cn.mall.shop.framework.env.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 环境配置
 *
 * @author admin
 */
@ConfigurationProperties(prefix = "shop.env")
@Data
public class EnvProperties {

    public static final String TAG_KEY = "shop.env.tag";

    /**
     * 环境标签
     */
    private String tag;

}
