<template>
	<div class="row page_content" v-if="dataLoaded">
		<div class="banner_div">
			<div class="home-banner-container">
				<slick ref="slick" :options="slickOptions">
					<div class="" v-for="banner in banners" v-if="banners">
						<div class="home-banner" v-lazy:background-image="banner.image_url">
					        <div class="banner_text site_container">
					            <div class="property_logo_container">
					                <img :src="property_logo" class="image" :alt="property.name">
					            </div>
					            <div class="banner_title_container">
                                    <h2 class="banner_title">Website Under Construction</h2>
                                    <h4 class="banner_sub_title caps">We will be back in a couple of weeks</h4>
                                </div>
                                <div class="shopping_hours">
                                    <h3 class="caps"> Shopping Centre Hours</h3>
                                    <div>
                                        <p> Moday to Friday 9:30am to 9pm</p>
                                        <p> Saturday 9:30am to 6pm</p>
                                        <p> Saturday 12pm to 5pm</p>
                                    </div>
                                </div>
                                <p class="leasing">
                                    For leasing inquiries please visit <a href="http://www.smartcentres.com/leasing/leasing-inquiry/">SmartCentres</a>
                                </p>
                                <!--<router-link class="banner_btn hvr-icon-wobble-horizontal caps" :to="banner.url">{{banner.description}} <i class="fa fa-angle-right hvr-icon"></i></router-link>-->
                            </div>
						</div>
					</div>
				</slick>
			</div>
		</div>
	</div>
</template>

<style>
    .page_content {
        margin-bottom: 0px;
    }
</style>
<script>
    define(["Vue", "vuex", "vue!today_hours", "vue!search-component", 'vue!vue-slick', 'js-cookie', 'masonry' , 'vue-masonry-plugin', 'vue-lazy-load', "vue!google_map"], function(Vue, Vuex, TodayHoursComponent, SearchComponent, slick, Cookies, masonry, VueMasonryPlugin, VueLazyload, GoogleMapAPI) {
        Vue.use(VueMasonryPlugin.default);
        Vue.use(VueLazyload);
        return Vue.component("under-construction", {
            template: template, // the variable template will be injected
            props:['locale', 'property_logo'],
            data: function() {
                return {
                    suggestionAttribute: 'name',
                    search: '',
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1600
                    },
                    dataLoaded: false,
                    show_popup: false,
                    popup: null,
                    formData : {}
                }
            },
            created () {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.popup = this.$store.state.popups[0];
                    
                });
            },
            // mounted () {
            //     //initiate google Map
                    
            //         this.$nextTick(() => this.loadMap());
            // },
            watch : {
                dataLoaded () {
                    var viewed = Cookies.get('popup_viewed');
                    if(this.popup !== null && viewed !== "true") {
                        Cookies.set('popup_viewed', "true");
                        viewed = Cookies.get('popup_viewed');
                        this.show_popup = true;
                        this.popup.image_url = "//mallmaverick.cdn.speedyrails.net" + this.popup.photo_url;
                        document.getElementById('popup_backdrop').style.display = "block";
                    }
                    else {
                        document.getElementById('popup_backdrop').style.display = "none";
                    }
                    
                    
                },
                formData () {
                    this.formData.name = this.formData.firstname + " " + this.formData.lastname; 
                },
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                },
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'getTodayHours'
                ]),
                banners () {
                    var banners = [];
                    var banner = {};
                    banner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ad8db786e6f64678e960000/image/jpeg/1524161057676/under_construction_banner copy.jpg";
                    banner.name = this.property.name;
                    banner.description = "See Stores";
                    banner.url = "/stores";
                    banners.push(banner);
                    return banners;
                },
                feature_items () {
                    // return this.$store.state.feature_items;
                    var features = this.$store.state.feature_items;
                    _.forEach(features, function(value, key) {
                      
                        if( _.includes([0], key) ) {
                            value.masonry_class = "grid-item--height2";
                        }
                        else if ( _.includes([1,4], key) ){
                            value.masonry_class = "grid-item--width2";
                        }
                        else {
                            value.masonry_class = "";
                        }
                        if(value.name === null || value.name === undefined || value.name.length == 0) {
                            value.no_hover_class = false;
                        }
                        else {
                            value.no_hover_class = true;
                        }
                    });
                    console.log(_.slice(features, [0], [6]));
                    return _.slice(features, [0], [6]);
                },
                mobile_feature_items () {
                    var features = this.$store.state.feature_items;
                    _.forEach(features, function(value, key) {
                      
                        if( _.includes([0], key) ) {
                            value.masonry_class = "grid-item--height2";
                        }
                        else if ( _.includes([1,4], key) ){
                            value.masonry_class = "grid-item--width2";
                        }
                        else {
                            value.masonry_class = "";
                        }
                        value.mobile_order = key;
                        if(key == 0) {
                            value.mobile_order = 1;
                        }
                        else if(key == 1) {
                            value.mobile_order = 0;
                        }
                        // else if(key == 2) {
                        //     value.mobile_order = 2;
                        // }
                        // else if(key == 3) {
                        //     value.mobile_order = 0
                        // }
                        // else if( key == 4) {
                        //     value.mobile_order = 1;
                        // // } 
                        // else {
                            
                        // }
                    });
                    features = _.sortBy(features, [function(o) { return o.mobile_order; }]);
                    console.log(features);
                    return features;
                },
                full_address() {
                    return this.property.address1 + '' + this.property.city + '' + this.property.country + '' + this.property.province_state + '' + this.property.province_state

                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "promotions"), this.$store.dispatch("getData", "popups")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                closePopup() {
                    this.show_popup = false;
                    document.getElementById('popup_backdrop').style.display = "none";
                },
                loadMap () {
                    console.log(document.getElementById('map'));
                    window.initMap();
                }
            }
        })
    })
</script>
