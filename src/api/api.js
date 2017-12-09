/**
 * Created By brand On 2017/10/17
 */
const _URL="http://api.brandhuang.com:3100";

module.exports= {
  //user
  loginIn: _URL+"/login",
  changePwd: _URL+"/changePwd",
  getUserInfo: _URL + "/getUserInfo",
  changeUserInfo: _URL + "/changeUserInfo",

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
  editArticle: _URL+'/editArticle',
  getTag: _URL+'/getTag',
  getArtDetailById: _URL+'/getArtDetailById',
};
