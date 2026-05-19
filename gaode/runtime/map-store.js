(function(global) {
    function cloneOverlayDescriptors(descriptors) {
        return (descriptors || []).map(function(descriptor) {
            return Object.assign({}, descriptor);
        });
    }

    function normalizeCustomerPoint(point, provinceToOrg) {
        if (!point || typeof point.lng !== "number" || typeof point.lat !== "number") {
            return null;
        }

        const orgInfo = provinceToOrg[point.provinceName] || {};

        return {
            id: point.id || [point.name, point.lng, point.lat].join("-"),
            name: point.name || "未命名客户",
            lng: point.lng,
            lat: point.lat,
            coordinateSystem: point.coordinateSystem || "gcj02",
            provinceName: point.provinceName || "",
            cityName: point.cityName || "",
            districtName: point.districtName || "",
            provinceAdcode: point.provinceAdcode || "",
            cityAdcode: point.cityAdcode || "",
            districtAdcode: point.districtAdcode || "",
            regionName: point.regionName || orgInfo.region || "",
            zoneName: point.zoneName || orgInfo.zone || "",
            businessUnit: point.businessUnit || "",
            versionTag: point.versionTag || "",
            level: point.level || "",
            status: point.status || "unknown",
            tags: Array.isArray(point.tags) ? point.tags.slice() : [],
            metrics: Object.assign({ value: 0, revenue: 0, visitCount: 0 }, point.metrics || {}),
            summary: point.summary || ""
        };
    }

    function cloneOptionList(options) {
        return (options || []).map(function(option) {
            return Object.assign({}, option);
        });
    }

    function normalizeSelection(selectedValues, allowedValues, fallbackValues) {
        const fallback = Array.isArray(fallbackValues) && fallbackValues.length ? fallbackValues.slice() : allowedValues.slice();
        const filtered = (selectedValues || []).filter(function(value) {
            return allowedValues.indexOf(value) >= 0;
        });

        return filtered.length ? filtered : fallback;
    }

    function matchesRoleScope(point, roleProfile) {
        if (!roleProfile || roleProfile.scopeType === "china") {
            return true;
        }

        if (roleProfile.scopeType === "region") {
            return point.regionName === roleProfile.regionName;
        }

        if (roleProfile.scopeType === "zone") {
            return point.regionName === roleProfile.regionName && point.zoneName === roleProfile.zoneName;
        }

        return true;
    }

    function buildHeatmapPoints(customerPoints) {
        return customerPoints.map(function(customer) {
            return {
                id: customer.id,
                name: customer.name,
                lng: customer.lng,
                lat: customer.lat,
                value: customer.metrics && typeof customer.metrics.value === "number" ? customer.metrics.value : 0,
                provinceName: customer.provinceName,
                cityName: customer.cityName,
                districtName: customer.districtName,
                provinceAdcode: customer.provinceAdcode,
                cityAdcode: customer.cityAdcode,
                districtAdcode: customer.districtAdcode,
                regionName: customer.regionName,
                zoneName: customer.zoneName,
                businessUnit: customer.businessUnit,
                versionTag: customer.versionTag,
                sourceType: "customer-count"
            };
        });
    }

    function createMapStore(seedData) {
        const listeners = new Set();
        const customerPointSources = Object.assign({}, seedData.customerPointSources || {});
        const customerSourceMeta = Object.assign({}, seedData.customerSourceMeta || {});
        const themePresets = Object.assign({}, seedData.themePresets || {});
        const roleProfiles = Object.assign({}, seedData.roleProfiles || {});
        const businessUnitOptions = cloneOptionList(seedData.businessUnitOptions);
        const versionTagOptions = cloneOptionList(seedData.versionTagOptions);
        const provinceToOrg = Object.assign({}, seedData.provinceToOrg || {});
        const defaultBusinessUnits = businessUnitOptions.map(function(option) { return option.id; });
        const defaultVersionTags = versionTagOptions.map(function(option) { return option.id; });
        const state = {
            panelCollapsed: false,
            activeCustomerSource: seedData.defaultCustomerSourceId || Object.keys(customerPointSources)[0] || "default",
            activeThemeId: seedData.defaultThemeId || Object.keys(themePresets)[0] || "default",
            activeRoleId: seedData.defaultRoleId || Object.keys(roleProfiles)[0] || "default",
            activeBusinessUnits: defaultBusinessUnits.slice(),
            activeVersionTags: defaultVersionTags.slice(),
            customerPoints: [],
            heatmapPoints: [],
            regionMetrics: (seedData.regionMetrics || []).slice(),
            overlayDescriptors: cloneOverlayDescriptors(seedData.overlayDescriptors)
        };

        function getRoleProfile(roleId) {
            return roleProfiles[roleId] || null;
        }

        function syncDerivedDatasets() {
            const activeRole = getRoleProfile(state.activeRoleId) || {
                scopeType: "china",
                allowedBusinessUnits: defaultBusinessUnits,
                allowedVersionTags: defaultVersionTags
            };
            const allowedBusinessUnits = Array.isArray(activeRole.allowedBusinessUnits) && activeRole.allowedBusinessUnits.length
                ? activeRole.allowedBusinessUnits.slice()
                : defaultBusinessUnits.slice();
            const allowedVersionTags = Array.isArray(activeRole.allowedVersionTags) && activeRole.allowedVersionTags.length
                ? activeRole.allowedVersionTags.slice()
                : defaultVersionTags.slice();

            state.activeBusinessUnits = normalizeSelection(state.activeBusinessUnits, allowedBusinessUnits, allowedBusinessUnits);
            state.activeVersionTags = normalizeSelection(state.activeVersionTags, allowedVersionTags, allowedVersionTags);

            const sourcePoints = customerPointSources[state.activeCustomerSource] || [];
            state.customerPoints = sourcePoints
                .map(function(point) {
                    return normalizeCustomerPoint(point, provinceToOrg);
                })
                .filter(Boolean)
                .filter(function(point) {
                    return matchesRoleScope(point, activeRole)
                        && state.activeBusinessUnits.indexOf(point.businessUnit) >= 0
                        && state.activeVersionTags.indexOf(point.versionTag) >= 0;
                });
            state.heatmapPoints = buildHeatmapPoints(state.customerPoints);
        }

        function notify() {
            const summary = getState();
            listeners.forEach(function(listener) {
                listener(summary);
            });
        }

        function getState() {
            const activeRole = getRoleProfile(state.activeRoleId);
            const allowedBusinessUnits = activeRole && Array.isArray(activeRole.allowedBusinessUnits) && activeRole.allowedBusinessUnits.length
                ? activeRole.allowedBusinessUnits
                : defaultBusinessUnits;
            const allowedVersionTags = activeRole && Array.isArray(activeRole.allowedVersionTags) && activeRole.allowedVersionTags.length
                ? activeRole.allowedVersionTags
                : defaultVersionTags;

            return {
                panelCollapsed: state.panelCollapsed,
                activeCustomerSource: state.activeCustomerSource,
                activeRoleId: state.activeRoleId,
                activeRoleSummary: activeRole && activeRole.summary ? activeRole.summary : "",
                roles: Object.keys(roleProfiles).map(function(roleId) {
                    return {
                        id: roleId,
                        label: roleProfiles[roleId] && roleProfiles[roleId].label ? roleProfiles[roleId].label : roleId,
                        scopeType: roleProfiles[roleId] && roleProfiles[roleId].scopeType ? roleProfiles[roleId].scopeType : "china"
                    };
                }),
                customerSources: Object.keys(customerPointSources).map(function(sourceId) {
                    return {
                        id: sourceId,
                        label: customerSourceMeta[sourceId] && customerSourceMeta[sourceId].label ? customerSourceMeta[sourceId].label : sourceId,
                        count: (customerPointSources[sourceId] || []).length
                    };
                }),
                activeThemeId: state.activeThemeId,
                themes: Object.keys(themePresets).map(function(themeId) {
                    return {
                        id: themeId,
                        label: themePresets[themeId] && themePresets[themeId].label ? themePresets[themeId].label : themeId
                    };
                }),
                businessUnits: businessUnitOptions.map(function(option) {
                    return {
                        id: option.id,
                        label: option.label,
                        active: state.activeBusinessUnits.indexOf(option.id) >= 0,
                        disabled: allowedBusinessUnits.indexOf(option.id) < 0
                    };
                }),
                versionTags: versionTagOptions.map(function(option) {
                    return {
                        id: option.id,
                        label: option.label,
                        active: state.activeVersionTags.indexOf(option.id) >= 0,
                        disabled: allowedVersionTags.indexOf(option.id) < 0
                    };
                }),
                overlays: state.overlayDescriptors.map(function(descriptor) {
                    return {
                        id: descriptor.id,
                        type: descriptor.type,
                        label: descriptor.legendLabel || descriptor.id,
                        visible: descriptor.visible
                    };
                }),
                customerPointCount: state.customerPoints.length,
                heatmapPointCount: state.heatmapPoints.length
            };
        }

        function getDataSnapshot() {
            return Object.assign({}, seedData, {
                activeCustomerSource: state.activeCustomerSource,
                activeThemeId: state.activeThemeId,
                activeRoleId: state.activeRoleId,
                activeRoleProfile: getRoleProfile(state.activeRoleId),
                activeBusinessUnits: state.activeBusinessUnits.slice(),
                activeVersionTags: state.activeVersionTags.slice(),
                theme: themePresets[state.activeThemeId] || null,
                themePresets: themePresets,
                customerPoints: state.customerPoints.slice(),
                heatmapPoints: state.heatmapPoints.slice(),
                regionMetrics: state.regionMetrics.slice(),
                overlayDescriptors: cloneOverlayDescriptors(state.overlayDescriptors)
            });
        }

        function subscribe(listener) {
            listeners.add(listener);
            return function unsubscribe() {
                listeners.delete(listener);
            };
        }

        function setActiveCustomerSource(sourceId) {
            if (!customerPointSources[sourceId] || state.activeCustomerSource === sourceId) {
                return false;
            }

            state.activeCustomerSource = sourceId;
            syncDerivedDatasets();
            notify();
            return true;
        }

        function setActiveRole(roleId) {
            if (!roleProfiles[roleId] || state.activeRoleId === roleId) {
                return false;
            }

            state.activeRoleId = roleId;
            syncDerivedDatasets();
            notify();
            return true;
        }

        function toggleBusinessUnit(unitId) {
            const activeRole = getRoleProfile(state.activeRoleId);
            const allowedBusinessUnits = activeRole && Array.isArray(activeRole.allowedBusinessUnits) && activeRole.allowedBusinessUnits.length
                ? activeRole.allowedBusinessUnits
                : defaultBusinessUnits;

            if (allowedBusinessUnits.indexOf(unitId) < 0) {
                return false;
            }

            const isActive = state.activeBusinessUnits.indexOf(unitId) >= 0;
            if (isActive && state.activeBusinessUnits.length === 1) {
                return false;
            }

            state.activeBusinessUnits = isActive
                ? state.activeBusinessUnits.filter(function(item) { return item !== unitId; })
                : state.activeBusinessUnits.concat([unitId]);
            syncDerivedDatasets();
            notify();
            return true;
        }

        function toggleVersionTag(versionTag) {
            const activeRole = getRoleProfile(state.activeRoleId);
            const allowedVersionTags = activeRole && Array.isArray(activeRole.allowedVersionTags) && activeRole.allowedVersionTags.length
                ? activeRole.allowedVersionTags
                : defaultVersionTags;

            if (allowedVersionTags.indexOf(versionTag) < 0) {
                return false;
            }

            const isActive = state.activeVersionTags.indexOf(versionTag) >= 0;
            if (isActive && state.activeVersionTags.length === 1) {
                return false;
            }

            state.activeVersionTags = isActive
                ? state.activeVersionTags.filter(function(item) { return item !== versionTag; })
                : state.activeVersionTags.concat([versionTag]);
            syncDerivedDatasets();
            notify();
            return true;
        }

        function setPanelCollapsed(collapsed) {
            const nextValue = Boolean(collapsed);
            if (state.panelCollapsed === nextValue) {
                return false;
            }

            state.panelCollapsed = nextValue;
            notify();
            return true;
        }

        function togglePanelCollapsed() {
            return setPanelCollapsed(!state.panelCollapsed);
        }

        function setActiveTheme(themeId) {
            if (!themePresets[themeId] || state.activeThemeId === themeId) {
                return false;
            }

            state.activeThemeId = themeId;
            notify();
            return true;
        }

        function setCustomerPoints(points, options) {
            const updateOptions = options || {};
            const sourceId = updateOptions.sourceId || state.activeCustomerSource;

            customerPointSources[sourceId] = Array.isArray(points) ? points.slice() : [];
            if (updateOptions.label) {
                customerSourceMeta[sourceId] = Object.assign({}, customerSourceMeta[sourceId], {
                    label: updateOptions.label
                });
            }
            if (updateOptions.activate !== false) {
                state.activeCustomerSource = sourceId;
            }

            syncDerivedDatasets();
            notify();
            return true;
        }

        function setOverlayVisibility(descriptorId, visible) {
            let changed = false;
            state.overlayDescriptors = state.overlayDescriptors.map(function(descriptor) {
                if (descriptor.id !== descriptorId) {
                    return descriptor;
                }

                if (descriptor.visible !== visible) {
                    changed = true;
                }
                return Object.assign({}, descriptor, { visible: visible });
            });

            if (changed) {
                notify();
            }
            return changed;
        }

        function toggleOverlay(descriptorId) {
            const target = state.overlayDescriptors.find(function(descriptor) {
                return descriptor.id === descriptorId;
            });

            if (!target) {
                return false;
            }

            return setOverlayVisibility(descriptorId, !target.visible);
        }

        syncDerivedDatasets();

        return {
            getState: getState,
            getDataSnapshot: getDataSnapshot,
            subscribe: subscribe,
            setPanelCollapsed: setPanelCollapsed,
            togglePanelCollapsed: togglePanelCollapsed,
            setActiveRole: setActiveRole,
            setActiveCustomerSource: setActiveCustomerSource,
            setActiveTheme: setActiveTheme,
            toggleBusinessUnit: toggleBusinessUnit,
            toggleVersionTag: toggleVersionTag,
            setCustomerPoints: setCustomerPoints,
            setOverlayVisibility: setOverlayVisibility,
            toggleOverlay: toggleOverlay
        };
    }

    global.SalesMapStore = {
        createMapStore: createMapStore
    };
})(window);
