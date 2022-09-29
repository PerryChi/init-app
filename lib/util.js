
const ora = require('ora');

// 延迟函数
const sleep = (millisecond) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, millisecond);
});

// 等待的loading
const wrapLoading = async (fn, message, ...args) => {
  const spinner = ora(message);
  // 开启loading
  spinner.start();
  try {
    let repos = await fn(...args);
    // 成功
    spinner.succeed();
    return repos;
  } catch (error) {
    // console.log('23 error', error);
    await sleep(0);
    spinner.fail('request failed. refetch...');
    // 递归调用，重新获取
    return wrapLoading(fn, message, ...args);
  }
}

module.exports = {
  sleep,
  wrapLoading,
}