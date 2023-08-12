
const findone = async (req, app) => {
    //console.log(app.request.query);
    if(app.request.query.col === undefined){
        return {code: 503,'type':"error", "msg": "Col is required"}
    }
    let query = app.request.query.qry === undefined ? "{}" : app.request.query.qry;
    query = JSON.parse(query);
    let data = await app.db.findOne(app.request.query.col, query);
    console.log(data);
    return {code: 200, type: 'success', data: data}
}
export default findone;