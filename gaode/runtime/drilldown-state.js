(function(global) {
    const ROOT_STATE = Object.freeze({
        type: "china",
        label: "全国",
        scope: {
            adcode: "100000",
            name: "全国",
            level: "china"
        }
    });

    function getStateKey(state) {
        if (state.type === "china") {
            return "china";
        }

        if (state.type === "region") {
            return "region:" + state.regionName;
        }

        if (state.type === "zone") {
            return "zone:" + state.regionName + ":" + state.zoneName;
        }

        return "geo:" + state.adcode;
    }

    function createRegionState(regionName) {
        return {
            type: "region",
            label: regionName + "大区",
            regionName: regionName,
            scope: {
                adcode: "region:" + regionName,
                name: regionName + "大区",
                level: "region",
                regionName: regionName
            },
            canDrillDown: true
        };
    }

    function createZoneState(regionName, zoneName, provinces) {
        return {
            type: "zone",
            label: zoneName,
            regionName: regionName,
            zoneName: zoneName,
            provinces: Array.isArray(provinces) ? provinces.slice() : [],
            scope: {
                adcode: "zone:" + regionName + ":" + zoneName,
                name: zoneName,
                level: "zone",
                regionName: regionName,
                zoneName: zoneName
            },
            canDrillDown: true
        };
    }

    function isTerminalLevel(level) {
        return level === "district" || level === "town";
    }

    function buildGeoState(feature, parentState) {
        const nextName = feature.properties.name;
        const nextLevel = feature.properties.level || "";
        const nextAdcode = String(feature.properties.adcode);

        return {
            type: "geo",
            label: nextName,
            name: nextName,
            adcode: nextAdcode,
            level: nextLevel,
            provinceName: parentState.type === "region" || parentState.type === "zone" ? nextName : parentState.provinceName,
            scope: {
                adcode: nextAdcode,
                name: nextName,
                level: nextLevel || "geo",
                parentAdcode: parentState.scope ? parentState.scope.adcode : undefined
            },
            canDrillDown: !isTerminalLevel(nextLevel),
            fallbackMode: nextLevel === "district" ? "inline-feature" : "none",
            inlineGeoJson: nextLevel === "district" ? {
                type: "FeatureCollection",
                features: [feature]
            } : null
        };
    }

    function canDrillDown(feature, state) {
        return Boolean(
            feature &&
            feature.properties &&
            feature.properties.adcode &&
            state &&
            !isTerminalLevel(state.level)
        );
    }

    global.SalesMapDrilldown = {
        ROOT_STATE: ROOT_STATE,
        getStateKey: getStateKey,
        createRegionState: createRegionState,
        createZoneState: createZoneState,
        buildGeoState: buildGeoState,
        canDrillDown: canDrillDown,
        isTerminalLevel: isTerminalLevel
    };
})(window);
