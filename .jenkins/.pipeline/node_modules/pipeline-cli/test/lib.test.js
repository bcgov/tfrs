const fs = require('fs')
module.exports = class LibTest {
  static process(filePath, args){
    var template=fs.readFileSync(filePath, {encoding:'utf-8'});
    var templateAsJson = JSON.parse(template)
    var params = Object.assign({}, args.param || {})

    templateAsJson.parameters.forEach(p => {
      if (params[p.name] !=null && p.value != null){
        params[p.name] = p.value
      }
    });

    for (var prop in params) {
      var value=params[prop]
      if (value != null){
        var regex = RegExp(`(?<!\\\\)\\$\\{${prop}\\}`,'gm');
        template = template.replace(regex, value)
      }
    }
    var items = JSON.parse(template).objects
    items.forEach((item)=>{
      if (item.kind ==='BuildConfig'){
        item.kind = 'buildconfig.build.openshift.io'
      } else if (item.kind === 'ImageStream'){
        item.kind = 'imagestream.image.openshift.io'
      }
    })
    return items
  }
}