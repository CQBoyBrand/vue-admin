/**
 * Created By brand On 2017/10/17
 */
const _URL="http://localhost:3100";

module.exports= {
  //user
  loginIn: _URL+"/login",

  //tag
  addTag: _URL+'/addTag',
  getTagList: _URL+'/getTagList',
  editTag: _URL+'/editTag',
  deleteTag: _URL+'/delTag',
  deleteTags: _URL+'/delTags',

  //article
  getArticleList: _URL+'/getArticleList',
  changeStatus: _URL+'/changeStatus',
  getArticleByTitle: _URL+'/getArticleByTitle',
  addArticle: _URL+'/addArticle',
  getTag: _URL+'/getTag',
};
