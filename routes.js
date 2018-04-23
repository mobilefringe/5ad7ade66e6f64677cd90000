define([], function() {
    return [{
            path: '/',
            component: view('home')
        },
        {
            path: '/stores',
            component: view('default'),
            children: [{
                    path: '',
                    component: view('stores'),
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    name: 'storeDetails',
                    props: true
                }
            ]
        },
        {
            path: '/hours',
            component: view('hours'),
            // children: [{
            //     path: '',
            //     component: view('hours'),
            //     name: 'hourList',
            // }]
        },
        {
            path: '/about_us',
            component: view('default'),
            children: [{
                path: '',
                component: view('about_us'),
                name: 'aboutUs'
            }]
        },
        {
            path: '/pages',
            component: view('default'),
            redirect: '/404',
            children: [{
                path: ':id',
                component: view('page_details'),
                name: 'pageDetails',
                props: true
            }]
        },
        {
            path: '/404',
            name: '404',
            component: view('notfoundcomponent')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]

    /**
     * Asynchronously load view (lazy-loading)
     * @param {string} name the filename (basename) of the view to load.
     */
    function view(name) {
        return function(resolve) {
            require(['vue!' + name + '.vue'], resolve);
        }
    };
});