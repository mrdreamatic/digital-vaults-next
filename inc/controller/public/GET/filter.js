const __ = (b) => {
    return b.toLowerCase() === 'false' ? false : b;
}
const find = async (req, app) => {
    
    if(app.request.query.col === undefined){
        return {code: 503,'type':"error", "msg": "Col is required"}
    }
    let query = app.request.query.qry === undefined ? "{}" : app.request.query.qry;
    let order = app.request.query.order === undefined || !__(app.request.query.order) ? "{}" : app.request.query.order;
    
    try{
        order = JSON.parse(order);
    }catch(ex){
        order = {};
    }
    let limit = app.request.query.limit === undefined || !__(app.request.query.limit) ? 10 : app.request.query.limit;
    let skip = app.request.query.skip === undefined || !__(app.request.query.skip) ? 0 : app.request.query.skip;
    
    try{
        query = JSON.parse(query);
    }catch(ex){
        query = {};
    }
    query.match = app.db.filterObject(query.match);
    let data = await app.db.aggregate(app.request.query.col, [
        {$match: query.match === undefined ? {} : query.match},
        {
          $group: {
            _id: {
              group: `$${query.field !== undefined ? query.field : 'scholarship_country'}`
            },
            count: { $count: {} }
          }
        },
        {
          $match: { '_id.group': { $ne: null } }
        },
        { $sort: { count: -1 } }
    ], limit);
    console.log(data);
    return {code: 200, type: 'success', data: data, query: query}
}
export default find;