<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input autocomplete="off" class="new-todo" placeholder="添加条目" @keyup.enter="addTodo" />
    </header>
    <!-- main section -->
    <section class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })" />
      <label for="toggle-all" />
      <ul class="todo-list" v-if="todos.length">
        <todo v-for="(todo, index) in filteredTodos" :key="index" :todo="todo" @deleteTodo="deleteTodo(todo.id)" @editTodo="editTodo" @toggleTodo="toggleTodo" />
      </ul>
      <div v-else>
        <code class="empty">暂无数据</code>
      </div>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}条待完成</strong>
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | Getfilters }}</a>
        </li>
      </ul>
      <!--      &lt;!&ndash; <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">-->
      <!--        Clear completed-->
      <!--      </button> &ndash;&gt;-->
    </footer>
  </section>
</template>

<script>
import Todo from "./Todo.vue";
import { getToDoList, addTodo, deleteTodo, updated, updatedActive } from "@/api/remote-search";
import { Message } from "element-ui";

// const STORAGE_KEY = "todos";
const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.done),
  completed: (todos) => todos.filter((todo) => todo.done),
};
const defalutList = [];
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => (n === 1 ? w : w + "s"),
    capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
    Getfilters: (value) => {
      switch (value) {
        case "all":
          return "所有";
        case "active":
          return "待完成";
        case "completed":
          return "已完成";
      }
    },
  },
  data() {
    return {
      visibility: "all",
      filters,
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todos: defalutList,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    allChecked() {
      return this.todos.every((todo) => todo.done);
    },
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return this.todos.filter((todo) => !todo.done).length;
    },
  },
  methods: {
    // 获取todo
    fetchData() {
      getToDoList().then((response) => {
        let todos = [];
        response.data.forEach((value) => {
          if (value.done == "1") {
            value.done = true;
            todos.push(value);
          } else {
            value.done = false;
            todos.push(value);
          }
        });
        this.todos = todos;
      });
    },
    // setLocalStorage() {
    //   window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    // },
    // 添加todo
    addTodo(e) {
      const text = e.target.value;
      addTodo({ text: text }).then((response) => {
        if (response.code == 200) {
          Message.success("条目添加成功");
          this.fetchData();
        } else {
          Message.info("添加失败");
        }
      });
    },
    toggleTodo(val) {
      const { id, done } = val;
      const isDone = done ? 0 : 1;
      updatedActive(id, isDone).then((response) => {
        if (response.code == 200) {
          Message.success("修改成功");
          this.fetchData();
        }
      });
    },
    // 删除todo
    deleteTodo(todo) {
      deleteTodo(todo).then((response) => {
        if (response.code == 200) {
          Message.success("删除成功");
          this.fetchData();
        }
      });
    },
    // 编辑todo
    editTodo({ todo, value }) {
      const { id } = todo;
      updated(id, value).then((response) => {
        if (response.code == 200) {
          Message.success("修改成功");
          this.fetchData();
        }
      });
    },
    clearCompleted() {
      this.todos = this.todos.filter((todo) => !todo.done);
      // this.setLocalStorage();
    },
    toggleAll({ done }) {
      this.todos.forEach((todo) => {
        todo.done = done;
        // this.setLocalStorage();
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
.empty {
  font-size: 16px;
  text-align: center;
  display: block;
  width: 100%;
  padding: 20px 0;
  font-weight: bold;
}
</style>
