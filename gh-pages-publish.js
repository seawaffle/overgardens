import * as ghpages from 'gh-pages';

ghpages.publish('dist', function(err) {console.log(err)});