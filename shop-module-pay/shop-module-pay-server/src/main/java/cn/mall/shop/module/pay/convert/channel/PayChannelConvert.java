package cn.mall.shop.module.pay.convert.channel;

import cn.mall.shop.framework.common.pojo.PageResult;
import cn.mall.shop.module.pay.controller.admin.channel.vo.PayChannelCreateReqVO;
import cn.mall.shop.module.pay.controller.admin.channel.vo.PayChannelRespVO;
import cn.mall.shop.module.pay.controller.admin.channel.vo.PayChannelUpdateReqVO;
import cn.mall.shop.module.pay.dal.dataobject.channel.PayChannelDO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PayChannelConvert {

    PayChannelConvert INSTANCE = Mappers.getMapper(PayChannelConvert.class);

    @Mapping(target = "config",ignore = true)
    PayChannelDO convert(PayChannelCreateReqVO bean);

    @Mapping(target = "config",ignore = true)
    PayChannelDO convert(PayChannelUpdateReqVO bean);

    @Mapping(target = "config",expression = "java(cn.mall.shop.framework.common.util.json.JsonUtils.toJsonString(bean.getConfig()))")
    PayChannelRespVO convert(PayChannelDO bean);

    PageResult<PayChannelRespVO> convertPage(PageResult<PayChannelDO> page);

}
