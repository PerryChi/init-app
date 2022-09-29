// 通过axios来获取结果
const axios = require('axios');

axios.interceptors.response.use(res => {
  return res.data;
});

async function fetchRepoList() {
  // 可以通过配置文件 拉取不同的仓库对应的用户下的文件
  return axios.get('https://api.github.com/orgs/antbaba/repos');
}

async function fetchTagList (repo) {
  console.log('15 qiyapeng: ', repo);
  return axios.get(`https://api.github.com/repos/antbaba/${repo}/tags`);
  // return axios.get(`https://api.github.com/repos/Antbaba/proto-app/tags`);
}

module.exports = {
  fetchRepoList,
  fetchTagList,
};
