const __ = (b) => {
    return b.toLowerCase() === "false" ? false : b;
  };
  const aggregate = async (req, app) => {
    if (app.request.query.col === undefined) {
        return { code: 503, type: "error", msg: "Col is required" };
    }

    let query = app.request.query.qry === undefined ? [] : app.request.query.qry;
    let order = app.request.query.order === undefined || !__(app.request.query.order) ? "{}" : app.request.query.order;
    
    try{
        order = JSON.parse(order);
    }catch(ex){
        order = {};
    }
    let limit = app.request.query.limit === undefined || !__(app.request.query.limit) ? 10 : app.request.query.limit;
    let skip = app.request.query.skip === undefined || !__(app.request.query.skip) ? 0 : app.request.query.skip;
    if(limit > 100){
        limit = 100;
    }
    try{
        query = JSON.parse(query);
    }catch(ex){
        query = {};
    }
    
    query.push({
        '$limit': parseInt(limit)
    })
    let data;
    // if(app.request.query.find !== undefined){
     if(Array.isArray(query)){
        data = await app.db.aggregate(app.request.query.col, query);
        if(data.error === undefined){
          return {code: 200, type: 'success', data: data, query: query}
        }else{
          return {code: 503, type: 'error', data: [], error: data.error, query: query}
        }
     }else{
        return {code: 503, type: 'error', data: [], error: 'Query must be a Json Array', query: query}
     }
    
  }

  export default aggregate;