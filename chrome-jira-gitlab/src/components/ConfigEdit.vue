<template>
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="saveClick">
      <div class="field">
        <validation-provider rules="required" v-slot="err">
          <label for="jira" class="uk-legend">Jira site</label>
          <input class="uk-input" name="jira" v-model="row.jira" />
          <span>{{ err.errors[0] }}</span>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider rules="required" v-slot="err">
          <label for="gitlab" class="uk-legend">Gitlab site</label>
          <input class="uk-input" v-model="row.gitlab" name="gitlab" />
          <span>{{ err.errors[0] }}</span>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider rules="required" v-slot="err">
          <label for="token" class="uk-legend">Gitlab token</label>
          <input class="uk-input" v-model="row.token" name="token" />
          <span>{{ err.errors[0] }}</span>
        </validation-provider>
      </div>
      <div class="buttons">
        <vk-button type="primary" htmlType="submit" :disabled="invalid">
          Save
        </vk-button>
        <vk-button @click="cancelClick">Cancel</vk-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, extend, ValidationObserver } from "vee-validate";

extend("required", {
  validate(value) {
    return {
      required: true,
      valid: ["", null, undefined].indexOf(value) === -1,
    };
  },
  computesRequired: true,
});

export default {
  name: "ConfigEdit",
  components: { ValidationProvider, ValidationObserver },
  emits: ["close"],
  data() {
    return this.row;
  },
  props: {
    row: Object,
  },
  methods: {
    saveClick() {
      let data = this.$store.getters.configData;
      if (this.row.rn == data.length - 1) {
        data.push({});
      }
      data[this.row.rn] = this.row;
      this.$store.commit("configData", data);
      this.$emit("close", this.row);
    },
    cancelClick() {
      this.$emit("close", null);
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
</style>
