import $getDB from './index';

// 正确数据
const data = {
  code: 0,
  data: null,
  msg: 'success',
};

// 操作失败数据
function getFailData(msg) {
  return {
    code: -1000,
    data: null,
    msg,
  };
}

// 发生错误数据
function getErrorData(err) {
  return {
    code: -4000,
    data: null,
    msg: err.message,
  };
}

// 数据库集合获取
async function getCollection() {
  const db = await $getDB();
  return db.collection('watch-todos');
}

// 增加
async function addItem(params) {
  const addRes = Object.assign({}, data);

  try {
    const myCollection = await getCollection();
    const res = await myCollection.add(params);
    // 如果插入出错
    if (!res.id) {
      return getFailData('add fail');
    }
  } catch (e) {
    return getErrorData(e);
  }
  return addRes;
}

// 删除
async function deleteItem({ _id }) {
  const deleteRes = Object.assign({}, data);
  try {
    const myCollection = await getCollection();
    const res = await myCollection.doc(_id).remove();
    // 如果没有成功删除
    if (res.deleted === 0) {
      return getFailData('delete fail');
    }
  } catch (e) {
    return getErrorData(e);
  }
  return deleteRes;
}

// 修改
async function updateItem(params) {
  const updateRes = Object.assign({}, data);
  const { _id, checked, color, starred, text } = params;

  try {
    const myCollection = await getCollection();
    const res = await myCollection.doc(_id).update({
      checked,
      color,
      starred,
      text,
    });
    // 如果没有成功更新
    if (res.updated === 0) {
      return getFailData('update fail');
    }
  } catch (e) {
    return getErrorData(e);
  }
  return updateRes;
}

// 查询
async function getList() {
  const listRes = Object.assign({}, data);
  try {
    const myCollection = await getCollection();
    const dbData = await myCollection.get();
    listRes.data = {
      page: 1,
      limit: 10,
      total: 100,
      list: dbData.data,
    };
  } catch (e) {
    return getErrorData(e);
  }
  return listRes;
}

export default {
  addItem,
  deleteItem,
  updateItem,
  getList,
};
