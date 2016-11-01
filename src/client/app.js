import angular      from 'angular';

import 'angular-ui-router';
import 'angular-sanitize';
import 'angular-resource';
import 'angular-material';
import 'angular-utils-pagination';

import mainCtrl         from './controllers/mainCtrl';
import listCtrl         from './controllers/listCtrl';
import idBoxCtrl        from './controllers/idBoxCtrl';
import searchAddCtrl    from './controllers/searchAddCtrl';
import listSvc          from './service/listSvc';
import userSvc          from './service/userSvc';
import playerSvc        from './service/playerSvc';
import searchSvc        from './service/searchSvc';
import * as common      from './service/commonSvc';
import youtube          from  './directives/youtube';

// It is purpose to add css to javascript using webpack.
import './css/angular-material.scss';
import './css/style.scss';

angular
    .module('withSong', [ 'ui.router', 'ngResource', 'ngMaterial', 'angularUtils.directives.dirPagination', 'ngSanitize' ])
    .config(($stateProvider, $locationProvider) => {
        $stateProvider
            .state('main', {
                abstract: true,
                views:{
                    main: {
                        url: '',
                        templateUrl: '/partials/main.html',
                        controller: 'mainCtrl',
                        controllerAs: 'vm'
                    },
                    idBox: {
                        url: '',
                        templateUrl: '/partials/id-box.html'
                    }
                },
            })
            .state('main.music-list', {
                url: '/',
                templateUrl: '/partials/main.music-list.html',
                controller: 'listCtrl',
                controllerAs : 'vm',
                resolve: {
                    initList: $resource => {
                        return $resource('/load/list').get().$promise;
                    }
                }
            })
            .state('main.search-add', {
                url: '/',
                templateUrl: '/partials/main.search-add.html',
                controller: 'searchAddCtrl',
                controllerAs : 'vm',
                resolve: {
                    isLogin: (Session, $q)=> {
                        const q = $q.defer();
                        if(Session.isLogin){
                            q.resolve();
                        }else{
                            q.reject();
                        }
                        return q.promise;
                    }
                }
            })
            .state('sign-up', {
                url: '/sign-up',
                templateUrl: '/partials/sign-up.html',
                controller: 'userCtrl'
            });

        $locationProvider.html5Mode(true);
    })
    .config($mdThemingProvider => {
        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('orange');
    })
    .service('List', listSvc)
    .service('User', userSvc)
    .service('Player', playerSvc)
    .service('Session', common.Session)
    .service('Search', searchSvc)
    .controller('mainCtrl', mainCtrl)
    .controller('listCtrl', listCtrl)
    .controller('idBoxCtrl', idBoxCtrl)
    .controller('searchAddCtrl', searchAddCtrl)
    .directive('youtube', ['$window', ($window) => new youtube($window)]);