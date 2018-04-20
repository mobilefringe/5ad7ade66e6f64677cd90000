<template>
	<div v-if="dataloaded">
		<div class="page_header" v-if="pageBanner" v-lazy:background-image="pageBanner.image_url">
			<!--http://via.placeholder.com/1920x300-->
			<div class="site_container">
				<div class="header_content"> 
				    <div class="title_container">
				        <h2 class="page_header_title caps">{{$t("stores_page.store_directory")}}</h2>
				    </div>
				</div>
			</div>
		</div>
		<div class="site_container page_content">
			<div class="row padding_bottom_50 phone_padding_top_60">
                <div class="col-md-12">
                    <div class="alpha_list">
                        <a v-for="letter in alphabet" @click="scrollToAlpha(letter)">{{letter}}</a>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="row" v-if="filteredStores">
                        <div class="store_col_1" :class="{ all_storelist_container: breakIntoCol }">
                            <div v-for="(stores,key) in filteredStores">
                            <div class="store_initial_container">
                            <a :name="key"></a>
                                <span class="store_initial" :id="key" :data-initial="key">{{key}}</span>
                            </div>
                                <div id="store_list_container" class="store_list" v-for="store in stores">
                                    <div class="store_list_content cats_row">
                                        <p class="store_name"><router-link :to="'/stores/'+store.slug">{{store.name}}</router-link></p>
                                        <!--<p class="store_name"><router-link :to="{ path: /stores/'+store.slug , query: { location: store.svgmap_region }}">{{store.name}}</router-link></p>-->
                                        
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue-select", "jquery", "smooth-zoom", "vue!png-map", "vue!search-component", "vue-lazy-load"], function(Vue, Vuex, VueSelect, $, smoothZoom, PNGMapComponent, SearchComponent,VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    listMode: "alphabetical",
                    selectedCat: null,
                    selectedAlpha: "All",
                    alphabet: ["All", "#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                    filteredStores: null,
                    dataloaded: false,
                    mobile_store: false,
                    windowWidth: 0,
                    pageBanner : null,
                    search_result : null,
                    breakIntoCol : true
                }
            },
            // created() {
            //     // window.Raphael = Raphael; // our mapSvg plugin is stupid and outdated. need this hack to tie Raphael to window object (global variable)
            //     this.$store.dispatch("getData", "categories").then(response => {
            //         this.dataloaded = true;
            //         this.filteredStores = this.allStores;
            //     }, error => {
            //         console.error("Could not retrieve data from server. Please check internet connection and try again.");
            //     });
            // },
            created (){
                this.loadData().then(response => {
                    this.dataloaded = true;
                    // this.filteredStores = this.allStores;
                    this.filteredStores = this.storesByAlphaIndex;
                    
                    // this.storeBanner = this.findRepoByName('Stores Banner').images[0];
                    // var temp_repo = this.findRepoByName('Stores Banner');
                    // if(temp_repo) {
                        // this.pageBanner = temp_repo.images[0];
                        this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ad8db786e6f64678e960000/image/png/1524238270214/stores_banner.png"
                    // }
                    // console.log(temp_repo, this.pageBanner); 
                });
            },
            watch: {
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.mobile_store = true;
                    } else {
                        this.mobile_store = false;
                    }
                },
            },
            mounted() {
                // this.filteredStores = this.allStores;
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeMode(mode) {
                    this.listMode = mode;
                },
                updateSVGMap(map) {
                    this.map = map;
                },
                addLandmark(store) {
                    this.svgMapRef.addMarker(store);
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/"+option.slug);
                },
                scrollToAlpha(letter) {
                    $(".store_initial_container").removeClass('active');
                    var position = 0;
                    if(letter == "All"){
                        // position = $(".store_col_1").offset().top;
                        return;
                    }
                    else {
                        position = $("#"+letter).offset().top -100;
                        $("#"+letter).parent().addClass('active');
                    }
                    $('html, body').animate({
                		scrollTop: position
                	}, 500, 'linear');
                }
                
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findRepoByName'

                ]),
                allStores() {
                    var stores = this.processedStores;
                    var vm = this;
                   _.forEach(stores, function(store, key) {
                       if (_.includes(store.store_front_url_abs, 'missing')) {
                            store.store_front_url_abs = vm.property.default_logo;
                        }
                        if(store.assets != undefined){
                            //Stores JSON
                            var store_id = store.id
                            vm.$store.dispatch('LOAD_PAGE_DATA', { url: vm.property.mm_host + "/api/v4/thegateway/stores/" + store_id + "/store_files.json" }).then(response => {
                                if(response.data != undefined) {
                                    hover_image = response.data.store_files[0].url
                                    store.hover_img = 'https://www.mallmaverick.com' + hover_image
                                    vm.filteredStores = null;
                                    vm.filteredStores = stores; 
                                    vm.filteredStores[key].hover_img = 'https://www.mallmaverick.com' + hover_image
                                }
                            }, error => {
                                console.error("Could not retrieve data from server. Please check internet connection and try again.");
                                vm.$router.replace({ name: 'home' });
                            });
                        } 
                    });
                    return stores;
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                svgMapRef() {
                    return _.filter(this.$children, function(o) {
                        return (o.$el.className == "svg-map")
                    })[0];
                },
                filterStores (letter) {
                    
                    this.breakIntoCol = false;
                    if(letter == "All"){
                        this.filteredStores = this.storesByAlphaIndex;
                        this.breakIntoCol = true;
                    }
                    else {
                        var filtered = _.filter(this.storesByAlphaIndex, function(o,i) { return _.lowerCase(i) == _.lowerCase(letter); })[0];
                        this.filteredStores = _.groupBy(filtered, store => (isNaN(store.name.charAt(0)) ? store.name.charAt(0) : "#"));
                        this.breakIntoCol = false;
                    }
                    
                }
                
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            },
        });
    });
</script>