package cn.mall.shop.module.infra.dal.mysql.db;

import cn.mall.shop.framework.mybatis.core.mapper.BaseMapperX;
import cn.mall.shop.module.infra.dal.dataobject.db.DataSourceConfigDO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 数据源配置 Mapper
 *
 * @author admin
 */
@Mapper
public interface DataSourceConfigMapper extends BaseMapperX<DataSourceConfigDO> {
}
