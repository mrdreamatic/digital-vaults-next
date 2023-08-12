import * as mongo from 'mongodb';

const mongodb = mongo.MongoClient;

class Database {
  constructor(config = false) {
    ////console.log('>>>>>>>>>>===========', config);

    this.response = false;
    this.config = config;

    //console.log('>>>>>>>>>>===========', this.config);
  }

  connectDB = async () => {
    if (!this.db) {
      this.db = await mongodb.connect(this.config.url);
      this.dbo = this.db.db(this.config.db);
    }
  };

  dbclose = () => {
    // this.db.close();
  };

  objectID(id) {
    try {
      return new mongo.ObjectId(id);
    } catch (ex) {
      return id;
    }
  }

  filterObject(obj) {
    let filter = {};

    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
      Object.entries(obj).filter(([k, v]) => {
        // //console.log(typeof(v), Array.isArray(v) ? 'Array' : 'Object');
        // //console.log(typeof(k), Array.isArray(k) ? 'Array' : 'Object');
        //  //console.log(k, v);
        if (
          [
            'string',
            'int',
            'float',
            'number',
            'undefined',
            'boolean',
            'bigint',
          ].includes(typeof v) ||
          v === null
        ) {
          filter[k] = v;
        } else {
          if (typeof v === 'object' && !Array.isArray(v)) {
            const ok = Object.keys(v);
            ok.forEach((x) => {
              if (x.toLowerCase() === 'objectid') {
                try {
                  //  //console.log('k >>>>',k);
                  const objbuilder = (key, val) => {
                    let _o = {};
                    _o[key] = val;
                    return _o;
                  };
                  //   //console.log('id >>>>>', v[x]);
                  filter['$or'] = [
                    objbuilder(k, mongo.ObjectId(v[x])),
                    objbuilder(k, v[x]),
                  ];
                  //  //console.log('ObjectID', filter);
                } catch (ex) {
                  //   //console.log('Invalid ObjectID');
                  filter[k] = v[x];
                }
              } else {
                filter[k] = v;
              }
            });
          } else if (typeof v === 'object' && Array.isArray(v)) {
            let arrFltr = [];
            v.forEach((ob) => {
              arrFltr.push(this.filterObject(ob));
            });
            filter[k] = arrFltr;
          } else {
            filter[k] = v;
          }
        }
      });
    }
    ////console.log('F >',filter);
    return filter;
  }

  createCollection(col) {
    mongodb.connect(dburl, function (err, db) {
      if (err) {
        return err;
      }
      var dbo = db.db(dbname);
      dbo.createCollection(this.config.prefix + col, function (err, res) {
        if (err) {
          return err;
        }
        db.close();
        return res;
      });
    });
  }

  dropCollection(col) {
    if (err) {
      return err;
    }
    var dbo = db.db(dbname);
    dbo.collection(this.config.prefix + col).drop(function (err, delOK) {
      if (err) {
        return err;
      }
      return delOK;
      db.close();
    });
  }

  async insertOne(col, obj) {
    await this.connectDB();
    col = (this.config.prefix + col).replace(
      this.config.prefix + conf.prefix,
      conf.prefix
    );
    try {
      const result = await this.dbo.collection(col).insertOne(obj);
      //db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
      //this.close();
    }
  }

  insertMany = async (col, data) => {
    if (!Array.isArray(data)) {
      return 'data must be Array';
    }
    try {
      await this.connectDB();
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .insertMany(data);
      //db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  };

  UniqueInsert = async (col, data) => {
    try {
      await this.connectDB();
      let promises = [];

      if (Array.isArray(data)) {
        data.forEach((ele) => {
          //dbo = con.db(dbname);
          Object.entries(ele).forEach((x) => {
            // //console.log(x)
            try {
              ele[x[0]] = JSON.parse(x[1]);
            } catch (ex) {}
          });

          //

          var promise = this.dbo
            .collection(this.config.prefix + col)
            .updateOne({ _id: ele._id }, { $set: ele }, { upsert: true });
          promises.push(promise);
        });
      } else {
        Object.entries(data).forEach((x) => {
          //  //console.log(x)
          try {
            data[x[0]] = JSON.parse(x[1]);
          } catch (ex) {
            //
          }
        });
        var promise = this.dbo
          .collection(this.config.prefix + col)
          .updateOne({ _id: data._id }, { $set: data }, { upsert: true });

        promises.push(promise);
      }
      return Promise.all(promises);
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  };

  async updateorinsert(col, data, query = {}) {
    await this.connectDB();
    try {
      query = Object.keys(query).length < 1 ? { _id: data._id } : query;
      query = this.filterObject(query);
      //console.log(query,data);
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .updateOne(query, { $set: data }, { upsert: true });
      //db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }
  async _updateOne(col, query, value, option = { upsert: true }) {
    await this.connectDB();
    try {
      query = this.filterObject(query);
      //console.log(query,value);
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .updateOne(query, value, option);
      //db.close();
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      //this.close();
    }
  }

  async updateOne(col, query, value, option = { upsert: true }) {
    await this.connectDB();
    try {
      console.log(query);
      //query = this.filterObject(query);

      const result = await this.dbo
        .collection(this.config.prefix + col)
        .updateOne(
          query,
          value['$set'] === undefined ? { $set: value } : value,
          option
        );
      //db.close();
      //this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async updateMany(col, query, values, option = { upsert: true }) {
    await this.connectDB();
    try {
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .updateMany(query, { $set: values });
      //db.close();
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      //this.close();
    }
  }

  async deleteOne(col, qry) {
    await this.connectDB();
    try {
      // qry = this.filterObject(qry);

      const result = await this.dbo
        .collection(this.config.prefix + col)
        .deleteOne(qry);
      console.log(this.config.prefix + col);
      // db.close();
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async deleteMany(col, query) {
    await this.connectDB();
    try {
      query = this.filterObject(query);

      const result = await this.dbo
        .collection(this.config.prefix + col)
        .deleteMany(query);
      this.dbclose();
      // db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async findOneAndUpdate(col, qry, data, options) {
    await this.connectDB();
    try {
      qry = this.filterObject(qry);
      //console.log(qry);
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .findOneAndUpdate(qry, data, options);

      //db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      //this.close();
    }
  }

  async findOne(col, qry) {
    await this.connectDB();
    try {
      qry = this.filterObject(qry);
      // //console.log('db',qry)
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .findOne(qry);
      //  //console.log(this.config.prefix + col, result);
      //db.close();
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async _findOne(col, qry) {
    await this.connectDB();
    try {
      // //console.log('db',qry)
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .findOne(qry);
      //  //console.log(this.config.prefix + col, result);
      //db.close();
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async find(
    col,
    qry,
    attr = {
      limit: 100,
      order: {},
      skip: 0,
    }
  ) {
    await this.connectDB();
    console.log(this.config ,this.config.prefix + col, qry, attr);
    try {
      const o =
        attr.order === undefined || typeof attr.order !== 'object'
          ? {}
          : attr.order;
      const s = attr.skip === undefined ? 0 : parseInt(attr.skip);
      const l = attr.limit === undefined ? 100 : parseInt(attr.limit);

      qry = this.filterObject(qry);
      let result;
      if(Object.keys(o).length > 0){
        result = await this.dbo
        .collection(this.config.prefix + col)
        .find(qry)
        .sort(o)
        .skip(s)
        .limit(l)
        .allowDiskUse(true)
        .toArray();
      }else{
        result = await this.dbo
        .collection(this.config.prefix + col)
        .find(qry)
        .sort(o)
        .skip(s)
        .limit(l)
        .toArray();
      }
      
     // this.dbclose();
      return result;
    } catch (ex) {
      console.log(ex);
      this.dbclose();
    }
  }

  async aggregate(col, qry, limit = 100) {
    await this.connectDB();
    try {
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .aggregate(qry)
        .toArray();
      //db.close();
      //
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }
  async distinct(col, qry, order, limit = 100) {
    await this.connectDB();
    try {
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .distinct(qry.field, qry.qry);
      //db.close();
      //
      this.dbclose();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }

  async sortFind(col, qry, order, limit = 100, skip = 0) {
    await this.connectDB();
    try {
      for (const [key, value] of Object.entries(order)) {
        if (typeof value === 'string' && isNaN(value)) {
          order[key] = value.startsWith('d') || value.startsWith('D') ? -1 : 1;
        }
      }

      qry = this.filterObject(qry);
      //console.log('Filter: ', qry);
      const result = await this.dbo
        .collection(this.config.prefix + col)
        .find(qry)
        .allowDiskUse(true)
        .sort(order)
        .skip(skip)
        .limit(limit)
        .toArray();
      // db.close();
      return result;
    } catch (ex) {
      //console.log(ex);
      this.dbclose();
    }
  }
}

export default Database;
//module.exports = Database;
