package cn.mall.shop.module.promotion.framework.rpc.config;

import cn.mall.shop.module.infra.api.websocket.WebSocketSenderApi;
import cn.mall.shop.module.member.api.user.MemberUserApi;
import cn.mall.shop.module.product.api.category.ProductCategoryApi;
import cn.mall.shop.module.product.api.sku.ProductSkuApi;
import cn.mall.shop.module.product.api.spu.ProductSpuApi;
import cn.mall.shop.module.system.api.social.SocialClientApi;
import cn.mall.shop.module.system.api.user.AdminUserApi;
import cn.mall.shop.module.trade.api.order.TradeOrderApi;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration(value = "promotionRpcConfiguration", proxyBeanMethods = false)
@EnableFeignClients(clients = {ProductSkuApi.class, ProductSpuApi.class, ProductCategoryApi.class,
        MemberUserApi.class, TradeOrderApi.class, AdminUserApi.class, SocialClientApi.class,
        WebSocketSenderApi.class})
public class RpcConfiguration {
}
