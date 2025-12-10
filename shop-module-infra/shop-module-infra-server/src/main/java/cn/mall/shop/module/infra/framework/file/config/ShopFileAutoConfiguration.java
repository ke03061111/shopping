package cn.mall.shop.module.infra.framework.file.config;

import cn.mall.shop.module.infra.framework.file.core.client.FileClientFactory;
import cn.mall.shop.module.infra.framework.file.core.client.FileClientFactoryImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 文件配置类
 *
 * @author admin
 */
@Configuration(proxyBeanMethods = false)
public class ShopFileAutoConfiguration {

    @Bean
    public FileClientFactory fileClientFactory() {
        return new FileClientFactoryImpl();
    }

}
