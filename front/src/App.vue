<template>
  <v-app>
    <v-main>
      <v-app-bar app color="pink"  text-color="white" dense>
        <v-app-bar-title> бэбра </v-app-bar-title>
      </v-app-bar>
      <v-container>
        <v-row>
          <v-col>
            <v-btn
              color="red"
              v-on:click="deleteAllList = !deleteAllList"
              block
              x-large
            >
              УДАЛИТЬ ВЕСЬ СПИСОК
            </v-btn>
            <v-bottom-sheet persistent v-model="deleteAllList">
              <v-sheet class="text-center" height="300px">
                <div>Вы уверены, что хотите удалить весь список?</div>
                <v-row>
                  <v-col>
                    <v-btn
                      text
                      color="green"
                      v-on:click="deleteAllList = !deleteAllList"
                      block
                      large
                    >
                      Нет
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      text
                      color="red"
                      v-on:click="deleteToDoList(), deleteAllList = !deleteAllList"
                      block
                      large
                    >
                      Да
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-bottom-sheet>
          </v-col>
          <v-col>
            <v-btn
              color="green"
              v-on:click="deleteFields(), create = !create"
              block
              x-large
            >
              СОЗДАТЬ ToDO
            </v-btn>
            <v-bottom-sheet hide-overlay v-model="create">
              <v-sheet class="text-center" height="300px">
                <v-row>
                  <v-btn
                    v-on:click="createToDo(), create = !create"
                    color="green"
                    block
                    x-large
                  >
                    Готово!
                  </v-btn>
                </v-row>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field label="title" v-model="title">
                      </v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field label="description" v-model="description">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <v-btn text color="error" @click="create = !create">
                  Close
                </v-btn>
              </v-sheet>
            </v-bottom-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-btn v-on:click="fetchData()" color="blue" block x-large>
            Получить список
          </v-btn>
        </v-row>
        <v-row v-for="todo in todoList" :key="todo.id">
          <v-col>
            <v-card>
              <v-divider :thikness="20"></v-divider>
              <v-row>
                <v-col>
                  <v-card-title> {{ todo.title }} </v-card-title>
                </v-col>
                <v-col class="text-right">
                  <v-btn v-on:click="deleteTODO = !deleteTODO, setID(todo.id)" >
                    <v-icon dark large color="red" rounded> mdi-delete </v-icon>
                  </v-btn>
                  <v-bottom-sheet persistent v-model="deleteTODO">
                    <v-sheet class="text-center" height="300px">
                      <div>Вы уверены, что хотите удалить ToDo?</div>
                      <v-row>
                        <v-col>
                          <v-btn
                            text
                            color="green"
                            v-on:click="deleteTODO = !deleteTODO"
                            block
                            large
                          >
                            Нет
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn
                            text
                            color="red"
                            v-on:click="deleteToDoFromList(), deleteTODO = !deleteTODO"
                            block
                            large
                          >
                            Да
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </v-bottom-sheet>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card-text> {{ todo.description }} </v-card-text>
                </v-col>
                <v-col class="text-right">
                  <v-btn
                    v-on:click="setFields(todo.title, todo.description), setID(todo.id),update = !update"
                  >
                    <v-icon dark large color="green" rounded justify="left">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                  <v-bottom-sheet hide-overlay v-model="update">
                    <v-sheet class="text-center" height="300px">
                      <v-row>
                        <v-btn
                          v-on:click="updateToDo(todo.id), update = !update"
                          color="green"
                          block
                          x-large
                        >
                          Готово!
                        </v-btn>
                      </v-row>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-text-field label="title" v-model="title">
                            </v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              label="description"
                              v-model="description"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-btn text color="error" @click="update = !update">
                        Close
                      </v-btn>
                    </v-sheet>
                  </v-bottom-sheet>
                </v-col>
              </v-row>
              <v-divider :thikness="20"></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  created() {
    this.fetchData();
  },
  data: () => {
    return {
      create: false,
      update: false,
      deleteAllList: false,
      deleteTODO: false,
      title: "",
      description: "",
      todoList: [],
      id0: ""
    };
  },
  methods: {
    setFields(title, description) {
      this.title = title;
      this.description = description;
    },
    setID(id0){
      this.id0 = id0
    },
    deleteFields() {
      this.title = "";
      this.description = "";
    },
    async deleteToDoFromList() {
      await axios
        .delete("http://localhost:3100/api/todo/" + this.id0)
        .catch(function (error) {
          console.log(error);
        });
      this.fetchData();
    },
    async fetchData() {
      const response = await axios.get("http://localhost:3100/api/todo");
      console.log("data todolist", response.data.todoList);
      this.todoList = response.data.todoList;
    },
    async updateToDo() {
      await axios
        .patch("http://localhost:3100/api/todo/" + this.id0, {
          title: this.title,
          description: this.description,
        })
        .catch(function (error) {
          console.log(error);
        });
      this.fetchData();
    },
    async createToDo() {
      await axios
        .post("http://localhost:3100/api/todo", {
          title: this.title,
          description: this.description,
        })
        .catch(function (error) {
          console.log(error);
        });
      this.fetchData();
    },
    async deleteToDoList() {
      await axios
        .delete("http://localhost:3100/api/todo")
        .catch(function (error) {
          console.log(error);
        });
      this.fetchData();
    },
  },
};
</script>
