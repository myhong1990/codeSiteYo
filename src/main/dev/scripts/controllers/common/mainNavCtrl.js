(function () {
    'use strict';

    angular.module('mainCommonApp', [])
    
        .controller('mainNavCtrl', ['$scope', 'mainNavSrv', function($scope, mainNavSrv) {
            $scope.mainNavigationContent = getMainNavigationContent;
            // method to load the main navigation bar content
            function getMainNavigationContent() {
                mainNavSrv.getNavigationContents().then(function (result) {
                    
                });
            } 
    }]);
})();




$(document).ready(function() {
    var menuLv1, menuLv2, menuLv3;
    var lv1MenuItem , lv2MenuItem , lv3MenuItem ;
    // count item in fist level of the main menu
    lv1MenuItem = $('.menuLv1>li').length;
    console.log(lv1MenuItem);
    $('.menuLv1>li').each(function(e) {
        // find all ul element which are immediate children of current element (li);
        menuLv2 = $(this).children('ul');
        if (menuLv2) {
            lv2MenuItem = menuLv2.children('li').length;
            console.log(lv2MenuItem);
        } 
    });


    $('.toggle-nav').click(function(e) {
        $(this).toggleClass('menuLv1');
        $('#menu ul').toggleClass('menuLv1');
        e.preventDefault();
    });
    $('.lv1Item > a').click(function(e) {
        $(this).toggleClass('menuLv2');
        $('.lv1Item ul').toggleClass('menuLv2');
        e.preventDefault();
    });


    function countChildElement(parent, child) {
        var lv1Menu, lv2Menu, lv3Menu;
        var navMenu = [];
        // get first level items
        if ($('.menuLv1') && $('.menuLv1>li')) {
            lv1Menu = $('.menuLv1>li');
            console.log(lv1Menu);
            $('.menuLv1>li').each(function(e) { // this interate thru each li element after menuLv1
                if ($(this).children('ul')) { // access to second level ul of current li
                    if ($(this).children('ul').children('li')) {
                        lv2Menu = $(this).children('ul').children('li');
                        console.log(lv2Menu);
                        // console.log($(this).children('ul').children('li'));
                    }
                } 
            });
        }
    }
});