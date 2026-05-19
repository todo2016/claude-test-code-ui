(function(global) {
    function createBoundaryService(config) {
        const geoLoader = config.geoLoader;
        const featureCache = new Map();
        const collectionCache = new Map();

        function ensureDistrictSearchPlugin() {
            if (global.AMap && global.AMap.DistrictSearch) {
                return Promise.resolve();
            }

            return new Promise(function(resolve, reject) {
                if (!global.AMap || typeof global.AMap.plugin !== "function") {
                    reject(new Error("AMap JS API is unavailable"));
                    return;
                }

                global.AMap.plugin("AMap.DistrictSearch", function() {
                    if (global.AMap && global.AMap.DistrictSearch) {
                        resolve();
                        return;
                    }

                    reject(new Error("Failed to load AMap.DistrictSearch plugin"));
                });
            });
        }

        function createDistrictSearch(options) {
            return ensureDistrictSearchPlugin().then(function() {
                return new global.AMap.DistrictSearch(options);
            });
        }

        function guessLevelFromAdcode(adcode) {
            if (!adcode || adcode === "100000") {
                return "country";
            }

            if (/0000$/.test(adcode)) {
                return "province";
            }

            if (/00$/.test(adcode)) {
                return "city";
            }

            return "district";
        }

        function getSearchLevel(level, adcode) {
            if (level === "china") {
                return "country";
            }

            if (level === "province" || level === "city" || level === "district") {
                return level;
            }

            return guessLevelFromAdcode(String(adcode || ""));
        }

        function getLngLatPair(point) {
            if (!point) {
                return null;
            }

            if (Array.isArray(point) && point.length >= 2) {
                return [Number(point[0]), Number(point[1])];
            }

            if (typeof point.getLng === "function" && typeof point.getLat === "function") {
                return [Number(point.getLng()), Number(point.getLat())];
            }

            if (typeof point.lng === "number" && typeof point.lat === "number") {
                return [Number(point.lng), Number(point.lat)];
            }

            return null;
        }

        function samePoint(left, right) {
            return Boolean(left && right && left[0] === right[0] && left[1] === right[1]);
        }

        function normalizeRing(path) {
            const ring = (path || []).map(getLngLatPair).filter(Boolean);

            if (!ring.length) {
                return null;
            }

            if (!samePoint(ring[0], ring[ring.length - 1])) {
                ring.push(ring[0].slice());
            }

            return ring.length >= 4 ? ring : null;
        }

        function boundariesToGeometry(boundaries) {
            const polygons = (boundaries || [])
                .map(normalizeRing)
                .filter(Boolean)
                .map(function(ring) {
                    return [ring];
                });

            if (!polygons.length) {
                return null;
            }

            if (polygons.length === 1) {
                return {
                    type: "Polygon",
                    coordinates: polygons[0]
                };
            }

            return {
                type: "MultiPolygon",
                coordinates: polygons
            };
        }

        function searchDistrict(keyword, options) {
            return createDistrictSearch(options).then(function(districtSearch) {
                return new Promise(function(resolve, reject) {
                    districtSearch.search(String(keyword), function(status, result) {
                        if (status === "complete" && result && Array.isArray(result.districtList) && result.districtList.length) {
                            resolve(result.districtList[0]);
                            return;
                        }

                        if (status === "no_data") {
                            reject(new Error("No district data returned for " + keyword));
                            return;
                        }

                        reject(new Error((result && result.info) || ("DistrictSearch failed for " + keyword)));
                    });
                });
            });
        }

        function buildFeatureFromDistrict(district) {
            const geometry = boundariesToGeometry(district && district.boundaries);
            const center = getLngLatPair(district && district.center);

            if (!geometry) {
                return null;
            }

            return {
                type: "Feature",
                properties: {
                    name: district.name || "",
                    adcode: String(district.adcode || ""),
                    citycode: district.citycode || "",
                    level: district.level || guessLevelFromAdcode(String(district.adcode || "")),
                    center: center,
                    centroid: center
                },
                geometry: geometry
            };
        }

        function fetchDistrictFeature(keyword, levelHint) {
            const cacheKey = ["feature", String(keyword), levelHint || ""].join(":");

            if (featureCache.has(cacheKey)) {
                return Promise.resolve(featureCache.get(cacheKey));
            }

            return searchDistrict(keyword, {
                level: getSearchLevel(levelHint, keyword),
                subdistrict: 0,
                extensions: "all",
                showbiz: false
            }).then(function(district) {
                const feature = buildFeatureFromDistrict(district);
                if (!feature) {
                    throw new Error("DistrictSearch returned no boundaries for " + keyword);
                }

                featureCache.set(cacheKey, feature);
                return feature;
            });
        }

        function extractChildren(district) {
            return Array.isArray(district && district.districtList) ? district.districtList.slice() : [];
        }

        function fetchChinaGeoJson() {
            const cacheKey = "collection:china";

            if (collectionCache.has(cacheKey)) {
                return Promise.resolve(collectionCache.get(cacheKey));
            }

            return searchDistrict("中国", {
                level: "country",
                subdistrict: 1,
                extensions: "base",
                showbiz: false
            })
                .then(function(country) {
                    return Promise.all(extractChildren(country).map(function(child) {
                        return fetchDistrictFeature(child.adcode || child.name, child.level || "province");
                    }));
                })
                .then(function(features) {
                    const geoJson = buildFeatureCollection(features.filter(Boolean));
                    collectionCache.set(cacheKey, geoJson);
                    return geoJson;
                })
                .catch(function(error) {
                    console.warn("DistrictSearch china boundary fallback to geo-loader", error);
                    return geoLoader.fetchChinaGeoJson();
                });
        }

        function fetchGeoJson(scope) {
            if (!scope || typeof scope !== "object") {
                return geoLoader.fetchGeoJson(scope);
            }

            const cacheKey = ["collection", String(scope.adcode || ""), scope.level || ""].join(":");

            if (collectionCache.has(cacheKey)) {
                return Promise.resolve(collectionCache.get(cacheKey));
            }

            return searchDistrict(scope.adcode, {
                level: getSearchLevel(scope.level, scope.adcode),
                subdistrict: 1,
                extensions: "base",
                showbiz: false
            })
                .then(function(district) {
                    const children = extractChildren(district);

                    if (!children.length) {
                        throw new Error("DistrictSearch returned no child districts for " + scope.adcode);
                    }

                    return Promise.all(children.map(function(child) {
                        return fetchDistrictFeature(child.adcode || child.name, child.level || guessLevelFromAdcode(String(child.adcode || "")));
                    }));
                })
                .then(function(features) {
                    const geoJson = buildFeatureCollection(features.filter(Boolean));
                    collectionCache.set(cacheKey, geoJson);
                    return geoJson;
                })
                .catch(function(error) {
                    console.warn("DistrictSearch boundary fallback to geo-loader for " + scope.adcode, error);
                    return geoLoader.fetchGeoJson(scope.adcode);
                });
        }

        function buildFeatureCollection(features) {
            return {
                type: "FeatureCollection",
                features: Array.isArray(features) ? features.slice() : []
            };
        }

        function coordinateToPair(point) {
            return [Number(point[0]), Number(point[1])];
        }

        function ringToPath(ring) {
            return ring.map(coordinateToPair);
        }

        function geometryToPaths(geometry) {
            if (!geometry) {
                return [];
            }

            if (geometry.type === "Polygon") {
                return [geometry.coordinates.map(ringToPath)];
            }

            if (geometry.type === "MultiPolygon") {
                return geometry.coordinates.map(function(polygon) {
                    return polygon.map(ringToPath);
                });
            }

            return [];
        }

        function featureToPaths(feature) {
            return geometryToPaths(feature && feature.geometry);
        }

        function getFeatureCenter(feature) {
            const properties = feature && feature.properties ? feature.properties : {};
            const center = properties.centroid || properties.center;

            if (Array.isArray(center) && center.length >= 2) {
                return [Number(center[0]), Number(center[1])];
            }

            const paths = featureToPaths(feature);
            let minLng = Infinity;
            let minLat = Infinity;
            let maxLng = -Infinity;
            let maxLat = -Infinity;

            paths.forEach(function(polygon) {
                polygon.forEach(function(ring) {
                    ring.forEach(function(point) {
                        minLng = Math.min(minLng, point[0]);
                        maxLng = Math.max(maxLng, point[0]);
                        minLat = Math.min(minLat, point[1]);
                        maxLat = Math.max(maxLat, point[1]);
                    });
                });
            });

            if (minLng === Infinity) {
                return [104.195397, 35.86166];
            }

            return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
        }

        return {
            fetchChinaGeoJson: fetchChinaGeoJson,
            fetchGeoJson: fetchGeoJson,
            buildFeatureCollection: buildFeatureCollection,
            featureToPaths: featureToPaths,
            getFeatureCenter: getFeatureCenter
        };
    }

    global.SalesMapBoundaryService = {
        createBoundaryService: createBoundaryService
    };
})(window);