// used for delete any fields having private:true
// convert _id to id

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJson = (schema) => {
  let transform;
  if (schema.options.toJson && schema.options.toJson.transform) {
    transform = schema.options.toJson.transform;
  }
  schema.options.toJson = Object.assign(schema.options.toJson || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      if(transform){
        transform(doc,ret,options);
      }

    },
  });
};
export default toJson;
