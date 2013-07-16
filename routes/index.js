
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.canvas = function(req, res){
    res.render('canvas', { title: 'SimpleChat' });
};