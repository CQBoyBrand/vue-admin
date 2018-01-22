/**
 * Created By brand On 2017/10/17
 */
const _URL="http://localhost:3100";

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

  //Link
  addLink: _URL+'/addLink',
  getLinkList: _URL+'/getLinkList',
  editLink: _URL+'/editLink',
  deleteLink: _URL+'/delLink',
  deleteLinks: _URL+'/delLinks',

  //article
  getArticleList: _URL+'/getArticleList',
  changeStatus: _URL+'/changeStatus',
  getArticleByTitle: _URL+'/getArticleByTitle',
  addArticle: _URL+'/addArticle',
  editArticle: _URL+'/editArticle',
  getTag: _URL+'/getTag',
  getArtDetailById: _URL+'/getArtDetailById',
};
