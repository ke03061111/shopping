package cn.mall.shop.module.pay.dal.mysql.demo;

import cn.mall.shop.framework.common.pojo.PageParam;
import cn.mall.shop.framework.common.pojo.PageResult;
import cn.mall.shop.framework.mybatis.core.mapper.BaseMapperX;
import cn.mall.shop.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.mall.shop.module.pay.dal.dataobject.demo.PayDemoWithdrawDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PayDemoWithdrawMapper extends BaseMapperX<PayDemoWithdrawDO> {

    default  PageResult<PayDemoWithdrawDO> selectPage(PageParam pageParam){
        return selectPage(pageParam, new LambdaQueryWrapperX<PayDemoWithdrawDO>()
                .orderByDesc(PayDemoWithdrawDO::getId));
    }

    default int updateByIdAndStatus(Long id, Integer whereStatus, PayDemoWithdrawDO updateObj) {
        return update(updateObj, new LambdaQueryWrapperX<PayDemoWithdrawDO>()
                .eq(PayDemoWithdrawDO::getId, id)
                .eq(PayDemoWithdrawDO::getStatus, whereStatus));
    }

}