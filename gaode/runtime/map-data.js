(function(global) {
    function buildProvinceToOrg(orgConfig) {
        const provinceToOrg = {};

        Object.entries(orgConfig).forEach(function(regionEntry) {
            const regionName = regionEntry[0];
            const warZones = regionEntry[1];

            Object.entries(warZones).forEach(function(zoneEntry) {
                const zoneName = zoneEntry[0];
                const provinces = zoneEntry[1];

                provinces.forEach(function(provinceName) {
                    provinceToOrg[provinceName] = {
                        region: regionName,
                        zone: zoneName
                    };
                });
            });
        });

        return provinceToOrg;
    }

    const orgConfig = {
        "东北": {
            "战区一区": ["黑龙江省", "吉林省"],
            "战区二区": ["辽宁省"]
        },
        "华北": {
            "京津冀": ["北京市", "天津市", "河北省"],
            "晋蒙": ["山西省", "内蒙古自治区"]
        },
        "华东": {
            "上海": ["上海市"],
            "苏皖": ["江苏省", "安徽省"],
            "山东": ["山东省"]
        },
        "东南": {
            "浙江": ["浙江省"],
            "闽赣": ["福建省", "江西省"]
        },
        "华中": {
            "华中一区": ["河南省", "湖北省", "湖南省"]
        },
        "华南": {
            "华南一区": ["广东省", "广西壮族自治区", "海南省"]
        },
        "西南": {
            "川藏": ["四川省", "西藏自治区"],
            "云贵渝": ["云南省", "贵州省", "重庆市"]
        },
        "西北": {
            "西北大区": ["陕西省", "甘肃省", "宁夏回族自治区", "青海省", "新疆维吾尔自治区"]
        }
    };

    const regionColors = {
        "东北": "#E6DFFF",
        "华北": "#EDF4FF",
        "华东": "#D7F3FF",
        "东南": "#F4F1FF",
        "华中": "#E6F0FF",
        "华南": "#FFE6E6",
        "西南": "#FFF2E6",
        "西北": "#E6FFE6"
    };

    const regionLabelAnchors = {
        "东北": "吉林省",
        "华北": "河北省",
        "华东": "安徽省",
        "东南": "福建省",
        "华中": "湖北省",
        "华南": "广东省",
        "西南": "四川省",
        "西北": "甘肃省"
    };

    const zoneColors = [
        "#E8F3FF",
        "#FFE8E8",
        "#E8FFE8",
        "#FFF3E8",
        "#F3E8FF",
        "#E8FFFF",
        "#FFFBE8",
        "#F0E8FF"
    ];

    const themePresets = {
        executiveBlue: {
            id: "executiveBlue",
            label: "商务蓝",
            tokens: {
                primary: "#2563EB",
                primaryHover: "#4080FF",
                primaryActive: "#0E42D2",
                onPrimary: "#FFFFFF",
                ink: "#0F172A",
                mutedInk: "#626C7B",
                subtleInk: "#9CA3AF",
                hairline: "#E5E6EB",
                surface: "#FFFFFF",
                danger: "#F53F3F",
                pageBg: "linear-gradient(180deg, #F8FBFF 0%, #EEF4FF 100%)",
                shadowCard: "0 4px 10px rgba(0, 0, 0, 0.10)",
                panelBg: "#FFFFFF",
                panelBorder: "#E5E6EB",
                chipBg: "#FFFFFF",
                chipBorder: "#E5E6EB",
                chipText: "#0F172A",
                chipHoverBg: "#E8F3FF"
            },
            map: {
                areaColor: "#FFFFFF",
                borderColor: "#E5E6EB",
                emphasisColor: "#E8F3FF",
                emphasisBorderColor: "#2563EB",
                labelColor: "#2563EB",
                shadowColor: "rgba(0, 0, 0, 0.10)"
            },
            customerPoint: {
                color: "#F53F3F",
                shadowColor: "rgba(245,63,63,0.36)"
            },
            heatmap: {
                colors: ["#E8F3FF", "#BEDAFF", "#6AA1FF", "#2563EB"]
            }
        },
        emeraldMist: {
            id: "emeraldMist",
            label: "青雾绿",
            tokens: {
                primary: "#00B2E6",
                primaryHover: "#26C4E8",
                primaryActive: "#0086BF",
                onPrimary: "#FFFFFF",
                ink: "#0F172A",
                mutedInk: "#626C7B",
                subtleInk: "#9CA3AF",
                hairline: "#E5E6EB",
                surface: "#FFFFFF",
                danger: "#F53F3F",
                pageBg: "linear-gradient(180deg, #F7FCFF 0%, #EAF8FE 100%)",
                shadowCard: "0 4px 10px rgba(0, 0, 0, 0.10)",
                panelBg: "#FFFFFF",
                panelBorder: "#E5E6EB",
                chipBg: "#FFFFFF",
                chipBorder: "#E5E6EB",
                chipText: "#0F172A",
                chipHoverBg: "#E6F7FD"
            },
            map: {
                areaColor: "#FFFFFF",
                borderColor: "#E5E6EB",
                emphasisColor: "#E6F7FD",
                emphasisBorderColor: "#00B2E6",
                labelColor: "#0086BF",
                shadowColor: "rgba(0, 0, 0, 0.10)"
            },
            customerPoint: {
                color: "#00B42A",
                shadowColor: "rgba(0,180,42,0.32)"
            },
            heatmap: {
                colors: ["#E6F7FD", "#B8E5F8", "#26C4E8", "#0086BF"]
            }
        },
        amberField: {
            id: "amberField",
            label: "琥珀橙",
            tokens: {
                primary: "#FF7D00",
                primaryHover: "#FF9A2E",
                primaryActive: "#D25F00",
                onPrimary: "#FFFFFF",
                ink: "#0F172A",
                mutedInk: "#626C7B",
                subtleInk: "#9CA3AF",
                hairline: "#E5E6EB",
                surface: "#FFFFFF",
                danger: "#F53F3F",
                pageBg: "linear-gradient(180deg, #FFF9F2 0%, #FFF3E8 100%)",
                shadowCard: "0 4px 10px rgba(0, 0, 0, 0.10)",
                panelBg: "#FFFFFF",
                panelBorder: "#E5E6EB",
                chipBg: "#FFFFFF",
                chipBorder: "#E5E6EB",
                chipText: "#0F172A",
                chipHoverBg: "#FFF3E8"
            },
            map: {
                areaColor: "#FFFFFF",
                borderColor: "#E5E6EB",
                emphasisColor: "#FFF3E8",
                emphasisBorderColor: "#FF7D00",
                labelColor: "#D25F00",
                shadowColor: "rgba(0, 0, 0, 0.10)"
            },
            customerPoint: {
                color: "#FF7D00",
                shadowColor: "rgba(255,125,0,0.32)"
            },
            heatmap: {
                colors: ["#FFF3E8", "#FFCF8B", "#FF9A2E", "#D25F00"]
            }
        }
    };

    function createCustomerPoint(point, businessUnit, versionTag) {
        return Object.assign({
            coordinateSystem: "gcj02",
            businessUnit: businessUnit,
            versionTag: versionTag
        }, point);
    }

    const businessUnitOptions = [
        { id: "B1", label: "B1" },
        { id: "B2", label: "B2" }
    ];

    const versionTagOptions = [
        { id: "V1", label: "V1" },
        { id: "V2", label: "V2" }
    ];

    const roleProfiles = {
        cltHeadquarters: {
            id: "cltHeadquarters",
            label: "CLT-总部人员",
            scopeType: "china",
            summary: "查看全国、大区、战区全部 B1/B2 与 V1/V2 mock 数据",
            allowedBusinessUnits: ["B1", "B2"],
            allowedVersionTags: ["V1", "V2"]
        },
        eastRegionManager: {
            id: "eastRegionManager",
            label: "华东大区",
            scopeType: "region",
            regionName: "华东",
            summary: "按华东大区权限查看大区与下属战区数据",
            allowedBusinessUnits: ["B1", "B2"],
            allowedVersionTags: ["V1", "V2"]
        },
        southRegionManager: {
            id: "southRegionManager",
            label: "华南大区",
            scopeType: "region",
            regionName: "华南",
            summary: "按华南大区权限查看大区与下属战区数据",
            allowedBusinessUnits: ["B1", "B2"],
            allowedVersionTags: ["V1", "V2"]
        },
        suwanZoneManager: {
            id: "suwanZoneManager",
            label: "苏皖战区",
            scopeType: "zone",
            regionName: "华东",
            zoneName: "苏皖",
            summary: "直接进入华东大区下的苏皖战区视角",
            allowedBusinessUnits: ["B1", "B2"],
            allowedVersionTags: ["V1", "V2"]
        },
        jingjinjiZoneManager: {
            id: "jingjinjiZoneManager",
            label: "京津冀战区",
            scopeType: "zone",
            regionName: "华北",
            zoneName: "京津冀",
            summary: "直接进入华北大区下的京津冀战区视角",
            allowedBusinessUnits: ["B1", "B2"],
            allowedVersionTags: ["V1", "V2"]
        }
    };

    const retailCustomerPoints = [
        createCustomerPoint({
            id: "customer-harbin-a",
            name: "联想专卖店A",
            lng: 126.642,
            lat: 45.756,
            provinceName: "黑龙江省",
            cityName: "哈尔滨市",
            districtName: "南岗区",
            provinceAdcode: "230000",
            cityAdcode: "230100",
            districtAdcode: "230103",
            level: "A",
            status: "active",
            tags: ["REL", "核心商家"],
            metrics: {
                value: 100,
                revenue: 245,
                visitCount: 12
            },
            summary: "哈尔滨南岗区门店，近期活跃度高"
        }, "B1", "V1"),
        createCustomerPoint({
            id: "customer-changchun-b",
            name: "联想专卖店B",
            lng: 125.324,
            lat: 43.886,
            provinceName: "吉林省",
            cityName: "长春市",
            districtName: "朝阳区",
            provinceAdcode: "220000",
            cityAdcode: "220100",
            districtAdcode: "220104",
            level: "A",
            status: "active",
            tags: ["零售门店"],
            metrics: {
                value: 80,
                revenue: 180,
                visitCount: 9
            },
            summary: "长春核心零售网点，持续跟进中"
        }, "B2", "V1"),
        createCustomerPoint({
            id: "customer-fuzhou-c",
            name: "智生活体验店",
            lng: 119.306,
            lat: 26.075,
            provinceName: "福建省",
            cityName: "福州市",
            districtName: "鼓楼区",
            provinceAdcode: "350000",
            cityAdcode: "350100",
            districtAdcode: "350102",
            level: "S",
            status: "active",
            tags: ["智生活", "高潜"],
            metrics: {
                value: 120,
                revenue: 320,
                visitCount: 18
            },
            summary: "福州高潜门店，适合叠加热力与重点标签"
        }, "B1", "V2"),
        createCustomerPoint({
            id: "customer-beijing-d",
            name: "大客户C",
            lng: 116.405,
            lat: 39.904,
            provinceName: "北京市",
            cityName: "北京市",
            districtName: "朝阳区",
            provinceAdcode: "110000",
            cityAdcode: "110100",
            districtAdcode: "110105",
            level: "KA",
            status: "opportunity",
            tags: ["政府", "大客户"],
            metrics: {
                value: 150,
                revenue: 520,
                visitCount: 6
            },
            summary: "北京政企客户，项目型机会金额高"
        }, "B2", "V2"),
        createCustomerPoint({
            id: "customer-nanjing-e",
            name: "江苏教育渠道店",
            lng: 118.7969,
            lat: 32.0603,
            provinceName: "江苏省",
            cityName: "南京市",
            districtName: "鼓楼区",
            provinceAdcode: "320000",
            cityAdcode: "320100",
            districtAdcode: "320106",
            level: "A",
            status: "active",
            tags: ["教育", "零售门店"],
            metrics: {
                value: 108,
                revenue: 286,
                visitCount: 13
            },
            summary: "苏皖战区 B1/V2 门店样本"
        }, "B1", "V2"),
        createCustomerPoint({
            id: "customer-hefei-f",
            name: "安徽政企服务站",
            lng: 117.2272,
            lat: 31.8206,
            provinceName: "安徽省",
            cityName: "合肥市",
            districtName: "蜀山区",
            provinceAdcode: "340000",
            cityAdcode: "340100",
            districtAdcode: "340104",
            level: "KA",
            status: "active",
            tags: ["政企", "服务站"],
            metrics: {
                value: 132,
                revenue: 410,
                visitCount: 15
            },
            summary: "苏皖战区 B2/V1 政企样本"
        }, "B2", "V1"),
        createCustomerPoint({
            id: "customer-guangzhou-g",
            name: "华南旗舰店",
            lng: 113.2644,
            lat: 23.1291,
            provinceName: "广东省",
            cityName: "广州市",
            districtName: "天河区",
            provinceAdcode: "440000",
            cityAdcode: "440100",
            districtAdcode: "440106",
            level: "S",
            status: "active",
            tags: ["旗舰", "零售门店"],
            metrics: {
                value: 138,
                revenue: 458,
                visitCount: 17
            },
            summary: "华南大区 B1/V1 门店样本"
        }, "B1", "V1"),
        createCustomerPoint({
            id: "customer-shenzhen-h",
            name: "深圳创新渠道",
            lng: 114.0579,
            lat: 22.5431,
            provinceName: "广东省",
            cityName: "深圳市",
            districtName: "南山区",
            provinceAdcode: "440000",
            cityAdcode: "440300",
            districtAdcode: "440305",
            level: "A",
            status: "opportunity",
            tags: ["创新", "高潜"],
            metrics: {
                value: 118,
                revenue: 368,
                visitCount: 11
            },
            summary: "华南大区 B2/V2 渠道样本"
        }, "B2", "V2")
    ];

    const keyAccountCustomerPoints = [
        createCustomerPoint({
            id: "customer-shanghai-ka",
            name: "华东核心KA",
            lng: 121.4737,
            lat: 31.2304,
            provinceName: "上海市",
            cityName: "上海市",
            districtName: "浦东新区",
            provinceAdcode: "310000",
            cityAdcode: "310100",
            districtAdcode: "310115",
            level: "KA",
            status: "active",
            tags: ["政企", "亿元客户"],
            metrics: {
                value: 160,
                revenue: 880,
                visitCount: 14
            },
            summary: "上海重点战略客户，适合验证大客户分布切换"
        }, "B1", "V1"),
        createCustomerPoint({
            id: "customer-guangzhou-ka",
            name: "华南核心KA",
            lng: 113.2644,
            lat: 23.1291,
            provinceName: "广东省",
            cityName: "广州市",
            districtName: "天河区",
            provinceAdcode: "440000",
            cityAdcode: "440100",
            districtAdcode: "440106",
            level: "KA",
            status: "opportunity",
            tags: ["渠道", "重点项目"],
            metrics: {
                value: 135,
                revenue: 640,
                visitCount: 10
            },
            summary: "华南重点项目客户，用于验证切换后图层刷新"
        }, "B2", "V2"),
        createCustomerPoint({
            id: "customer-chengdu-ka",
            name: "西南核心KA",
            lng: 104.0665,
            lat: 30.5728,
            provinceName: "四川省",
            cityName: "成都市",
            districtName: "武侯区",
            provinceAdcode: "510000",
            cityAdcode: "510100",
            districtAdcode: "510107",
            level: "KA",
            status: "active",
            tags: ["制造", "高价值"],
            metrics: {
                value: 145,
                revenue: 710,
                visitCount: 11
            },
            summary: "西南制造业客户，用于验证跨区域数据源切换"
        }, "B1", "V2"),
        createCustomerPoint({
            id: "customer-beijing-ka",
            name: "京津冀战略KA",
            lng: 116.4074,
            lat: 39.9042,
            provinceName: "北京市",
            cityName: "北京市",
            districtName: "海淀区",
            provinceAdcode: "110000",
            cityAdcode: "110100",
            districtAdcode: "110108",
            level: "KA",
            status: "active",
            tags: ["政企", "战略客户"],
            metrics: {
                value: 172,
                revenue: 930,
                visitCount: 16
            },
            summary: "京津冀战区 B2/V1 KA 样本"
        }, "B2", "V1"),
        createCustomerPoint({
            id: "customer-anhui-ka",
            name: "安徽制造龙头客户",
            lng: 117.283,
            lat: 31.8612,
            provinceName: "安徽省",
            cityName: "合肥市",
            districtName: "包河区",
            provinceAdcode: "340000",
            cityAdcode: "340100",
            districtAdcode: "340111",
            level: "KA",
            status: "opportunity",
            tags: ["制造", "重点项目"],
            metrics: {
                value: 154,
                revenue: 802,
                visitCount: 12
            },
            summary: "苏皖战区 B1/V2 KA 样本"
        }, "B1", "V2")
    ];

    const customerPointSources = {
        retailSample: retailCustomerPoints,
        keyAccountFocus: keyAccountCustomerPoints
    };

    const customerSourceMeta = {
        retailSample: {
            label: "零售门店样例"
        },
        keyAccountFocus: {
            label: "核心KA样例"
        }
    };

    const regionMetrics = [
        { adcode: "230000", name: "黑龙江省", metricCode: "achievementRate", value: 76, target: 100, score: 76, riskLevel: "medium" },
        { adcode: "220000", name: "吉林省", metricCode: "achievementRate", value: 82, target: 100, score: 82, riskLevel: "low" },
        { adcode: "350000", name: "福建省", metricCode: "achievementRate", value: 91, target: 100, score: 91, riskLevel: "low" },
        { adcode: "110000", name: "北京市", metricCode: "achievementRate", value: 69, target: 100, score: 69, riskLevel: "high" }
    ];

    const overlayDescriptors = [
        {
            id: "customer-points",
            type: "customer-point",
            visible: true,
            priority: 80,
            dataKey: "customerPoints",
            legendLabel: "客户打点"
        },
        {
            id: "customer-heatmap",
            type: "heatmap",
            visible: false,
            priority: 60,
            dataKey: "heatmapPoints",
            legendLabel: "客户热力"
        },
        {
            id: "region-metrics",
            type: "region-fill",
            visible: false,
            priority: 70,
            dataKey: "regionMetrics",
            metricCode: "achievementRate",
            legendLabel: "区域达成率"
        }
    ];

    global.SalesMapData = {
        orgConfig: orgConfig,
        provinceToOrg: buildProvinceToOrg(orgConfig),
        regionColors: regionColors,
        regionLabelAnchors: regionLabelAnchors,
        zoneColors: zoneColors,
        roleProfiles: roleProfiles,
        defaultRoleId: "cltHeadquarters",
        businessUnitOptions: businessUnitOptions,
        versionTagOptions: versionTagOptions,
        customerPoints: retailCustomerPoints,
        customerPointSources: customerPointSources,
        customerSourceMeta: customerSourceMeta,
        defaultCustomerSourceId: "retailSample",
        themePresets: themePresets,
        defaultThemeId: "executiveBlue",
        regionMetrics: regionMetrics,
        overlayDescriptors: overlayDescriptors
    };
})(window);
