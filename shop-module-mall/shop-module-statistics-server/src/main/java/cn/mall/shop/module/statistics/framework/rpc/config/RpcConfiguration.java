package cn.mall.shop.module.statistics.framework.rpc.config;

import cn.mall.shop.module.product.api.spu.ProductSpuApi;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration(value = "statisticsRpcConfiguration", proxyBeanMethods = false)
@EnableFeignClients(clients = {ProductSpuApi.class})
public class RpcConfiguration {
}
