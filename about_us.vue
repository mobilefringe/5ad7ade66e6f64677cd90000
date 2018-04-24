<template>
	<div id="contact_us_container">
		<!-- for some reason if you do not put an outer container div this component template will not render -->
		<div  v-if="pageBanner" class="page_header" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
			<div class="site_container">
				<div class="header_content">
					<div class="title_container">
						<h2 class="page_header_title caps">{{$t("header.about_us")}}</h2>
					</div>
				</div>
			</div>
		</div>
		<div class="site_container">
			<div class="row margin_30">
				<div class="col-sm-12">
					<h3 class="hours_heading text-left" >{{property.name}} {{$t("hours_page.hours")}}</h3>
				</div>
				<div class="col-sm-6 text-left" v-if="hours.length > 0">
					<h4 class="hours_title"> {{$t("hours_page.reg_hours")}} </h4>
					<div id="hours_container" class="hours_container">
						<div class="hours_div text-left clearfix" v-for="hour in hours">
							<span class="col-sm-6 no_padding_left_dm">{{hour.day_of_week | moment("dddd", timezone)}} : </span>
							<span v-if="hour.is_closed" class="col-xs-6 text-left no_padding_left_dm">Closed</span>
							<span v-else class="col-sm-6 no_padding_left_dm">{{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}</span>
						</div>
					</div>
				</div>
				<div class="col-sm-6" v-if="holidayHours.length > 0">
					<h4 class="hours_title">{{$t("hours_page.holiday_closures")}}</h4>
					<div id="closed_hours_container" class="hours_container">
						<div class="hours_div text-left clearfix" v-for="hour in holidayHours">
							<span>
							<span v-if="locale=='en-ca'">{{hour.holiday_name}}</span>
							<span v-else>{{hour.holiday_name_2}}</span>
							({{hour.holiday_date | moment("MMM D YYYY", timezone)}})
							</span>
						</div>
					</div>
				</div>
			</div>
			<div>
			    <div class="visible_phone">
		            <div class="google_map">
            		    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3238.228400622835!2d-79.70550983095802!3d43.41266509546466!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc115e4093fc343b7!2sSouth+Oakville+Centre!5e0!3m2!1sen!2sca!4v1524581405558" width="100%" height="375" frameborder="0" style="border:0" allowfullscreen></iframe>
            		</div>
		        </div>
				<div class="col-sm-4">
					<div v-if="property" class="property_dets">
						<p class="property_name caps">{{property.name}}</p>
						<p>{{property.address1}}</p>
						<p>{{property.city}}, {{property.country}}, {{property.postal_code}}</p>
						<p class="property_phone">{{property.contact_phone}} 1905-837-2392</p>
					</div>
					<div class="home_contact_container">
						<div class="description_text text-left caps contact_us_dets">
							CONTACT US
						</div>
						<form class="form-horizontal" action="form-submit" @submit.prevent="validateBeforeSubmit">
							<div class="form-group ">
								<div class="col-sm-12" :class="{'has-error': errors.has('email')}">
									<label class="label" for="email">Your Email</label>
									<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="500">
									<span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
								</div>
								<div class="col-xs-12" :class="{'has-error': errors.has('message')}">
									<label class="label" for="message">Your Message</label>
									<textarea v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" type="text" placeholder="Message" data-vv-delay="500"></textarea>
									<span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
								</div>
							</div>
							<div class="form-group account-btn text-left m-t-10">
								<div class="col-xs-12 text-left">
									<button class="contact_btn hvr-grow-shadow " type="submit" :disabled="formSuccess"><span class="hidden_phone">Submit</span><span class="visible_phone">Send Message</span></button>
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
				<div class="col-sm-8 hidden_phone">
					<div class="google_map">
						<google-map :property="property"></google-map>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", 'vee-validate', 'utility', "vue!google_map"], function(Vue, Vuex, moment, tz, VueMoment, Meta, VeeValidate,Utility, GoogleMapAPI) {
        Vue.use(Meta);
        Vue.use(VeeValidate);
        return Vue.component("about-us-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    form_data : {},
                    formSuccess : false,
                    formError: false,
                    currentPage : null,
                    pageBanner: null
                }
            },
            created(){
                this.loadData().then(response => {
                    this.currentPage = response[0].data;
                    // var temp_repo = this.findRepoByName('Contact Us Banner');
                    // if(temp_repo) {
                    //     this.pageBanner = temp_repo.images[0];
                    //     // this.pageBanner = {};
                    //     // this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ad8db786e6f64678e960000/image/png/1523030162566/contact_us_inside_banner.png"
                    // }
                    this.pageBanner = {};
                    this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ad8db786e6f64678e960000/image/png/1524247425145/about_us.png"
                });
            },
            mounted () {
                //ensuring the variables are created in this order for email
                this.form_data.email = null;
                this.form_data.subject = this.property.name + ' Contact Us Form';
                this.form_data.message = null;
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'getPropertyHours',
                    'getPropertyHolidayHours'
                ]),
                hours () {
                    return this.getPropertyHours;
                },
                holidayHours () {
                    return this.getPropertyHolidayHours;
                },
                reducedHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.filter(holidayHours, function(o) { return !o.is_closed; });
                },
                closeHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.sortBy(_.filter(holidayHours, function(o) { return o.is_closed; }), [function(o) { return o.holiday_date; }]);
                }
            },
            methods: {
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        let errors = this.errors;
                        send_data = {};
                        send_data.form_data = JSON.stringify(Utility.serializeObject(this.form_data));
                        this.$store.dispatch("CONTACT_US", send_data).then(res => {
                            this.formSuccess = true;
                        }).catch(error => {
                            try {
                                if (error.response.status == 401) {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                } 
                                else {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                }
                            } 
                            catch (e) {
                                console.log("Data load error: " + error.message);
                                this.formError = true;
                            }
                        })
                    })
                },
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>
