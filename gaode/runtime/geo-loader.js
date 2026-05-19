(function(global) {
    function createGeoLoader() {
        const cache = new Map();

        function fetchJson(url, cacheKey) {
            if (cache.has(cacheKey)) {
                return Promise.resolve(cache.get(cacheKey));
            }

            return fetch(url)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("Failed to load map data for " + cacheKey);
                    }
                    return response.json();
                })
                .then(function(geoJson) {
                    cache.set(cacheKey, geoJson);
                    return geoJson;
                });
        }

        function fetchChinaGeoJson() {
            return fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json", "china");
        }

        function fetchGeoJson(adcode) {
            return fetchJson("https://geo.datav.aliyun.com/areas_v3/bound/" + adcode + "_full.json", String(adcode));
        }

        return {
            cache: cache,
            fetchChinaGeoJson: fetchChinaGeoJson,
            fetchGeoJson: fetchGeoJson
        };
    }

    global.SalesMapGeoLoader = {
        createGeoLoader: createGeoLoader
    };
})(window);
