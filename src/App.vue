<template>
  <div>
    <tab-bar @filter="onFilter" :colors="colors"></tab-bar>
    <div v-if="!todoList" class="loading">加载中...</div>
    <ul v-else-if="todoList.length > 0">
      <item
        v-for="item in todoList.filter((x) =>
          filter === 'all'
            ? x
            : filter === 'starred'
            ? x.starred
            : filter === x.color
        )"
        :key="item._id"
        :data="item"
        :owner="item._openid === userId"
        :colors="colors"
        :filter="filter"
        @check="onUpdate(item._id, 'checked')"
        @color-change="onUpdate(item._id, 'color')"
        @star-change="onUpdate(item._id, 'starred')"
        @new-color="onNewColor"
        @remove="onRemove(item._id)"
      ></item>
    </ul>
    <add-form @add-item="addItem"></add-form>
    <!-- 简版toast -->
    <div class="toast" v-show="errMsg">
      <p>{{ errMsg }}</p>
    </div>
  </div>
</template>

<script>
import tabBar from './components/TabBar';
import addForm from './components/AddForm';
import item from './components/Item';
import { getDB, userId } from './tcb';
import $service from './tcb/service';

export default {
  name: 'app',
  components: {
    tabBar,
    addForm,
    item,
  },
  computed: {
    userId() {
      return userId;
    },
  },
  data() {
    return {
      colors: ['all', 'ice', 'tang', 'jewel', 'rose'],
      todoList: null,
      filter: 'all',
      recentColor: 'ice',
      watcher: null,
      errMsg: '',
    };
  },
  methods: {
    // 统一错误处理
    showToast(msg) {
      this.errMsg = msg;
      setTimeout(() => {
        this.errMsg = '';
      }, 2000);
    },
    // 增加
    async addItem(text) {
      const newItem = {
        text: text,
        color: this.recentColor,
        checked: false,
        starred: false,
      };
      const res = await $service.addItem(newItem);
      if (!res || res.code !== 0) {
        this.showToast(res.msg);
      }
    },
    // 删除
    async onRemove(_id) {
      const res = await $service.deleteItem({ _id });
      if (!res || res.code !== 0) {
        this.showToast(res.msg);
      }
    },
    // 更新
    async updateItem(updatedItem) {
      const res = await $service.updateItem(updatedItem);
      if (!res || res.code !== 0) {
        this.showToast(res.msg);
      }
    },
    // 拉取数据列表
    async getList() {
      const res = await $service.getList();
      if (res && res.code === 0) {
        this.todoList = [...res.data.list];
      } else {
        this.showToast(res.msg);
      }
    },
    onUpdate(_id, type) {
      let el = this.todoList.find((x) => x._id === _id);
      const newItem = { ...el };
      if (type === 'color') {
        newItem.color = this.recentColor;
      } else {
        newItem[type] = !newItem[type];
      }
      this.updateItem(newItem);
    },
    onFilter(filter) {
      this.filter = filter;
      if (filter !== 'all' && filter !== 'starred') {
        this.recentColor = filter;
      }
    },
    onNewColor(color) {
      this.recentColor = color;
    },
    // 注册数据库变动的实时监听
    async registerTcbWatcher() {
      const getList = this.getList;
      const db = await getDB();
      this.watcher = db
        .collection('watch-todos')
        .where({
          // query...
        })
        .watch({
          onChange(snapshot) {
            console.log('snapshot', snapshot);
            getList();
          },
          onError(err) {
            console.error('the watch closed because of error', err);
          },
        });
    },
  },
  created() {
    this.registerTcbWatcher();
  },
  destroyed() {
    // 关闭数据库变动的实时监听
    this.watcher.close();
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 120px;
  padding: 10px;
}

.loading {
  text-align: center;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: transparent;
  > p {
    color: #fff;
    padding: 12px 22px;
    font-size: 18px;
    border-radius: 4px;
    background: rgba(17, 17, 17, 0.7);
  }
}
.self {
  background-color: red;
}
</style>
