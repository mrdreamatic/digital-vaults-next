const findone = async (req, app) => {
  if (app.request.query.col === undefined) {
    return { code: 503, type: "error", msg: "Col is required" };
  }
  let query, data;
  
  if (app.request.query.id !== undefined) {
    query = {
      $or: [
        { _id: app.request.query.id },
        { _id: app.db.objectID(app.request.query.id) },
      ],
    };
    data = await app.db._findOne(app.request.query.col, query);
  } else {
    query = app.request.query.qry === undefined ? "{}" : app.request.query.qry;
    query = JSON.parse(query);
    Object.entries(query).forEach((x)=>{
      if(typeof(x[1]) === 'object' && Object.keys(x[1])[0] === '$date'){
        query[x[0]] = new Date(x[1]['$date']);
      }
    })
    console.log(query)
    if (query._id !== undefined) {
      query = {
        $or: [{ _id: query._id }, { _id: app.db.objectID(query._id) }],
      };
    }
    if(Object.keys(query).length > 0){
      data = await app.db._findOne(app.request.query.col, query);
    }
  }

  return { code: 200, type: "success", data: data, query: query };
};
export default findone;
