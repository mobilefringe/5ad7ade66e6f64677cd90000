<template>
	<div class="row page_content" v-if="dataLoaded">
		<div class="banner_div">
			<div class="home-banner-container">
				<slick ref="slick" :options="slickOptions">
					<div class="" v-for="banner in banners" v-if="banners">
					    <!--<div class="home-banner" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>-->
						<div class="home-banner" v-lazy:background-image="banner.image_url">
						    <!--<div class="site_container">-->
						        <div class="banner_text site_container">
						            <div class="banner_title_container">
                                        <h2 class="banner_title">{{banner.name}}</h2>
                                    </div>
                                    <router-link class="banner_btn hvr-icon-wobble-horizontal caps" :to="banner.url">{{banner.description}} <i class="fa fa-angle-right hvr-icon"></i></router-link>
                                </div>
						    <!--</div>-->
						</div>
					</div>
				</slick>
			</div>
		</div>
		<div class="site_container">
		    <div>
		      <h4 class="home_page_title caps">{{$t("home_page.explore")}} {{property.name}}</h4>
		    </div>
		    <div class="feature_items_container clearfix">
		        <div class="feature_item col-sm-4" v-for="feature in feature_items">
    		        <router-link :to="feature.url">
    		            <img :src="feature.image_url" :alt="feature.name" class="image">
    		            <div class="feature_name">
    		                {{feature.name}}
    		            </div>
		            </router-link>
		        </div>
		    </div>
		    <div>
    		    <div class="col-sm-4">
    		    <div v-if="property" class="property_dets">
        		       <p>{{property.name}}</p>
        		       <p>{{property.address1}}</p>
        		       <p>{{property.city}}, {{property.country}}, {{property.postal_code}}</p>
        		       <p>{{property.contact_phone}}</p>
    		       </div>
    		       <div class="home_contact_container">
    		           <div class="description_text text-center caps contact_us_dets">
                        CONTACT US
                    </div>
                    <form class="form-horizontal padding_top_20" action="form-submit" @submit.prevent="validateBeforeSubmit">
                        <div class="form-group ">
                            <div class="col-sm-12" :class="{'has-error': errors.has('name')}">
                                <label class="label" for="name">Name</label>
                                <input v-model="form_data.name" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="name" type="text" placeholder="Name" data-vv-delay="500">
                                <span v-show="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</span>
                            </div>
                            <div class="col-sm-12" :class="{'has-error': errors.has('email')}">
                                <label class="label" for="email">Email</label>
                                <input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="500">
                                <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
                            </div>
                            <div class="col-xs-12" :class="{'has-error': errors.has('message')}">
                                <label class="label" for="message">Message</label>
                                <textarea v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" type="text" placeholder="Message" data-vv-delay="500"></textarea>
                                <span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
                            </div>
                        </div>
                        <div class="form-group account-btn text-left m-t-10">
                            <div class="col-xs-12 text-center">
                                <button class="contact_btn" type="submit" :disabled="formSuccess">Submit</button>
                            </div>
                        </div>
                    </form>
                    
                    <div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
                        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        <span class="sr-only">Success</span>
                        Thank you for contacting us. A member from our team will contact you shortly.
                    </div>
                    <div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
                        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span class="sr-only">Error:</span>
                        There was an error when trying to submit your request. Please try again later.
                    </div>
                    
    		       </div>
    		    </div>
    		    <div class="col-sm-8">
    		        <div class="google_map">
            		    <google-map :property="property"></google-map>
            		</div>
    		    </div>
    		</div>
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue!today_hours", "vue!search-component", 'vue!vue-slick', 'js-cookie', 'masonry' , 'vue-masonry-plugin', 'vue-lazy-load', "vue!google_map",  'vee-validate'], function(Vue, Vuex, TodayHoursComponent, SearchComponent, slick, Cookies, masonry, VueMasonryPlugin, VueLazyload, GoogleMapAPI, VeeValidate) {
        Vue.use(VueMasonryPlugin.default);
        Vue.use(VueLazyload);
        Vue.use(VeeValidate);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {',
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
                    form_data : {},
                    formSuccess : false,
                    formError: false,
                    instaFeed: null
                }
            },
            created () {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.popup = this.$store.state.popups[0];
                    
                    var socialFeed = response[4].data;
                    var social_feed = socialFeed.social.instagram;
                    this.instaFeed = _.slice(social_feed, [0], [6]);
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
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'getTodayHours'
                ]),
                banners () {
                    var banners = this.$store.state.banners;
                    banners.map(banner => { 
                        banner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ad8db786e6f64678e960000/image/jpeg/1524085268825/HeroImage.jpg";
                        banner.name = this.property.name;
                        banner.description = "See Stores";
                        banner.url = "/stores";
                    });
                    
                    // return _.orderBy(this.$store.state.banners, ['position'], ['asc']);
                    return _.orderBy(banners, ['position'], ['asc']);
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
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "promotions"), this.$store.dispatch("getData", "popups"), this.$store.dispatch('LOAD_PAGE_DATA', {url: "http://bonniedoon.mallmaverick.com/api/v2/bonniedoon/social.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                closePopup() {
                    this.show_popup = false;
                    document.getElementById('popup_backdrop').style.display = "none";
                }
            }
        })
    })
</script>
