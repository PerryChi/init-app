const { fetchRepoList, fetchTagList } = require('./request');
const inquirer = require('inquirer');
const { wrapLoading } = require('./util');
const downloadGitRepo = require('download-git-repo');
const util = require('util');
const path = require('path');

class Creator {
  constructor(projectName, targetDir) {
    // new的时候会调用构造函数
    this.name = projectName;
    this.target = targetDir;
    // 将downloadGitRepo函数转换成一个promise的方法了
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async fetchRepo() {
    // 失败重新拉取
    let repos = await wrapLoading(fetchRepoList, 'waiting fetch template.');
    // console.log('12 repos', repos);
    if (!repos) return;
    repos = repos.map(({ name }) => name);
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project.'
    })
    console.log('22 repo', repo);
    return repo;
  }

  async fetchTag(repo) {
    let tags = await wrapLoading(fetchTagList, 'waiting fetch tag list.', repo);
    if (!tags) return;
    tags = tags.map(tag => tag.name);

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'Please choose a tag to create project.'
    })
    return tag;
  }

  async downloadUrl(repo, tag) {
    // 1.需要拼接出下载路径来
    let requestUrl = `Antbaba/${repo}/${tag ? '#' + tag : ''}`;
    const projectPath = path.resolve(process.cwd(), this.name || `${repo}@${tag}`);
    await this.downloadGitRepo(requestUrl, projectPath);
    return this.target;
  }

  async create() {
    // 从GitHub上拉去项目模板
    // 1. 先去拉取当前组织下的模板
    let repo = await this.fetchRepo();
    // 2. 再通过模板找到版本号
    const tag = await this.fetchTag(repo);
    // // 3. 下载
    await this.downloadUrl(repo, tag);
  }
}

module.exports = Creator;
