const bookmark = async (req, app) => {
    //
    let params;
   // console.log("User", app.user);
    try{
        params = JSON.parse(app.request.body);
        console.log(params.data.mode);
        console.log(params.data.id);
        console.log(app.user.uid);
        console.log({$push: {item: params.data.id}});
        let update;
        if(params.data.mode === true){
           update = {$addToSet: {item: params.data.id}}
        }else{
            update = {$pull: {item: { $in: [ params.data.id ] }}}
        }
        let resp = await app.db.updateOne(params.col, {_id: app.user.uid}, update);
        if(params.data.mode === true){
            resp.added = params.data.id;
         }else{
            resp.removed = params.data.id;
         }
        
        return {code: 200, data: resp};
    }catch(ex){
        console.log(ex);
        return {code: 500, msg: ex.message}
    }
}
export default bookmark;