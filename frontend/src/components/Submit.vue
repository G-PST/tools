<template>
  <div class="row">
    <div class="col">
      <h1>Submit your software for consideration</h1>
    </div>
  </div>

  <form class="row" @submit.prevent="submit">
    <div class="row input-group mb-3">
      <span class="input-group-text">Name</span>
      <input
        v-model="currentTool.name"
        id="name"
        type="text"
        class="form-control"
        placeholder="Tool Name"
        aria-label="Name"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Summary</span>
      <input
        v-model="currentTool.short_description"
        id="short_description"
        type="text"
        class="form-control"
        placeholder="Short Description (maximum 140 chars)"
        aria-label="Short Description"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Description</span>
      <textarea
        v-model="currentTool.description"
        id="description"
        rows="3"
        type="text"
        class="form-control"
        placeholder="Long Description"
        aria-label="Description"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Website</span>
      <input
        v-model="currentTool.website"
        id="website"
        type="url"
        class="form-control"
        placeholder="Website URL"
        aria-label="Website"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Source</span>
      <input
        v-model="currentTool.source"
        id="source"
        type="url"
        class="form-control"
        placeholder="Source URL"
        aria-label="Source"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">License</span>
      <input
        v-model="currentTool.license"
        id="license"
        type="text"
        class="form-control"
        placeholder="License (e.g. BSD, LGPL, etc)"
        aria-label="License"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Point of contact</span>
      <input
        v-model="currentTool.point_of_contact"
        id="point-of-contact"
        type="email"
        class="form-control"
        placeholder="Email address"
        aria-label="Point of contact"
      />
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Lowest Temporal Resolution</span>
      <select
        v-model="currentTool.lowest_temporal_resolution"
        class="form-select"
        aria-label="Lowest Temporal Resolution"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Typical Temporal Resolution</span>
      <select
        v-model="currentTool.typical_temporal_resolution"
        class="form-select"
        aria-label="Typical Temporal Resolution"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Highest Temporal Resolution</span>
      <select
        v-model="currentTool.highest_temporal_resolution"
        class="form-select"
        aria-label="Highest Temporal Resolution"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Lowest Temporal Scope</span>
      <select
        v-model="currentTool.lowest_temporal_scope"
        class="form-select"
        aria-label="Lowest Temporal Scope"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Typical Temporal Scope</span>
      <select
        v-model="currentTool.typical_temporal_scope"
        class="form-select"
        aria-label="Typical Temporal Scope"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <div class="row input-group mb-3">
      <span class="input-group-text">Highest Temporal Scope</span>
      <select
        v-model="currentTool.highest_temporal_scope"
        class="form-select"
        aria-label="Highest Temporal Scope"
      >
        <option value="instant">Instant</option>
        <option value="subseconds">Subseconds</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
        <option value="decades">Decades</option>
        <option value="centuries">Centuries</option>
      </select>
    </div>
    <button type="submit" class="row btn btn-primary btn-lg">Submit</button>
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
      errors: [],
      currentTool: {
        issue_url: "",
        issue_body: "",
        body: "",
        id: 0,
        number: 0,
        github_stars: 0,
        name: "",
        short_description: "",
        description: "",
        website: "",
        email: "",
        license: "",
        source: "",
        infrastructure_sector: [],
        modeling_paradigm: [],
        capabilities: [],
        language: [],
        documentation: "",
        maintenance_status: true,
        input_data_formats: [],
        output_data_formats: [],
        point_of_contact: "",
        interface: [],
        lowest_temporal_resolution: "seconds",
        typical_temporal_resolution: "seconds",
        highest_temporal_resolution: "seconds",
        lowest_spatial_resolution: null,
        typical_spatial_resolution: null,
        highest_spatial_resolution: null,
        lowest_temporal_scope: "seconds",
        typical_temporal_scope: "seconds",
        highest_temporal_scope: "seconds",
        lowest_spatial_scope: null,
        typical_spatial_scope: null,
        highest_spatial_scope: null,
        number_of_publications: null,
        operating_systems: [],
      },
    };
  },
  methods: {
    submit() {
      console.log(this.currentTool.name);
      console.log(this.currentTool.short_description);
      client
        .post("/tools", this.currentTool)
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
