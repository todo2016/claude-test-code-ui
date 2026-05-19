(function(global) {
    const drilldown = global.SalesMapDrilldown;

    function createMapShell(config) {
        const map = config.map;
        const breadcrumbsEl = config.breadcrumbsEl;
        const store = config.store;
        const boundaryService = config.boundaryService;
        const ROOT_STATE = drilldown.ROOT_STATE;
        const FIT_VIEW_PADDING = [84, 360, 96, 96];
        let navigationStack = [ROOT_STATE];
        let currentState = ROOT_STATE;
        let currentGeoJson = null;
        let chinaGeoJson = null;
        let renderRequestId = 0;
        let boundaryOverlays = [];
        let labelOverlays = [];
        let customerOverlays = [];
        let heatmap = null;
        const infoWindow = new global.AMap.InfoWindow({
            offset: new global.AMap.Pixel(0, -12),
            closeWhenClickMap: true
        });

        function getDataSnapshot() {
            return store.getDataSnapshot();
        }

        function normalizeProvinceName(name) {
            return String(name || "")
                .replace(/(维吾尔自治区|壮族自治区|回族自治区|特别行政区|自治区|省|市)$/u, "")
                .trim();
        }

        function buildProvinceAliasMap(data) {
            const aliasMap = {};

            Object.keys(data.provinceToOrg || {}).forEach(function(provinceName) {
                aliasMap[provinceName] = provinceName;
                aliasMap[normalizeProvinceName(provinceName)] = provinceName;
            });

            return aliasMap;
        }

        function getProvinceAliasMap(data) {
            if (!data.__provinceAliasMap) {
                data.__provinceAliasMap = buildProvinceAliasMap(data);
            }

            return data.__provinceAliasMap;
        }

        function getCanonicalProvinceName(name, data) {
            const aliasMap = getProvinceAliasMap(data);
            const rawName = String(name || "");
            return aliasMap[rawName] || aliasMap[normalizeProvinceName(rawName)] || rawName;
        }

        function getProvinceOrgInfo(name, data) {
            return data.provinceToOrg[getCanonicalProvinceName(name, data)] || null;
        }

        function provinceNamesMatch(left, right, data) {
            return getCanonicalProvinceName(left, data) === getCanonicalProvinceName(right, data);
        }

        function getFeatureByName(geoJson, name) {
            if (!geoJson || !geoJson.features) {
                return null;
            }

            return geoJson.features.find(function(feature) {
                return feature.properties && feature.properties.name === name;
            }) || null;
        }

        function removeOverlayGroup(overlays) {
            if (!overlays.length) {
                return;
            }

            map.remove(overlays);
            overlays.length = 0;
        }

        function clearBoundaryOverlays() {
            removeOverlayGroup(boundaryOverlays);
            removeOverlayGroup(labelOverlays);
        }

        function clearCustomerOverlays() {
            removeOverlayGroup(customerOverlays);
            infoWindow.close();
        }

        function hideHeatmap() {
            if (heatmap && typeof heatmap.hide === "function") {
                heatmap.hide();
            }
        }

        function ensureHeatmap(theme) {
            if (!global.AMap.HeatMap) {
                return null;
            }

            if (!heatmap) {
                heatmap = new global.AMap.HeatMap(map, {
                    radius: 30,
                    opacity: [0, 0.88],
                    gradient: buildHeatmapGradient(theme)
                });
            } else if (typeof heatmap.setOptions === "function") {
                heatmap.setOptions({
                    gradient: buildHeatmapGradient(theme)
                });
            }

            return heatmap;
        }

        function updateBreadcrumbs() {
            breadcrumbsEl.innerHTML = "";

            navigationStack.forEach(function(state, index) {
                if (index > 0) {
                    const separator = document.createElement("span");
                    separator.className = "breadcrumb-separator";
                    separator.textContent = ">";
                    breadcrumbsEl.appendChild(separator);
                }

                const isCurrent = index === navigationStack.length - 1;
                const element = document.createElement(isCurrent ? "span" : "button");
                element.className = isCurrent ? "breadcrumb-current" : "breadcrumb-button";
                element.textContent = state.label;

                if (!isCurrent) {
                    element.type = "button";
                    element.addEventListener("click", function() {
                        navigationStack = navigationStack.slice(0, index + 1);
                        updateBreadcrumbs();
                        renderByState(navigationStack[index], { push: false });
                    });
                }

                breadcrumbsEl.appendChild(element);
            });
        }

        function commitState(state, options) {
            if (!options.push) {
                return;
            }

            const lastState = navigationStack[navigationStack.length - 1];
            if (lastState && drilldown.getStateKey(lastState) === drilldown.getStateKey(state)) {
                return;
            }

            navigationStack = navigationStack.concat([state]);
            updateBreadcrumbs();
        }

        function getCustomerPointsForState(state) {
            const data = getDataSnapshot();

            if (state.type === "china") {
                return data.customerPoints;
            }

            if (state.type === "region") {
                return data.customerPoints.filter(function(customer) {
                    const orgInfo = getProvinceOrgInfo(customer.provinceName, data);
                    return orgInfo && orgInfo.region === state.regionName;
                });
            }

            if (state.type === "zone") {
                return data.customerPoints.filter(function(customer) {
                    const orgInfo = getProvinceOrgInfo(customer.provinceName, data);
                    return orgInfo && orgInfo.region === state.regionName && orgInfo.zone === state.zoneName;
                });
            }

            if (state.type === "geo") {
                if (state.level === "province") {
                    return data.customerPoints.filter(function(customer) {
                        return provinceNamesMatch(customer.provinceName, state.name, data) || customer.provinceAdcode === state.adcode;
                    });
                }

                if (state.level === "city") {
                    return data.customerPoints.filter(function(customer) {
                        return customer.cityName === state.name || customer.cityAdcode === state.adcode;
                    });
                }

                if (state.level === "district") {
                    return data.customerPoints.filter(function(customer) {
                        return customer.districtName === state.name || customer.districtAdcode === state.adcode;
                    });
                }
            }

            return data.customerPoints;
        }

        function getHeatmapPointsForState(state) {
            const data = getDataSnapshot();

            if (state.type === "china") {
                return data.heatmapPoints;
            }

            if (state.type === "region") {
                return data.heatmapPoints.filter(function(point) {
                    const orgInfo = getProvinceOrgInfo(point.provinceName, data);
                    return orgInfo && orgInfo.region === state.regionName;
                });
            }

            if (state.type === "zone") {
                return data.heatmapPoints.filter(function(point) {
                    const orgInfo = getProvinceOrgInfo(point.provinceName, data);
                    return orgInfo && orgInfo.region === state.regionName && orgInfo.zone === state.zoneName;
                });
            }

            if (state.type === "geo") {
                if (state.level === "province") {
                    return data.heatmapPoints.filter(function(point) {
                        return provinceNamesMatch(point.provinceName, state.name, data) || point.provinceAdcode === state.adcode;
                    });
                }

                if (state.level === "city") {
                    return data.heatmapPoints.filter(function(point) {
                        return point.cityName === state.name || point.cityAdcode === state.adcode;
                    });
                }

                if (state.level === "district") {
                    return data.heatmapPoints.filter(function(point) {
                        return point.districtName === state.name || point.districtAdcode === state.adcode;
                    });
                }
            }

            return data.heatmapPoints;
        }

        function buildHeatmapGradient(theme) {
            const colors = theme && theme.heatmap && theme.heatmap.colors ? theme.heatmap.colors : ["#DBEAFE", "#93C5FD", "#2563EB", "#1D4ED8"];

            return {
                0.2: colors[0],
                0.45: colors[1] || colors[0],
                0.7: colors[2] || colors[1] || colors[0],
                0.95: colors[3] || colors[2] || colors[1] || colors[0]
            };
        }

        function buildPopupHtml(customer) {
            const tags = customer.tags && customer.tags.length ? customer.tags.join(" / ") : "无标签";
            const metrics = customer.metrics || {};

            return ""
                + '<div class="customer-popup">'
                + '<div class="customer-popup-title">' + customer.name + '</div>'
                + '<div class="customer-popup-tags">' + tags + '</div>'
                + '<div>级别: ' + (customer.level || "-") + ' / 状态: ' + (customer.status || "-") + '</div>'
                + '<div>收入指数: ' + (metrics.revenue || 0) + ' / 价值: ' + (metrics.value || 0) + '</div>'
                + '<div>拜访次数: ' + (metrics.visitCount || 0) + '</div>'
                + '<div>' + (customer.summary || "") + '</div>'
                + '</div>';
        }

        function getOverlayVisibility(type) {
            const data = getDataSnapshot();
            return data.overlayDescriptors.some(function(descriptor) {
                return descriptor.type === type && descriptor.visible;
            });
        }

        function renderCustomerPoints(state) {
            clearCustomerOverlays();

            if (!getOverlayVisibility("customer-point")) {
                return;
            }

            const data = getDataSnapshot();
            const theme = data.theme || {};
            const customerTheme = theme.customerPoint || {};
            const pointColor = customerTheme.color || "#F53F3F";
            const shadowColor = customerTheme.shadowColor || "rgba(245,63,63,0.24)";
            const scatterSize = state.type === "geo" && state.level === "district" ? 12 : 10;

            customerOverlays = getCustomerPointsForState(state).map(function(customer) {
                const marker = new global.AMap.CircleMarker({
                    center: [customer.lng, customer.lat],
                    radius: scatterSize,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    fillColor: pointColor,
                    fillOpacity: 0.92,
                    bubble: true,
                    cursor: "pointer"
                });

                marker.setOptions({
                    shadowBlur: 18,
                    shadowColor: shadowColor
                });

                marker.on("click", function() {
                    infoWindow.setContent(buildPopupHtml(customer));
                    infoWindow.open(map, marker.getCenter());
                });

                return marker;
            });

            if (customerOverlays.length) {
                map.add(customerOverlays);
            }
        }

        function renderHeatmap(state) {
            hideHeatmap();

            if (!getOverlayVisibility("heatmap")) {
                return;
            }

            const data = getDataSnapshot();
            const points = getHeatmapPointsForState(state).map(function(point) {
                return {
                    lng: point.lng,
                    lat: point.lat,
                    count: point.value || 0
                };
            });

            if (!points.length) {
                return;
            }

            const heatmapLayer = ensureHeatmap(data.theme);
            if (!heatmapLayer) {
                return;
            }

            heatmapLayer.setDataSet({
                data: points,
                max: 180
            });

            if (typeof heatmapLayer.show === "function") {
                heatmapLayer.show();
            }
        }

        function refreshBusinessOverlays() {
            renderHeatmap(currentState);
            renderCustomerPoints(currentState);
        }

        function getGeoJsonBounds(geoJson) {
            let minLng = Infinity;
            let minLat = Infinity;
            let maxLng = -Infinity;
            let maxLat = -Infinity;

            if (!geoJson || !Array.isArray(geoJson.features)) {
                return null;
            }

            geoJson.features.forEach(function(feature) {
                boundaryService.featureToPaths(feature).forEach(function(polygon) {
                    polygon.forEach(function(ring) {
                        ring.forEach(function(point) {
                            minLng = Math.min(minLng, point[0]);
                            maxLng = Math.max(maxLng, point[0]);
                            minLat = Math.min(minLat, point[1]);
                            maxLat = Math.max(maxLat, point[1]);
                        });
                    });
                });
            });

            if (minLng === Infinity || minLat === Infinity || maxLng === -Infinity || maxLat === -Infinity) {
                return null;
            }

            return {
                southwest: [minLng, minLat],
                northeast: [maxLng, maxLat]
            };
        }

        function fitBoundaryView(geoJson) {
            const bounds = getGeoJsonBounds(geoJson || currentGeoJson);

            if (!bounds) {
                if (boundaryOverlays.length) {
                    map.setFitView(boundaryOverlays, false, FIT_VIEW_PADDING);
                }
                return;
            }

            if (global.AMap && typeof global.AMap.Bounds === "function" && typeof global.AMap.LngLat === "function") {
                map.setBounds(new global.AMap.Bounds(
                    new global.AMap.LngLat(bounds.southwest[0], bounds.southwest[1]),
                    new global.AMap.LngLat(bounds.northeast[0], bounds.northeast[1])
                ));
                return;
            }

            if (boundaryOverlays.length) {
                map.setFitView(boundaryOverlays, false, FIT_VIEW_PADDING);
            }
        }

        function createPolygon(path, feature, style, clickHandler) {
            const polygon = new global.AMap.Polygon({
                path: path,
                strokeColor: style.strokeColor,
                strokeWeight: style.strokeWeight,
                fillColor: style.fillColor,
                fillOpacity: style.fillOpacity,
                bubble: true,
                cursor: clickHandler ? "pointer" : "default"
            });

            polygon.on("mouseover", function() {
                polygon.setOptions({
                    fillOpacity: style.hoverFillOpacity,
                    strokeWeight: style.strokeWeight + 1,
                    strokeColor: style.hoverStrokeColor || style.strokeColor
                });
            });

            polygon.on("mouseout", function() {
                polygon.setOptions({
                    fillOpacity: style.fillOpacity,
                    strokeWeight: style.strokeWeight,
                    strokeColor: style.strokeColor
                });
            });

            if (clickHandler) {
                polygon.on("click", function() {
                    clickHandler(feature);
                });
            }

            return polygon;
        }

        function createTextLabel(label) {
            return new global.AMap.Text({
                text: label.text,
                position: label.position,
                anchor: "center",
                style: {
                    background: label.background || "rgba(255,255,255,0.82)",
                    border: label.border || "1px solid rgba(255,255,255,0.28)",
                    padding: label.padding || "2px 8px",
                    borderRadius: label.borderRadius || "999px",
                    color: label.color,
                    fontSize: label.fontSize || "12px",
                    fontWeight: label.fontWeight || "700",
                    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.12)"
                }
            });
        }

        function renderGeoJson(options) {
            const geoJson = options.geoJson;
            const clickHandler = options.onFeatureClick;
            const labels = [];
            const extraLabels = Array.isArray(options.extraLabels) ? options.extraLabels : [];

            clearBoundaryOverlays();

            geoJson.features.forEach(function(feature) {
                const style = options.getFeatureStyle(feature);
                const paths = boundaryService.featureToPaths(feature);

                paths.forEach(function(path) {
                    boundaryOverlays.push(createPolygon(path, feature, style, clickHandler));
                });

                const label = options.getFeatureLabel(feature);
                if (label) {
                    labels.push(createTextLabel(label));
                }
            });

            extraLabels.forEach(function(label) {
                if (label) {
                    labels.push(createTextLabel(label));
                }
            });

            labelOverlays = labels;

            if (boundaryOverlays.length) {
                map.add(boundaryOverlays);
            }

            if (labelOverlays.length) {
                map.add(labelOverlays);
            }

            if (options.fitView !== false) {
                fitBoundaryView(geoJson);
            }

            refreshBusinessOverlays();
        }

        function buildBaseFeatureStyle(fillColor) {
            const theme = getDataSnapshot().theme || {};
            const mapTheme = theme.map || {};

            return {
                fillColor: fillColor || mapTheme.areaColor || "#FFFFFF",
                fillOpacity: 0.1,
                hoverFillOpacity: 0.18,
                strokeColor: mapTheme.borderColor || "#9FB3D1",
                hoverStrokeColor: mapTheme.emphasisBorderColor || "#2563EB",
                strokeWeight: 1.2
            };
        }

        function buildChinaLabel(feature) {
            const data = getDataSnapshot();
            const provinceName = getCanonicalProvinceName(feature.properties.name, data);
            const orgInfo = getProvinceOrgInfo(provinceName, data);

            if (!orgInfo) {
                return null;
            }

            if (data.regionLabelAnchors[orgInfo.region] !== provinceName) {
                return null;
            }

            return {
                text: orgInfo.region + "大区",
                position: boundaryService.getFeatureCenter(feature),
                color: data.theme && data.theme.map ? data.theme.map.labelColor || "#2563EB" : "#2563EB"
            };
        }

        function buildRegionLabel(feature, regionName) {
            const data = getDataSnapshot();
            const provinceName = getCanonicalProvinceName(feature.properties.name, data);
            const zones = data.orgConfig[regionName] || {};
            let labelText = null;

            Object.keys(zones).forEach(function(zoneName) {
                const provinces = zones[zoneName];
                const centerProvince = provinces[0];
                const belongsToZone = provinces.some(function(item) {
                    return provinceNamesMatch(item, provinceName, data);
                });

                if (!belongsToZone) {
                    return;
                }

                if (provinceNamesMatch(provinceName, centerProvince, data) || provinces.length === 1) {
                    labelText = zoneName;
                }
            });

            if (!labelText) {
                return null;
            }

            return {
                text: labelText,
                position: boundaryService.getFeatureCenter(feature),
                color: data.theme && data.theme.map ? data.theme.map.labelColor || "#2563EB" : "#2563EB"
            };
        }

        function buildZoneLabel(feature) {
            const data = getDataSnapshot();
            return {
                text: feature.properties.name,
                position: boundaryService.getFeatureCenter(feature),
                color: data.theme && data.theme.map ? data.theme.map.labelColor || "#2563EB" : "#2563EB",
                background: "rgba(255,255,255,0.74)"
            };
        }

        function buildGeoLabel(feature, featureCount) {
            const data = getDataSnapshot();
            if (featureCount > 18) {
                return null;
            }

            return {
                text: feature.properties.name,
                position: boundaryService.getFeatureCenter(feature),
                color: data.theme && data.theme.map ? data.theme.map.labelColor || "#2563EB" : "#2563EB",
                background: "rgba(255,255,255,0.72)"
            };
        }

        function getFeatureSetCenter(features) {
            const centers = (features || [])
                .map(function(feature) {
                    return boundaryService.getFeatureCenter(feature);
                })
                .filter(function(center) {
                    return Array.isArray(center) && center.length >= 2;
                });

            if (!centers.length) {
                return [104.195397, 35.86166];
            }

            const total = centers.reduce(function(result, center) {
                return [result[0] + center[0], result[1] + center[1]];
            }, [0, 0]);

            return [total[0] / centers.length, total[1] / centers.length];
        }

        function findFeatureByProvinceName(features, provinceName, data) {
            return (features || []).find(function(feature) {
                return provinceNamesMatch(feature.properties && feature.properties.name, provinceName, data);
            }) || null;
        }

        function buildAggregateLabel(text, features, anchorProvinceName, data) {
            if (!features || !features.length) {
                return null;
            }

            const anchorFeature = anchorProvinceName ? findFeatureByProvinceName(features, anchorProvinceName, data) : null;

            return {
                text: text,
                position: anchorFeature ? boundaryService.getFeatureCenter(anchorFeature) : getFeatureSetCenter(features),
                color: data.theme && data.theme.map ? data.theme.map.labelColor || "#2563EB" : "#2563EB",
                background: "rgba(255,255,255,0.82)",
                fontSize: "13px",
                fontWeight: "800",
                padding: "4px 10px"
            };
        }

        function buildChinaBusinessLabels(geoJson) {
            const data = getDataSnapshot();

            return Object.keys(data.orgConfig || {}).map(function(regionName) {
                const features = (geoJson.features || []).filter(function(feature) {
                    const orgInfo = getProvinceOrgInfo(feature.properties.name, data);
                    return orgInfo && orgInfo.region === regionName;
                });

                return buildAggregateLabel(regionName + "大区", features, data.regionLabelAnchors[regionName], data);
            }).filter(Boolean);
        }

        function buildRegionBusinessLabels(geoJson, regionName) {
            const data = getDataSnapshot();
            const zones = data.orgConfig[regionName] || {};

            return Object.keys(zones).map(function(zoneName) {
                const provinces = zones[zoneName] || [];
                const features = (geoJson.features || []).filter(function(feature) {
                    return provinces.some(function(provinceName) {
                        return provinceNamesMatch(feature.properties.name, provinceName, data);
                    });
                });

                return buildAggregateLabel(zoneName, features, provinces[0], data);
            }).filter(Boolean);
        }

        function renderChinaMap(requestId) {
            if (requestId !== renderRequestId) {
                return;
            }

            const data = getDataSnapshot();
            currentState = ROOT_STATE;
            currentGeoJson = chinaGeoJson;

            renderGeoJson({
                geoJson: chinaGeoJson,
                getFeatureStyle: function(feature) {
                    const orgInfo = getProvinceOrgInfo(feature.properties.name, data);
                    return buildBaseFeatureStyle(orgInfo ? data.regionColors[orgInfo.region] : null);
                },
                getFeatureLabel: function() {
                    return null;
                },
                extraLabels: buildChinaBusinessLabels(chinaGeoJson),
                onFeatureClick: function(feature) {
                    const orgInfo = getProvinceOrgInfo(feature.properties.name, data);
                    if (orgInfo && orgInfo.region) {
                        renderByState(drilldown.createRegionState(orgInfo.region), { push: true });
                    }
                }
            });
        }

        function renderRegionMap(state, requestId) {
            if (requestId !== renderRequestId) {
                return;
            }

            const data = getDataSnapshot();
            const regionFeatures = chinaGeoJson.features.filter(function(feature) {
                const orgInfo = getProvinceOrgInfo(feature.properties.name, data);
                return orgInfo && orgInfo.region === state.regionName;
            });
            const regionGeoJson = boundaryService.buildFeatureCollection(regionFeatures);

            currentState = state;
            currentGeoJson = regionGeoJson;

            renderGeoJson({
                geoJson: regionGeoJson,
                getFeatureStyle: function(feature) {
                    const orgInfo = getProvinceOrgInfo(feature.properties.name, data) || {};
                    const zoneNames = Object.keys(data.orgConfig[state.regionName] || {});
                    const zoneIndex = zoneNames.indexOf(orgInfo.zone);
                    const fillColor = zoneIndex >= 0 ? data.zoneColors[zoneIndex % data.zoneColors.length] : null;
                    return buildBaseFeatureStyle(fillColor);
                },
                getFeatureLabel: function() {
                    return null;
                },
                extraLabels: buildRegionBusinessLabels(regionGeoJson, state.regionName),
                onFeatureClick: function(feature) {
                    const orgInfo = getProvinceOrgInfo(feature.properties.name, data);
                    if (orgInfo && orgInfo.zone) {
                        renderByState(
                            drilldown.createZoneState(
                                orgInfo.region,
                                orgInfo.zone,
                                data.orgConfig[orgInfo.region] && data.orgConfig[orgInfo.region][orgInfo.zone]
                            ),
                            { push: true }
                        );
                    }
                }
            });
        }

        function renderZoneMap(state, requestId) {
            if (requestId !== renderRequestId) {
                return;
            }

            const data = getDataSnapshot();
            const provinceSet = new Set(state.provinces || []);
            const zoneFeatures = chinaGeoJson.features.filter(function(feature) {
                const provinceName = getCanonicalProvinceName(feature.properties.name, data);
                return provinceSet.has(provinceName);
            });
            const zoneGeoJson = boundaryService.buildFeatureCollection(zoneFeatures);
            const zoneNames = Object.keys(data.orgConfig[state.regionName] || {});
            const zoneIndex = zoneNames.indexOf(state.zoneName);
            const fillColor = data.zoneColors[(zoneIndex >= 0 ? zoneIndex : 0) % data.zoneColors.length];

            currentState = state;
            currentGeoJson = zoneGeoJson;

            renderGeoJson({
                geoJson: zoneGeoJson,
                getFeatureStyle: function() {
                    return buildBaseFeatureStyle(fillColor);
                },
                getFeatureLabel: buildZoneLabel,
                onFeatureClick: function(feature) {
                    renderByState(drilldown.buildGeoState(feature, currentState), { push: true });
                }
            });
        }

        function renderGeoMap(state, requestId) {
            const geoJsonPromise = state.inlineGeoJson ? Promise.resolve(state.inlineGeoJson) : boundaryService.fetchGeoJson(state);

            geoJsonPromise
                .then(function(geoJson) {
                    if (requestId !== renderRequestId) {
                        return;
                    }

                    const featureCount = geoJson && geoJson.features ? geoJson.features.length : 0;
                    currentState = state;
                    currentGeoJson = geoJson;

                    renderGeoJson({
                        geoJson: geoJson,
                        getFeatureStyle: function() {
                            return buildBaseFeatureStyle();
                        },
                        getFeatureLabel: function(feature) {
                            if (state.level === "district") {
                                return {
                                    text: feature.properties.name,
                                    position: boundaryService.getFeatureCenter(feature),
                                    color: getDataSnapshot().theme && getDataSnapshot().theme.map ? getDataSnapshot().theme.map.labelColor || "#2563EB" : "#2563EB"
                                };
                            }

                            return buildGeoLabel(feature, featureCount);
                        },
                        onFeatureClick: function(feature) {
                            if (currentState.type === "geo" && drilldown.canDrillDown(feature, currentState)) {
                                renderByState(drilldown.buildGeoState(feature, currentState), { push: true });
                            }
                        }
                    });
                })
                .catch(function(error) {
                    console.error("Failed to load boundary details for drilldown", error);
                });
        }

        function renderByState(state, options) {
            const renderOptions = options || { push: false };
            commitState(state, renderOptions);
            if (!renderOptions.push) {
                updateBreadcrumbs();
            }
            renderRequestId += 1;

            if (state.type === "china") {
                renderChinaMap(renderRequestId);
                return;
            }

            if (state.type === "region") {
                renderRegionMap(state, renderRequestId);
                return;
            }

            if (state.type === "zone") {
                renderZoneMap(state, renderRequestId);
                return;
            }

            renderGeoMap(state, renderRequestId);
        }

        function buildRoleStateChain(roleProfile) {
            const data = getDataSnapshot();
            const chain = [ROOT_STATE];

            if (!roleProfile || roleProfile.scopeType === "china") {
                return chain;
            }

            if (roleProfile.scopeType === "region" && roleProfile.regionName) {
                chain.push(drilldown.createRegionState(roleProfile.regionName));
                return chain;
            }

            if (roleProfile.scopeType === "zone" && roleProfile.regionName && roleProfile.zoneName) {
                chain.push(drilldown.createRegionState(roleProfile.regionName));
                chain.push(drilldown.createZoneState(
                    roleProfile.regionName,
                    roleProfile.zoneName,
                    data.orgConfig[roleProfile.regionName] && data.orgConfig[roleProfile.regionName][roleProfile.zoneName]
                ));
            }

            return chain;
        }

        function applyRoleScope(roleProfile) {
            const roleChain = buildRoleStateChain(roleProfile);
            navigationStack = roleChain;
            updateBreadcrumbs();
            renderByState(roleChain[roleChain.length - 1], { push: false });
        }

        function resetToChina() {
            navigationStack = [ROOT_STATE];
            updateBreadcrumbs();
            renderByState(ROOT_STATE, { push: false });
        }

        function refresh() {
            renderByState(currentState, { push: false });
        }

        function init(initialChinaGeoJson) {
            chinaGeoJson = initialChinaGeoJson;
            navigationStack = [ROOT_STATE];
            updateBreadcrumbs();
            renderByState(ROOT_STATE, { push: false });
        }

        return {
            init: init,
            resetToChina: resetToChina,
            refresh: refresh,
            renderByState: renderByState,
            applyRoleScope: applyRoleScope,
            getCurrentState: function() {
                return currentState;
            },
            getCurrentFeatureCount: function() {
                return currentGeoJson && Array.isArray(currentGeoJson.features) ? currentGeoJson.features.length : 0;
            },
            getNavigationStack: function() {
                return navigationStack.slice();
            }
        };
    }

    global.GaodeSalesMapShell = {
        createMapShell: createMapShell
    };
})(window);