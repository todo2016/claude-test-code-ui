应用：fde-demo	1b46d382a5b15124578e32630b80568e

文档地址：https://lbs.amap.com/api/webservice/summary

当前实现入口：./index.html

当前实现状态：
- 已在 `gaode/index.html` 下启动高德地图引擎版原型。
- 已接入 v2 的 `map-data`、`map-store`、`drilldown-state`，复用角色视角、业务维度、主题和 overlay 开关。
- 已实现全国 -> 大区 -> 战区 -> 省/市/县下钻、面包屑回退、客户点打点、热力图切换、重置全国。
- 当前边界层仍走 GeoJSON 适配器，底层使用 v2 的 `geo-loader` 拉取行政区边界；后续可在 `gaode/runtime/boundary-service.js` 内切到 DistrictSearch / Web Service。

运行方式：
- 不要以正式方式使用 `file://` 直接打开，建议在 `ui` 目录启动本地静态服务器后访问 `gaode/index.html`。
- 如果后续要切到高德 DistrictSearch / Web Service，通常还需要补 `securityJsCode` 或服务端代理配置。

当前新增文件：
- `gaode/index.html`
- `gaode/runtime/boundary-service.js`
- `gaode/runtime/map-shell.js`
- `gaode/runtime/app.js`




