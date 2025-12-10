package cn.mall.shop.module.trade.framework.rpc.config;

import cn.mall.shop.module.member.api.address.MemberAddressApi;
import cn.mall.shop.module.member.api.config.MemberConfigApi;
import cn.mall.shop.module.member.api.level.MemberLevelApi;
import cn.mall.shop.module.member.api.point.MemberPointApi;
import cn.mall.shop.module.member.api.user.MemberUserApi;
import cn.mall.shop.module.pay.api.order.PayOrderApi;
import cn.mall.shop.module.pay.api.refund.PayRefundApi;
import cn.mall.shop.module.pay.api.transfer.PayTransferApi;
import cn.mall.shop.module.pay.api.wallet.PayWalletApi;
import cn.mall.shop.module.product.api.category.ProductCategoryApi;
import cn.mall.shop.module.product.api.comment.ProductCommentApi;
import cn.mall.shop.module.product.api.sku.ProductSkuApi;
import cn.mall.shop.module.product.api.spu.ProductSpuApi;
import cn.mall.shop.module.promotion.api.bargain.BargainActivityApi;
import cn.mall.shop.module.promotion.api.bargain.BargainRecordApi;
import cn.mall.shop.module.promotion.api.combination.CombinationRecordApi;
import cn.mall.shop.module.promotion.api.coupon.CouponApi;
import cn.mall.shop.module.promotion.api.discount.DiscountActivityApi;
import cn.mall.shop.module.promotion.api.point.PointActivityApi;
import cn.mall.shop.module.promotion.api.reward.RewardActivityApi;
import cn.mall.shop.module.promotion.api.seckill.SeckillActivityApi;
import cn.mall.shop.module.system.api.notify.NotifyMessageSendApi;
import cn.mall.shop.module.system.api.social.SocialClientApi;
import cn.mall.shop.module.system.api.social.SocialUserApi;
import cn.mall.shop.module.system.api.user.AdminUserApi;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration(value = "tradeRpcConfiguration", proxyBeanMethods = false)
@EnableFeignClients(clients = {
        BargainActivityApi.class, BargainRecordApi.class, CombinationRecordApi.class,
        CouponApi.class, DiscountActivityApi.class, RewardActivityApi.class, SeckillActivityApi.class, PointActivityApi.class,
        MemberUserApi.class, MemberPointApi.class, MemberLevelApi.class, MemberAddressApi.class, MemberConfigApi.class,
        ProductSpuApi.class, ProductSkuApi.class, ProductCommentApi.class, ProductCategoryApi.class,
        PayOrderApi.class, PayRefundApi.class, PayTransferApi.class, PayWalletApi.class,
        AdminUserApi.class, NotifyMessageSendApi.class, SocialClientApi.class, SocialUserApi.class
})
public class RpcConfiguration {
}
