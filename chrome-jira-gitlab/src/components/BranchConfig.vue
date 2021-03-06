<template>
  <div>
    <div class="branchname">
      <span><v-select v-model="prefix" :options="['fix/', 'feature/']" /></span>
      <span>{{ config.issue }}</span>
      <span><input v-model="postfix" /></span>
    </div>
    <div class="mrTitle">
      <input v-model="mrTitle" />
    </div>
    <vk-table class="projects"
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
      user: null,
      log: "",
      mrTitle: `WIP: [${this.config.issue}] ${this.config.issueName}`,
    };
  },
  computed: {
    branchName: {
      get() {
        console.log(`${this.prefix}${this.config.issue}${(this.postfix ? '_' : '')}${this.postfix}`);
        return `${this.prefix}${this.config.issue}${(this.postfix ? '_' : '')}${this.postfix}`;
      },
    },
  },
  mounted() {
    this.projects = this.config.projects;
    this.getUserID();
  },
  methods: {
    fetchBranches(search, loading) {
      let timer = loading ? "2000ms" : "0ms";
      loading = loading || (() => null);
      if (!this.selected.length) {
        return;
      }
      let project = this.selected[0];
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
          () => {
            me.dolog("Branch created");
            me.createMR(project);
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
          assignee_id: this.user,
          squash: true,
          remove_source_branch: true,
        },
        () => {
          me.dolog("MR created");
        },
        (response) => {
          if (response.body && response.body.message) {
            me.dolog(response.body.message);
          }
          console.error(response);
        }
      );
    },
    getUserID() {
      const me = this;
      this.GitLabAPI.setUrl(this.config.gitlab);
      this.GitLabAPI.setToken(this.config.token);
      this.GitLabAPI.get(
        `/user/`,
        {},
        (response) => {
          me.user = response.body.id;
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

.mrTitle input {
  width: 96%;
  margin: 0 0 0 1%;
}

.projects.uk-table {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
