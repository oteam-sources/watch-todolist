import tcb from 'tcb-js-sdk';
import $config from '../../cloudbaserc';

// 初始化
const app = tcb.init({
  env: $config.envId,
});

const auth = app.auth();

let db = null;

// 匿名登录
async function login() {
  await auth.signInAnonymously();
  // 匿名登录成功检测登录状态isAnonymous字段为true
  const loginState = await auth.getLoginState();
  console.log('loginState isAnonymousAuth:', loginState.isAnonymousAuth); // true
  return app.database();
}

function getDB() {
  if (!db) {
    db = login();
  }
  return db;
}

export default getDB;
