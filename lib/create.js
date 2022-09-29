const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Creator = require('./Creator');

module.exports = async function (projectName, options) {
  // 创建项目
  // 获取当前命令执行时的工作目录
  const cwd = process.cwd();
  // 目标目录
  const targetDir = path.join(cwd, projectName);
  if (fs.existsSync(targetDir)) {
    // 如果是强制安装
    if (options.force) {
      // 删除同名的已有项目
      await fs.remove(targetDir);
    } else {
      // 提示用户是否确定要覆盖
      // console.log('21 inquirer', inquirer);
      // 配置询问的方式
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target already exists, Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false },
          ]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log('\r\nRemoving...');
        await fs.remove(targetDir);
      }
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir);
  // 开始创建项目
  creator.create();

  console.log()
}