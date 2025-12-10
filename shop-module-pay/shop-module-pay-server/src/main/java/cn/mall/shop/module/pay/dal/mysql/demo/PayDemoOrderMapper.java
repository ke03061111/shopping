package cn.mall.shop.module.pay.dal.mysql.demo;

import cn.mall.shop.framework.common.pojo.PageParam;
import cn.mall.shop.framework.common.pojo.PageResult;
import cn.mall.shop.framework.mybatis.core.mapper.BaseMapperX;
import cn.mall.shop.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.mall.shop.module.pay.dal.dataobject.demo.PayDemoOrderDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 示例订单 Mapper
 *
 * @author admin
 */
@Mapper
public interface PayDemoOrderMapper extends BaseMapperX<PayDemoOrderDO> {

    default PageResult<PayDemoOrderDO> selectPage(PageParam reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<PayDemoOrderDO>()
                .orderByDesc(PayDemoOrderDO::getId));
    }

    default int updateByIdAndPayed(Long id, boolean wherePayed, PayDemoOrderDO updateObj) {
        return update(updateObj, new LambdaQueryWrapperX<PayDemoOrderDO>()
                .eq(PayDemoOrderDO::getId, id).eq(PayDemoOrderDO::getPayStatus, wherePayed));
    }

}
