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
        :colors="colors"
        :filter="filter"
        @check="onCheck(item._id)"
        @color-change="onColorChange(item._id)"
        @new-color="onNewColor"
        @star-change="onStarChange(item._id)"
        @remove="onRemove(item._id)"
      ></item>
    </ul>
    <add-form @add-item="addItem"></add-form>
  </div>
</template>

<script>
import tabBar from './components/TabBar';
import addForm from './components/AddForm';
import item from './components/Item';
import $getDB from './tcb';
import $service from './tcb/service';

export default {
  name: 'app',
  components: {
    tabBar,
    addForm,
    item,
  },
  data() {
    return {
      colors: ['all', 'ice', 'tang', 'jewel', 'rose'],
      todoList: null,
      filter: 'all',
      recentColor: 'ice',
      watcher: null,
    };
  },
  methods: {
    // 增加
    async addItem(text) {
      const newItem = {
        text: text,
        color: this.recentColor,
        checked: false,
        starred: false,
      };
      const res = await $service.addItem(newItem);
      if (res && res.code === 0) {
        this.getList();
      }
    },
    // 删除
    async onRemove(_id) {
      const res = await $service.deleteItem({ _id });
      if (res && res.code === 0) {
        this.getList();
      }
    },
    // 更新
    async updateItem(updatedItem) {
      const res = await $service.updateItem(updatedItem);
      if (res && res.code === 0) {
        this.getList();
      }
    },
    // 拉取数据列表
    async getList() {
      const res = await $service.getList();
      if (res && res.code === 0) {
        this.todoList = [...res.data.list];
      }
    },
    onCheck(_id) {
      let el = this.todoList.find((x) => x._id === _id);
      el.checked = !el.checked;
      this.updateItem(el);
    },
    onColorChange(_id) {
      let el = this.todoList.find((x) => x._id === _id);
      el.color = this.recentColor;
      this.updateItem(el);
    },
    onStarChange(_id) {
      let el = this.todoList.find((x) => x._id === _id);
      el.starred = !el.starred;
      this.updateItem(el);
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
      const db = await $getDB();
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

<style>
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
</style>
