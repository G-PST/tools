//--- Part 1: Template ---//
<template>
          <div id="arc">
          
          </div>
  <div id="app">
    <div id="container">
      <div id="row">
        <div id="col" cols="4" class="d-flex justify-center align-center">
          <div class="pa-2">
            <h3 class="pb-2">Flare Plot V.0</h3>
            <p>
              Flare plot
              
            </p>
          </div>
        </div>
        


      </div>
    </div>
  </div>
</template>


//--- Part 2: Script ---//
<script>
import * as d3 from "d3";

export default {
  name: "App",
  data() {
    return {

      classes_1: [
          {
              "name": "plt.language.language-.NET"
          },
          {
              "name": "plt.language.language-C++"
          },
          {
              "name": "plt.language.language-C"
          },
          {
              "name": "plt.language.language-HTML"
          },
          {
              "name": "plt.language.language-GAMS"
          },
          {
              "name": "plt.language.language-Python"
          },
          {
              "name": "plt.language.language-MATLAB"
          },
          {
              "name": "plt.language.language-GNU Octave"
          },
          {
              "name": "plt.language.language-Julia"
          },
          {
              "name": "plt.language.language-Delphi"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-years"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-hours"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-decades"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-months"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-seconds"
          },
          {
              "name": "plt.typical_temporal_scope.typical_temporal_scope-minutes"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-decades"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-years"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-seconds"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-hours"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-"
          },
          {
              "name": "plt.largest_temporal_scope.largest_temporal_scope-days"
          },
          {
              "name": "plt.typical_temporal_resolution.typical_temporal_resolution-hours"
          },
          {
              "name": "plt.typical_temporal_resolution.typical_temporal_resolution-minutes"
          },
          {
              "name": "plt.typical_temporal_resolution.typical_temporal_resolution-"
          },
          {
              "name": "plt.highest_temporal_resolution.highest_temporal_resolution-minutes"
          },
          {
              "name": "plt.highest_temporal_resolution.highest_temporal_resolution-"
          },
          {
              "name": "plt.highest_temporal_resolution.highest_temporal_resolution-hours"
          },
          {
              "name": "plt.highest_temporal_resolution.highest_temporal_resolution-instant"
          },
          {
              "name": "plt.highest_temporal_resolution.highest_temporal_resolution-seconds"
          },
          {
              "name": "plt.typical_spatial_scope.typical_spatial_scope-region"
          },
          {
              "name": "plt.typical_spatial_scope.typical_spatial_scope-country"
          },
          {
              "name": "plt.typical_spatial_scope.typical_spatial_scope-facility"
          },
          {
              "name": "plt.typical_spatial_scope.typical_spatial_scope-"
          },
          {
              "name": "plt.typical_spatial_scope.typical_spatial_scope-state"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-continent"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-region"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-facility"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-country"
          },
          {
              "name": "plt.largest_spatial_scope.largest_spatial_scope-county"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-facility"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-region"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-device"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-component"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-"
          },
          {
              "name": "plt.typical_spatial_resolution.typical_spatial_resolution-state"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-device"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-county"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-component"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-facility"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-state"
          },
          {
              "name": "plt.highest_spatial_resolution.highest_spatial_resolution-municipality"
          },
          {
              "name": "plt.modeling_paradigm.Optimization"
          },
          {
              "name": "plt.modeling_paradigm.Discrete Simulation"
          },
          {
              "name": "plt.modeling_paradigm.Visualization"
          },
          {
              "name": "plt.modeling_paradigm.Data"
          },
          {
              "name": "plt.modeling_paradigm.Engineering/Design"
          },
          {
              "name": "plt.modeling_paradigm.Analytics"
          },
          {
              "name": "plt.modeling_paradigm.Dynamic Simulation"
          },
          {
              "name": "plt.modeling_paradigm.Simulation"
          },
          {
              "name": "plt.modeling_paradigm.Engineering/Designtion"
          },
          {
              "name": "plt.modeling_paradigm.Descrete Simulation"
          },
          {
              "name": "plt.operating_systems.Windows"
          },
          {
              "name": "plt.operating_systems.Mac OSX"
          },
          {
              "name": "plt.operating_systems.Linux"
          },
          {
              "name": "plt.infrastructure_sector.Electric"
          },
          {
              "name": "plt.infrastructure_sector.Natural Gas"
          },
          {
              "name": "plt.infrastructure_sector.Transportation"
          },
          {
              "name": "plt.infrastructure_sector.Buildings"
          },
          {
              "name": "plt.license.Proprietary (commercial)"
          },
          {
              "name": "plt.license.Permissive (open-source, eg. BSD)"
          },
          {
              "name": "plt.license.Private"
          },
          {
              "name": "plt.license.Permissive (open-source, eg. BSD),"
          },
          {
              "name": "plt.license."
          },
          {
              "name": "plt.input_data_formats.input_data_format-XML"
          },
          {
              "name": "plt.input_data_formats.input_data_format-CSV"
          },
          {
              "name": "plt.input_data_formats.input_data_format-GLM"
          },
          {
              "name": "plt.input_data_formats.input_data_format-Matlab M-files"
          },
          {
              "name": "plt.input_data_formats.input_data_format-MATPOWER"
          },
          {
              "name": "plt.input_data_formats.input_data_format-RAW"
          },
          {
              "name": "plt.input_data_formats.input_data_format-DYR"
          },
          {
              "name": "plt.input_data_formats.input_data_format-XLSX"
          },
          {
              "name": "plt.input_data_formats.input_data_format-Excel"
          },
          {
              "name": "plt.input_data_formats.input_data_format-text files"
          },
          {
              "name": "plt.input_data_formats.input_data_format-Pandas"
          },
          {
              "name": "plt.input_data_formats.input_data_format-Text File"
          },
          {
              "name": "plt.input_data_formats.input_data_format-SQL"
          },
          {
              "name": "plt.input_data_formats.input_data_format-JSON"
          },
          {
              "name": "plt.output_data_formats.output_data_format-XML"
          },
          {
              "name": "plt.output_data_formats.output_data_format-NA"
          },
          {
              "name": "plt.output_data_formats.output_data_format-CSV"
          },
          {
              "name": "plt.output_data_formats.output_data_format-GDX"
          },
          {
              "name": "plt.output_data_formats.output_data_format-Matlab M-files"
          },
          {
              "name": "plt.output_data_formats.output_data_format-JSON"
          },
          {
              "name": "plt.output_data_formats.output_data_format-DataFrames.jl"
          },
          {
              "name": "plt.output_data_formats.output_data_format-Any"
          },
          {
              "name": "plt.output_data_formats.output_data_format-Excel"
          },
          {
              "name": "plt.output_data_formats.output_data_format-text files"
          },
          {
              "name": "plt.output_data_formats.output_data_format-Pandas"
          },
          {
              "name": "plt.output_data_formats.output_data_format-Text File"
          },
          {
              "name": "plt.output_data_formats.output_data_format-SQL"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-years",
                  "plt.largest_temporal_scope.largest_temporal_scope-decades",
                  "plt.largest_spatial_scope.largest_spatial_scope-continent",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-minutes",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-device",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Proprietary (commercial)",
                  "plt.language.language-.NET",
                  "plt.modeling_paradigm.Optimization",
                  "plt.input_data_formats.input_data_format-XML",
                  "plt.output_data_formats.output_data_format-XML"
              ],
              "name": "plt.name.PLEXOS"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-hours",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-region",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-device",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-region",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-C++",
                  "plt.language.language-C",
                  "plt.language.language-HTML",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Discrete Simulation",
                  "plt.modeling_paradigm.Visualization",
                  "plt.modeling_paradigm.Data",
                  "plt.modeling_paradigm.Engineering/Design",
                  "plt.input_data_formats.input_data_format-CSV",
                  "plt.input_data_formats.input_data_format-GLM",
                  "plt.output_data_formats.output_data_format-NA"
              ],
              "name": "plt.name.GridLAB-D"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-continent",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-instant",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-device",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Julia",
                  "plt.modeling_paradigm.Optimization",
                  "plt.input_data_formats.input_data_format-MATPOWER",
                  "plt.input_data_formats.input_data_format-RAW",
                  "plt.output_data_formats.output_data_format-JSON"
              ],
              "name": "plt.name.PowerModels-jl"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-months",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-continent",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-minutes",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-seconds",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-component",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-device",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Julia",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Discrete Simulation",
                  "plt.input_data_formats.input_data_format-MATPOWER",
                  "plt.input_data_formats.input_data_format-RAW",
                  "plt.input_data_formats.input_data_format-CSV",
                  "plt.output_data_formats.output_data_format-CSV",
                  "plt.output_data_formats.output_data_format-DataFrames.jl",
                  "plt.output_data_formats.output_data_format-Any"
              ],
              "name": "plt.name.PowerSimulations-jl"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-seconds",
                  "plt.largest_temporal_scope.largest_temporal_scope-seconds",
                  "plt.largest_spatial_scope.largest_spatial_scope-region",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-instant",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-component",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-component",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD),",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Dynamic Simulation",
                  "plt.input_data_formats.input_data_format-MATPOWER",
                  "plt.input_data_formats.input_data_format-DYR",
                  "plt.input_data_formats.input_data_format-XLSX",
                  "plt.output_data_formats.output_data_format-NA"
              ],
              "name": "plt.name.ANDES"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-hours",
                  "plt.largest_temporal_scope.largest_temporal_scope-hours",
                  "plt.largest_spatial_scope.largest_spatial_scope-facility",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-minutes",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-component",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-facility",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-C++",
                  "plt.modeling_paradigm.Simulation",
                  "plt.modeling_paradigm.Visualization",
                  "plt.modeling_paradigm.Engineering/Designtion",
                  "plt.input_data_formats.input_data_format-Excel",
                  "plt.input_data_formats.input_data_format-text files",
                  "plt.output_data_formats.output_data_format-Excel",
                  "plt.output_data_formats.output_data_format-text files"
              ],
              "name": "plt.name.SAM"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-decades",
                  "plt.largest_temporal_scope.largest_temporal_scope-decades",
                  "plt.largest_spatial_scope.largest_spatial_scope-continent",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-minutes",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-facility",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-region",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Optimization",
                  "plt.input_data_formats.input_data_format-MATPOWER",
                  "plt.input_data_formats.input_data_format-CSV",
                  "plt.output_data_formats.output_data_format-Pandas"
              ],
              "name": "plt.name.SWITCH"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-hours",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-continent",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-instant",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-component",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-region",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Descrete Simulation",
                  "plt.modeling_paradigm.Dynamic Simulation",
                  "plt.modeling_paradigm.Analytics",
                  "plt.modeling_paradigm.Visualization",
                  "plt.input_data_formats.input_data_format-MATPOWER",
                  "plt.input_data_formats.input_data_format-Pandas",
                  "plt.output_data_formats.output_data_format-Pandas"
              ],
              "name": "plt.name.PandaPower"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-minutes",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-minutes",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-seconds",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-",
                  "plt.typical_spatial_scope.typical_spatial_scope-",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Delphi",
                  "plt.modeling_paradigm.Discrete Simulation",
                  "plt.modeling_paradigm.Visualization",
                  "plt.modeling_paradigm.Analytics",
                  "plt.modeling_paradigm.Data",
                  "plt.modeling_paradigm.Engineering/Design",
                  "plt.input_data_formats.input_data_format-CSV",
                  "plt.input_data_formats.input_data_format-Text File",
                  "plt.output_data_formats.output_data_format-CSV",
                  "plt.output_data_formats.output_data_format-Text File"
              ],
              "name": "plt.name.OpenDSS"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-",
                  "plt.largest_temporal_scope.largest_temporal_scope-",
                  "plt.largest_spatial_scope.largest_spatial_scope-",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-",
                  "plt.typical_spatial_scope.typical_spatial_scope-",
                  "plt.license.Permissive (open-source, eg. BSD)",
                  "plt.language.language-Python",
                  "plt.language.language-Julia",
                  "plt.language.language-GAMS",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Discrete Simulation",
                  "plt.modeling_paradigm.Dynamic Simulation",
                  "plt.modeling_paradigm.Analytics",
                  "plt.modeling_paradigm.Visualization",
                  "plt.modeling_paradigm.Data",
                  "plt.modeling_paradigm.Engineering/Design",
                  "plt.input_data_formats.input_data_format-CSV",
                  "plt.input_data_formats.input_data_format-SQL",
                  "plt.output_data_formats.output_data_format-CSV",
                  "plt.output_data_formats.output_data_format-SQL"
              ],
              "name": "plt.name.Spine Toolbox"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-hours",
                  "plt.largest_temporal_scope.largest_temporal_scope-days",
                  "plt.largest_spatial_scope.largest_spatial_scope-country",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-hours",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-state",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-state",
                  "plt.typical_spatial_scope.typical_spatial_scope-state",
                  "plt.license.",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Visualization",
                  "plt.operating_systems.Windows",
                  "plt.operating_systems.Mac OSX",
                  "plt.operating_systems.Linux",
                  "plt.infrastructure_sector.Electric"
              ],
              "name": "plt.name.psst"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-years",
                  "plt.largest_temporal_scope.largest_temporal_scope-years",
                  "plt.largest_spatial_scope.largest_spatial_scope-county",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-hours",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-facility",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-country",
                  "plt.license.",
                  "plt.language.language-Julia",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Optimization",
                  "plt.modeling_paradigm.Visualization",
                  "plt.modeling_paradigm.Data",
                  "plt.operating_systems.Windows",
                  "plt.operating_systems.Mac OSX",
                  "plt.operating_systems.Linux",
                  "plt.infrastructure_sector.Electric"
              ],
              "name": "plt.name.PowerSimData-REISE-jl"
          },
          {
              "imports": [
                  "plt.typical_temporal_scope.typical_temporal_scope-years",
                  "plt.largest_temporal_scope.largest_temporal_scope-",
                  "plt.largest_spatial_scope.largest_spatial_scope-",
                  "plt.typical_temporal_resolution.typical_temporal_resolution-hours",
                  "plt.highest_temporal_resolution.highest_temporal_resolution-minutes",
                  "plt.highest_spatial_resolution.highest_spatial_resolution-municipality",
                  "plt.typical_spatial_resolution.typical_spatial_resolution-facility",
                  "plt.typical_spatial_scope.typical_spatial_scope-facility",
                  "plt.license.",
                  "plt.language.language-Julia",
                  "plt.language.language-Python",
                  "plt.modeling_paradigm.Optimization",
                  "plt.operating_systems.Windows",
                  "plt.operating_systems.Mac OSX",
                  "plt.operating_systems.Linux",
                  "plt.infrastructure_sector.Electric",
                  "plt.infrastructure_sector.Natural Gas",
                  "plt.infrastructure_sector.Transportation",
                  "plt.infrastructure_sector.Buildings",
                  "plt.input_data_formats.input_data_format-JSON",
                  "plt.output_data_formats.output_data_format-JSON"
              ],
              "name": "plt.name.REopt Tool"
          }
      ]

    };
  },
  mounted() {
      this.generateArc();
    },
    methods: {
      generateArc() {

        // All new information go here
        var diameter = 960, //960, ***
            radius = diameter / 2,
            innerRadius = radius - 200;

        // add to change margin around the graphs
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            padding = {top: 10, right: 10, bottom: 10, left: 10},
            outerWidth = 1000,
            outerHeight = 1000,
            innerWidth = outerWidth - margin.left - margin.right,
            innerHeight = outerHeight - margin.top - margin.bottom,
            width = innerWidth - padding.left - padding.right,
            height = innerHeight - padding.top - padding.bottom;


        var cluster = d3.cluster()
            .size([360, innerRadius]);

        var line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; }); 


        //create main svg element
        var svg = d3.select("#arc")
                  .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + radius + "," + radius + ")");


        var link = svg.append("g").selectAll("link"),
            node = svg.append("g").selectAll("node");


        // ------------------------ //
        // --- (Start) Original --- //
        //--- removed d3.json() ---//
        var root = packageHierarchy(this.classes_1)
            .sum(function(d) { return d.size; });

        cluster(root);

        this.link = link
          .data(packageImports(root.leaves()))
          .enter().append("path")
            .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
            .attr("class", "link")
            .attr("d", line);

      node = node
          .data(root.leaves())
          .enter().append("text")
            .attr("class", "node")
            .attr("dy", "0.31em")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .text(function(d) { return d.data.key; })
            .on("mouseover", mouseovered)
            .on("mouseout", mouseouted);




        function mouseovered(d) {
          node
              .each(function(n) { n.target = n.source = false; });

          link
              .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
              .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
            .filter(function(l) { return l.target === d || l.source === d; })
              .raise();

          node
              .classed("node--target", function(n) { return n.target; })
              .classed("node--source", function(n) { return n.source; });
        }
        

        function mouseouted(d) {
          link
              .classed("link--target", false)
              .classed("link--source", false);

          node
              .classed("node--target", false)
              .classed("node--source", false);
        }

        // Lazily construct the package hierarchy from class names.
        function packageHierarchy(classes) {
          var map = {};

          function find(name, data) {
            var node = map[name], i;
            if (!node) {
              node = map[name] = data || {name: name, children: []};
              if (name.length) {
                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
              }
            }
            return node;
          }

          classes.forEach(function(d) {
            find(d.name, d);
          });

          return d3.hierarchy(map[""]);
        }

        // Return a list of imports for the given array of nodes.
        function packageImports(nodes) {
          var map = {},
              imports = [];

          // Compute a map from name to node.
          nodes.forEach(function(d) {
            map[d.data.name] = d;
          });

          // For each import, construct a link from the source to target node.
          nodes.forEach(function(d) {
            if (d.data.imports) d.data.imports.forEach(function(i) {
              imports.push(map[d.data.name].path(map[i]));
            });
          });

          return imports;
        }







      }
    }
};

</script>



//--- Part 3: Style ---//
<style>
.node {
  font: 300 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
  fill: #bbb;
}

.node:hover {
  fill: #000;
}

.link {
  stroke: steelblue;
  stroke-opacity: 0.4;
  fill: none;
  pointer-events: none;
}

.node:hover,
.node--source,
.node--target {
  font-weight: 700;
}

.node--source {
  fill: #2ca02c;
}

.node--target {
  fill: #d62728;
}

.link--source,
.link--target {
  stroke-opacity: 1;
  stroke-width: 2px;
}

.link--source {
  stroke: #d62728;
}

.link--target {
  stroke: #2ca02c;
}
</style>