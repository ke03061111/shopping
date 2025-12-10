package cn.mall.shop.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 项目的启动类
 *
 *
 * @author admin
 */
@SuppressWarnings("SpringComponentScan") // 忽略 IDEA 无法识别 ${shop.info.base-package}
@SpringBootApplication(scanBasePackages = {"${shop.info.base-package}.server", "${shop.info.base-package}.module"},
        excludeName = {
            // RPC 相关
//            "org.springframework.cloud.openfeign.FeignAutoConfiguration",
//            "cn.mall.shop.module.system.framework.rpc.config.RpcConfiguration"
        })
public class ShopServerApplication {

    public static void main(String[] args) {

        SpringApplication.run(ShopServerApplication.class, args);
    }

}
