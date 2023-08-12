
const profile = async (req, app) => {
    //
    let params;
    console.log("User", app.user);
    try{
        
        params = JSON.parse(app.request.body);
        params.data.country = JSON.parse(params.data.country);
        let resp = await app.db.updateOne(params.col, {_id: app.user.uid}, params.data);
        return {code: 200, data: resp};
    }catch(ex){
        console.log(ex);
        return {code: 500, msg: ex.message}
    }
    
}
export default profile;