(function(global) {
    function applyThemeTokens(theme) {
        if (!theme || !theme.tokens) {
            return;
        }

        const root = document.documentElement;
        const tokens = theme.tokens;

        root.style.setProperty("--primary", tokens.primary || "#2563EB");
        root.style.setProperty("--primary-hover", tokens.primaryHover || "#4080FF");
        root.style.setProperty("--primary-active", tokens.primaryActive || "#0E42D2");
        root.style.setProperty("--on-primary", tokens.onPrimary || "#FFFFFF");
        root.style.setProperty("--ink", tokens.ink || "#0F172A");
        root.style.setProperty("--muted-ink", tokens.mutedInk || "#626C7B");
        root.style.setProperty("--subtle-ink", tokens.subtleInk || "#9CA3AF");
        root.style.setProperty("--hairline", tokens.hairline || "#E5E6EB");
        root.style.setProperty("--surface", tokens.surface || "#FFFFFF");
        root.style.setProperty("--danger", tokens.danger || "#F53F3F");
        root.style.setProperty("--page-bg", tokens.pageBg || "linear-gradient(180deg, #F8FBFF 0%, #EEF4FF 100%)");
        root.style.setProperty("--shadow-card", tokens.shadowCard || "0 10px 24px rgba(15, 23, 42, 0.12)");
        root.style.setProperty("--panel-bg", tokens.panelBg || "rgba(255,255,255,0.92)");
        root.style.setProperty("--panel-border", tokens.panelBorder || "rgba(229,230,235,0.9)");
        root.style.setProperty("--chip-bg", tokens.chipBg || "rgba(255,255,255,0.92)");
        root.style.setProperty("--chip-border", tokens.chipBorder || "#E5E6EB");
        root.style.setProperty("--chip-text", tokens.chipText || "#0F172A");
        root.style.setProperty("--chip-hover-bg", tokens.chipHoverBg || "#E8F3FF");
    }

    function renderControlPanel(controlPanelEl, store) {
        if (!controlPanelEl) {
            return;
        }

        const state = store.getState();
        const collapseLabel = state.panelCollapsed ? "展开" : "收起";
        const roleButtons = state.roles.map(function(role) {
            const isActive = role.id === state.activeRoleId;
            return "<button class=\"control-chip" + (isActive ? " is-active" : "") + "\" data-action=\"role\" data-id=\"" + role.id + "\">" + role.label + "</button>";
        }).join("");
        const themeButtons = state.themes.map(function(theme) {
            const isActive = theme.id === state.activeThemeId;
            return "<button class=\"control-chip" + (isActive ? " is-active" : "") + "\" data-action=\"theme\" data-id=\"" + theme.id + "\">" + theme.label + "</button>";
        }).join("");
        const sourceButtons = state.customerSources.map(function(source) {
            const isActive = source.id === state.activeCustomerSource;
            return "<button class=\"control-chip" + (isActive ? " is-active" : "") + "\" data-action=\"source\" data-id=\"" + source.id + "\">" + source.label + " (" + source.count + ")</button>";
        }).join("");
        const businessUnitButtons = state.businessUnits.map(function(option) {
            return "<button class=\"control-chip" + (option.active ? " is-active" : "") + "\" data-action=\"business-unit\" data-id=\"" + option.id + "\"" + (option.disabled ? " disabled" : "") + ">" + option.label + "</button>";
        }).join("");
        const versionTagButtons = state.versionTags.map(function(option) {
            return "<button class=\"control-chip" + (option.active ? " is-active" : "") + "\" data-action=\"version-tag\" data-id=\"" + option.id + "\"" + (option.disabled ? " disabled" : "") + ">" + option.label + "</button>";
        }).join("");
        const overlayButtons = state.overlays
            .filter(function(overlay) {
                return overlay.type === "customer-point" || overlay.type === "heatmap";
            })
            .map(function(overlay) {
                return "<button class=\"control-chip" + (overlay.visible ? " is-active" : "") + "\" data-action=\"overlay\" data-id=\"" + overlay.id + "\">" + overlay.label + "</button>";
            }).join("");

        controlPanelEl.innerHTML = ""
            + "<div class=\"control-card" + (state.panelCollapsed ? " is-collapsed" : "") + "\">"
            + "<div class=\"control-header\">"
            + "<div class=\"control-header-title\">地图视角与业务图层</div>"
            + "<button class=\"control-toggle\" data-action=\"panel\" data-id=\"panel\">" + collapseLabel + "</button>"
            + "</div>"
            + (state.panelCollapsed ? "" : (
                "<div class=\"control-section\">"
                + "<div class=\"control-title\">角色视角</div>"
                + "<div class=\"control-row\">" + roleButtons + "</div>"
                + "</div>"
                + "<div class=\"control-section\">"
                + "<div class=\"control-title\">业务维度</div>"
                + "<div class=\"control-row\">" + businessUnitButtons + "</div>"
                + "</div>"
                + "<div class=\"control-section\">"
                + "<div class=\"control-title\">版本维度</div>"
                + "<div class=\"control-row\">" + versionTagButtons + "</div>"
                + "</div>"
                + "<div class=\"control-section\">"
                + "<div class=\"control-title\">样式切换</div>"
                + "<div class=\"control-row\">" + themeButtons + "</div>"
                + "</div>"
                + "<div class=\"control-section\">"
                + "<div class=\"control-title\">客户协议输入</div>"
                + "<div class=\"control-row\">" + sourceButtons + "</div>"
                + "</div>"
                + "<div class=\"control-section\">"
                + "<div class=\"control-title\">图层控制</div>"
                + "<div class=\"control-row\">" + overlayButtons + "</div>"
                + "</div>"
                + "<div class=\"control-footer\">"
                + (state.activeRoleSummary ? (state.activeRoleSummary + "<br>") : "")
                + "当前客户点: " + state.customerPointCount + "，热力源: " + state.heatmapPointCount + "<br>"
                + "当前实现使用 AMap 引擎承载交互，边界层保留可切换适配位。"
                + "</div>"
            ))
            + "</div>";
    }

    function updateFooterCopy(store, mapShell) {
        const footerCopy = document.getElementById("map-footer-copy");
        if (!footerCopy) {
            return;
        }

        const state = store.getState();
        const currentMapState = mapShell && typeof mapShell.getCurrentState === "function" ? mapShell.getCurrentState() : null;
        const featureCount = mapShell && typeof mapShell.getCurrentFeatureCount === "function" ? mapShell.getCurrentFeatureCount() : 0;
        const stateLabel = currentMapState && currentMapState.label ? currentMapState.label : "未就绪";
        const stateType = currentMapState && currentMapState.type ? currentMapState.type : "unknown";

        footerCopy.textContent = "当前切片：高德标准瓦片底图 + 路网层 + DistrictSearch 行政边界。当前角色「" + state.roles.find(function(role) { return role.id === state.activeRoleId; }).label + "」，客户点 " + state.customerPointCount + " 个，热力源 " + state.heatmapPointCount + " 个。地图状态：" + stateType + " / " + stateLabel + " / 边界数 " + featureCount + "。";
    }

    function bootstrap() {
        if (!global.AMap || !global.SalesMapData || !global.SalesMapGeoLoader || !global.GaodeSalesMapShell || !global.SalesMapStore || !global.SalesMapBoundaryService) {
            return;
        }

        const mapEl = document.getElementById("map-container");
        const breadcrumbsEl = document.getElementById("breadcrumbs");
        const controlPanelEl = document.getElementById("control-panel");
        const resetButton = document.getElementById("btn-reset");

        if (!mapEl || !breadcrumbsEl || !controlPanelEl) {
            return;
        }

        const baseTileLayer = new global.AMap.TileLayer({
            visible: true,
            zIndex: 1,
            opacity: 1
        });
        const roadNetLayer = global.AMap.TileLayer && global.AMap.TileLayer.RoadNet
            ? new global.AMap.TileLayer.RoadNet({
                visible: true,
                zIndex: 2,
                opacity: 1
            })
            : null;
        const map = new global.AMap.Map(mapEl, {
            zoom: 4.2,
            center: [104.195397, 35.86166],
            viewMode: "2D",
            showLabel: true,
            resizeEnable: true,
            features: ["bg", "road", "point", "building"],
            layers: roadNetLayer ? [baseTileLayer, roadNetLayer] : [baseTileLayer]
        });
        const geoLoader = global.SalesMapGeoLoader.createGeoLoader();
        const boundaryService = global.SalesMapBoundaryService.createBoundaryService({
            geoLoader: geoLoader
        });
        const store = global.SalesMapStore.createMapStore(global.SalesMapData);
        const mapShell = global.GaodeSalesMapShell.createMapShell({
            map: map,
            breadcrumbsEl: breadcrumbsEl,
            store: store,
            boundaryService: boundaryService
        });
        let isMapReady = false;
        let previousRoleId = store.getState().activeRoleId;

        if (global.AMap.Scale) {
            map.addControl(new global.AMap.Scale());
        }

        if (global.AMap.ToolBar) {
            map.addControl(new global.AMap.ToolBar({
                position: {
                    right: "24px",
                    top: "50%"
                }
            }));
        }

        applyThemeTokens(store.getDataSnapshot().theme);
        renderControlPanel(controlPanelEl, store);
        updateFooterCopy(store, mapShell);

        controlPanelEl.addEventListener("click", function(event) {
            const target = event.target.closest("button[data-action]");
            if (!target) {
                return;
            }

            const action = target.getAttribute("data-action");
            const targetId = target.getAttribute("data-id");

            if (action === "panel") {
                store.togglePanelCollapsed();
                return;
            }

            if (action === "theme") {
                store.setActiveTheme(targetId);
                return;
            }

            if (action === "role") {
                store.setActiveRole(targetId);
                return;
            }

            if (action === "source") {
                store.setActiveCustomerSource(targetId);
                return;
            }

            if (action === "business-unit") {
                store.toggleBusinessUnit(targetId);
                return;
            }

            if (action === "version-tag") {
                store.toggleVersionTag(targetId);
                return;
            }

            if (action === "overlay") {
                store.toggleOverlay(targetId);
            }
        });

        store.subscribe(function() {
            const state = store.getState();
            applyThemeTokens(store.getDataSnapshot().theme);
            renderControlPanel(controlPanelEl, store);

            if (isMapReady) {
                if (state.activeRoleId !== previousRoleId) {
                    previousRoleId = state.activeRoleId;
                    mapShell.applyRoleScope(store.getDataSnapshot().activeRoleProfile);
                } else {
                    mapShell.refresh();
                }
            }

            updateFooterCopy(store, mapShell);
        });

        boundaryService.fetchChinaGeoJson()
            .then(function(chinaGeoJson) {
                mapShell.init(chinaGeoJson);
                isMapReady = true;
                previousRoleId = store.getState().activeRoleId;
                mapShell.applyRoleScope(store.getDataSnapshot().activeRoleProfile);
                updateFooterCopy(store, mapShell);
            })
            .catch(function(error) {
                console.error("Failed to bootstrap Gaode map shell", error);
            });

        if (resetButton) {
            resetButton.addEventListener("click", function() {
                mapShell.resetToChina();
            });
        }

        global.addEventListener("resize", function() {
            map.resize();
        });

        global.GaodeSalesMapApp = {
            map: map,
            boundaryService: boundaryService,
            mapShell: mapShell,
            store: store,
            setCustomerPoints: function(points, options) {
                return store.setCustomerPoints(points, options);
            },
            setActiveRole: function(roleId) {
                return store.setActiveRole(roleId);
            },
            setOverlayVisibility: function(descriptorId, visible) {
                return store.setOverlayVisibility(descriptorId, visible);
            },
            setActiveCustomerSource: function(sourceId) {
                return store.setActiveCustomerSource(sourceId);
            },
            toggleBusinessUnit: function(unitId) {
                return store.toggleBusinessUnit(unitId);
            },
            toggleVersionTag: function(versionTag) {
                return store.toggleVersionTag(versionTag);
            },
            setActiveTheme: function(themeId) {
                return store.setActiveTheme(themeId);
            },
            togglePanelCollapsed: function() {
                return store.togglePanelCollapsed();
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrap);
    } else {
        bootstrap();
    }
})(window);