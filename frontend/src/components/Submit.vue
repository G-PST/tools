<template>
  <div class="row">
    <div class="col">
      <h1>Submit your software for consideration</h1>
    </div>
  </div>

  <form class="row" @submit.prevent="submit">
    <div class="input-group mb-3">
      <span class="input-group-text">Name</span>
      <input
        :value="currentTool.name"
        id="name"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Name"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Summary</span>
      <input
        :value="currentTool.short_description"
        id="short_description"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Short Description"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Description</span>
      <textarea
        :value="currentTool.description"
        id="description"
        rows="3"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Description"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Website</span>
      <input
        :value="currentTool.website"
        id="website"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Website"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Source</span>
      <input
        :value="currentTool.source"
        id="source"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Source"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">License</span>
      <input
        :value="currentTool.license"
        id="license"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="License"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Point of contact</span>
      <input
        :value="currentTool.point_of_contact"
        id="point-of-contact"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Point of contact"
      />
    </div>
    <button type="submit" class="btn btn-primary btn-lg">Submit</button>
  </form>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://gpst-tools.herokuapp.com/api";

const client = axios.create({
  baseURL: baseURL,
});

export default defineComponent({
  name: "SubmitTool",
  data() {
    return {
      currentTool: {
        name: "",
        short_description: "",
        description: "",
        website: "",
        email: "",
        license: "",
        source: "",
      },
    };
  },
  methods: {
    submit() {
      var data = {
        issue_url: "",
        issue_body: "",
        body: "",
        id: 0,
        number: 0,
        name: this.currentTool.name,
        description: this.currentTool.description,
        short_description: this.currentTool.short_description,
        website: this.currentTool.website,
        license: this.currentTool.license,
        source: this.currentTool.source,
        github_stars: 0,
        infrastructure_sector: [],
        modeling_paradigm: [],
        capabilities: [],
        language: [],
        documentation: "",
        maintenance_status: true,
        input_data_formats: [],
        output_data_formats: [],
        point_of_contact: this.currentTool.point_of_contact,
        interface: [],
        lowest_temporal_resolution: null,
        typical_temporal_resolution: null,
        highest_temporal_resolution: null,
        lowest_spatial_resolution: null,
        typical_spatial_resolution: null,
        highest_spatial_resolution: null,
        lowest_temporal_scope: null,
        typical_temporal_scope: null,
        highest_temporal_scope: null,
        lowest_spatial_scope: null,
        typical_spatial_scope: null,
        highest_spatial_scope: null,
        number_of_publications: null,
        operating_systems: [],
      };
      console.log(data);
      client
        .post("/tools", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          // catch error});
          console.log(err);
        });
    },
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
