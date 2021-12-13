<template>
  <div>
    <vk-table :data="projects" hoverable>
      <vk-table-column cell="rn">
        <vk-button slot-scope="{ row }" type="link" @click="deleteClick(row)">
          ✗
        </vk-button>
      </vk-table-column>
      <vk-table-column title="Project ID" cell="id"></vk-table-column>
      <vk-table-column title="Project name">
        <input slot-scope="{ row }" v-model="row.name" />
      </vk-table-column>
    </vk-table>
    <div>
      <v-select
        @search="fetchProjects"
        :options="fetchedProjects"
        label="name"
        v-model="selected"
      >
        <template slot="no-options">
          type to search GitLab repositories..
        </template>
        <template slot="option" slot-scope="option">
          <div class="d-center">
            {{ option.name }}
          </div>
        </template>
        <template slot="selected-option" slot-scope="option">
          <div class="selected d-center">
            {{ option.name }}
          </div>
        </template>
      </v-select>
    </div>
    <div class="buttons">
      <vk-button @click="addClick" :disabled="!selected">Add</vk-button>
      <vk-button @click="saveClick()">Save</vk-button>
      <vk-button @click="cancelClick()">Cancel</vk-button>
    </div>
  </div>
</template>

<script>
import { debounce } from "vue-debounce";

export default {
  name: "ProjectsTable",
  props: {
    configRow: Object,
  },
  data() {
    return {
      fetchedProjects: [],
      loading: 0,
      selected: {},
      projects: [],
    };
  },
  emits: ["close"],
  mounted() {
    this.projects = this.configRow.projects.map((x) => ({ ...x }));
  },
  methods: {
    deleteClick(row) {
      this.projects.splice(this.projects.indexOf(row), 1);
    },
    addClick() {
      this.configRow.projects.push(this.selected);
    },
    saveClick() {
      let data = this.$store.getters.configData;
      data[this.configRow.rn].projects = this.projects;
      this.$store.commit("configData", data);
      this.$emit("close");
    },
    cancelClick() {
      this.$emit("close");
    },
    fetchProjects(search, loading) {
      this.GitLabAPI.setUrl(this.configRow.gitlab);
      this.GitLabAPI.setToken(this.configRow.token);
      if (search.length) {
        const me = this;
        if (this._debounce) {
          this._debounce.cancel();
        }
        this._debounce = debounce(() => {
          loading(me.loading++);
          me.GitLabAPI.get(
            "/projects",
            { search: search },
            (response) => {
              me.fetchedProjects = response.body.map((x) => {
                return { name: x.name, id: x.id };
              });
              loading(--me.loading);
            },
            () => {
              loading(--me.loading);
            }
          );
        }, "2000ms");
        this._debounce();
      }
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}

div.buttons {
  text-align: center;
}

.d-center {
  display: flex;
  align-items: center;
}

.selected img {
  width: auto;
  max-height: 23px;
  margin-right: 0.5rem;
}

.v-select .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1);
}

.v-select .dropdown li:last-child {
  border-bottom: none;
}

.v-select .dropdown li a {
  padding: 10px 20px;
  width: 100%;
  font-size: 1.25em;
  color: #3c3c3c;
}

.v-select .dropdown-menu .active > a {
  color: #fff;
}
</style>
