<template>
    <div class="" id="map"></div>
</template>
<style>
    /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
</style>

<script>
    define(["Vue", "vuex", 'google-map-api', 'axios', 'json!google_map_theme.json'], function(Vue, Vuex, googleMapAPI, axios, googleMapTheme) {
        return Vue.component("google-map", {
            template: template, 
            props: {
                property: {
                    type: Object,
                    required: true
                },
                zoom: {
                    type: Number,
                    default: 15
                }
            },
            data: function() {
                return {
                    position: null
                }
            },
            mounted() {
                // window.initMap();
                property_string = this.property.address1+"+"+ this.property.city + "+" + this.property.country + "+" + this.property.postal_code;
                property_string = property_string.replace(/ /g,"+");
                console.log("property_string", property_string)
                axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+property_string +'&key=AIzaSyCukCjH3fsuDYBdI44hZKL43m60jEToJjY').then(response => {
                    // resolve(response);
                    console.log(response.data.results)
                    geometry = response.data.results[0].geometry;
                    var new_pos = {};
                    new_pos.lat = geometry.location.lat;
                    new_pos.lng = geometry.location.lng;
                    this.position = new_pos;
                });
                // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCukCjH3fsuDYBdI44hZKL43m60jEToJjY
                // this.initMap();
            },
            watch : {
                position () {
                    this.initMap();
                }
            },
            methods : {
                initMap() {
                    // Styles a map in night mode.
                    var map = new google.maps.Map(document.getElementById('map'), {
                      center: this.position,
                      zoom: this.zoom,
                      styles: googleMapTheme
                    });
                    var marker = new google.maps.Marker({
                      position: this.position,
                      map: map
                   });
                }
            }
        });
    });
</script>
