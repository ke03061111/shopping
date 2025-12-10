package cn.mall.shop.module.system.framework.rpc.config;

import cn.mall.shop.module.infra.api.config.ConfigApi;
import cn.mall.shop.module.infra.api.file.FileApi;
import cn.mall.shop.module.infra.api.websocket.WebSocketSenderApi;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration(value = "systemRpcConfiguration", proxyBeanMethods = false)
@EnableFeignClients(clients = {FileApi.class, WebSocketSenderApi.class, ConfigApi.class})
public class RpcConfiguration {
}
