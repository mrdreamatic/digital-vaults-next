const __ = (b) => {
    return b.toLowerCase() === 'false' ? false : b;
}
const _search = async (req, app) => {
    
    if(app.request.query.col === undefined){
        return {code: 503,'type':"error", "msg": "Col is required"}
    }
    let query = app.request.query.qry === undefined ? {} : app.request.query.qry;
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
    let project;
   // console.log(app.request.query.col, query);
    switch(app.request.query.col){
        case 'videos':
            project = {
                'title': 1, 
                'description': 1,
                'category': 1,
                'thumb_path': 1,
                'file_url': 1,
                '_id': 1
              }
        break;
        case 'articles':
            project = {
                'title': 1, 
                'description': 1,
                'category': 1,
                'subCategoryName': 1,
                'thumbPath': 1,
                'featuredUrl': 1,
                '_id': 1
              }
        break;
        case 'galleries':
            project = {
                'title': 1, 
                'description': 1,
                'category': 1,
                'imagePath': 1,
                'isFeatureActive': 1,
                '_id': 1
              }
        break;
        case 'audios':
            project = {
                'title': 1, 
                'description': 1,
                'category': 1,
                'file_identifier_thumb': 1,
                'file_identifier': 1,
                '_id': 1
              }
        break;
        default:
            project = {
                'title': 1, 
                'description': 1, 
                'category': 1,
                '_id': 1
              }
        break;
    }
   
    
    let aggr = [];
    if(query['$find'] === undefined){
      aggr.push({
        '$match': {
          '$and': Object.keys(query).map((x) => {
            let obj = {};
            obj[x] = query[x]
            return obj
          })
        }
      });
      aggr.push({
          '$limit': parseInt(limit)
      })
      aggr.push({
        '$skip': parseInt(skip)
      })
    }else{
      let qry = [];
      qry.push({
        '$text': {
          '$search': query['$find'],
        }
      });
      delete(query['$find']);
      Object.keys(query).forEach((x)=>{
        let obj = {};
        obj[x] = query[x]
        qry.push(obj)
      })
      aggr.push({
        '$match': {
          '$and': qry
        }
      });
      aggr.push({
          '$project': project
      });
      aggr.push({
        '$sort': {
          'score': {
            '$meta': 'textScore'
          }
        }
      });
      aggr.push({
        '$limit': parseInt(limit)
      })
      aggr.push({
        '$skip': parseInt(skip)
      })
    }
    //delete(query.find);
    
    console.log("89. ", query, aggr);
    
    let data;
   // if(app.request.query.find !== undefined){
    
    data = await app.db.aggregate(app.request.query.col, aggr);
      if(data.error === undefined){
        return {code: 200, type: 'success', data: data, query: aggr}
      }else{
        return {code: 503, type: 'error', data: [], error: data.error, query: aggr}
      }
      
   
    //}else{
     // console.log(ex);
   // }
   // console.log(project);
  //  console.log(data);
    
}
export default _search;