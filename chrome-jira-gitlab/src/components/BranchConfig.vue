<template>
  <div>
    <div class="branchname">
      <span><v-select v-model="prefix" :options="['fix/', 'feature/']" /></span>
      <span>{{ config.issue }}</span>
      <span><input v-model="postfix" /></span>
    </div>
    <vk-table
      :data="config.projects"
      :selected-rows.sync="selected"
      rows-selectable
    >
      <vk-table-column-select></vk-table-column-select>
      <vk-table-column title="Project name" cell="name"></vk-table-column>
    </vk-table>
    <div>
      <label>Source branch</label>
      <v-select
        @search="fetchBranches"
        @open="fetchBranches"
        :options="fetchedBranches"
        label="name"
        v-model="selectedBranch"
      >
        <template slot="no-options">
          <span v-if="!selected.length">select at least one project</span>
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
      <vk-button
        type="primary"
        :disabled="!selectedBranch"
        @click="createBranches"
      >
        Create branches
      </vk-button>
    </div>
    <div>
      <pre>{{ log }}</pre>
    </div>
  </div>
</template>

<script>
import { debounce } from "vue-debounce";

export default {
  name: "BranchConfig",
  props: {
    config: Object,
  },
  data() {
    return {
      prefix: "feature/",
      postfix: "",
      selected: [],
      fetchedBranches: [],
      loading: 0,
      projects: [],
      selectedBranch: null,
      log: "",
    };
  },
  computed: {
    branchName: {
      get() {
        return `${this.prefix}${this.config.issue}${this.postfix}`;
      },
    },
    mrTitle: {
      get() {
        return `[${this.config.issue}] ${this.config.issueName}`;
      },
    },
  },
  mounted() {
    this.projects = this.config.projects;
  },
  methods: {
    fetchBranches(search, loading) {
      let timer = loading ? "2000ms" : "0ms";
      loading = loading || (() => null);
      console.log(this.selected);
      if (!this.selected.length) {
        return;
      }
      let project = this.selected[0];
      this.GitLabAPI.setUrl(this.config.gitlab);
      this.GitLabAPI.setToken(this.config.token);
      console.log(project);
      console.log(search);
      const me = this;
      if (this._debounce) {
        this._debounce.cancel();
      }
      this._debounce = debounce(() => {
        loading(me.loading++);
        me.GitLabAPI.get(
          `/projects/${project}/repository/branches`,
          { search: search },
          (response) => {
            me.fetchedBranches = response.body;
            loading(--me.loading);
          },
          (response) => {
            loading(--me.loading);
            console.error(response);
          }
        );
      }, timer);
      this._debounce();
    },
    dolog(message) {
      this.log += `\n${message}`;
    },
    createBranches() {
      const me = this;
      me.log = "";
      this.selected.forEach((project) => {
        this.GitLabAPI.post(
          `/projects/${project}/repository/branches?branch=${this.branchName}&ref=${this.selectedBranch.name}`,
          {},
          (response) => {
            me.dolog("Branch created");
            me.createMR(project);
            console.log(response);
          },
          (response) => {
            if (response.body && response.body.message) {
              me.dolog(response.body.message);
              if ("Branch already exists" === response.body.message) {
                me.createMR(project);
              }
            }
            console.error(response);
          }
        );
      });
    },
    createMR(project) {
      const me = this;
      this.GitLabAPI.post(
        `/projects/${project}/merge_requests`,
        {
          title: this.mrTitle,
          source_branch: this.branchName,
          target_branch: this.selectedBranch.name,
        },
        (response) => {
          me.dolog("MR created");
          console.log(response);
        },
        (response) => {
          if (response.body && response.body.message) {
            me.dolog(response.body.message);
          }
          console.error(response);
        }
      );
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

.branchname span {
  display: inline-block;
  width: 33%;
}

.branchname span input {
  max-width: 95%;
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
