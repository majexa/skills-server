const Pagination = require('ngn-pagination');

module.exports = function (filter, pageN, basePath, dbModel, model, map, onResult) {

    const pagination = new Pagination({
        basePath: basePath,
        n: 10,//
        maxPages: 6
    });
    dbModel.count(filter, function (err, count) {
        let paginationData = pagination.data(pageN, count);
        console.log(filter);
        dbModel.find(filter).
        sort({ dt: -1 }).
        skip( //
            pagination.options.n * (paginationData.page - 1) //
        ).
        limit(pagination.options.n).
        exec(function (err, items) {
            let data = {};
            data.head = Object.values(model);
            let modelKeys = Object.keys(model);
            data.body = [];
            for (let item of items) {
                let dataItem = {};
                for (let key of modelKeys) {
                    dataItem[key] = item[key];
                }
                for (let from in map) {
                    if (!map.hasOwnProperty(from)) continue;
                    if (typeof map[from] == 'function') {
                        dataItem[from] = map[from](dataItem[from]);
                    } else {
                        dataItem[map[from]] = dataItem[from];
                    }
                }
                let bodyItem = {
                    id: item.id,
                    data: dataItem
                };
                data.body.push(bodyItem);
            }
            data.pagination = paginationData;
            onResult(data);
        });
    });
};
