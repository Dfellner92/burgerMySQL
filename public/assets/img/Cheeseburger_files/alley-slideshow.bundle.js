/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * @ngdoc module
	 * @name Slideshow
	 * @description slideshow: a slideshow
	 * @example
	 * <doc: example>
	 *   <doc: source>
	 *     <script>
	 *       var app = angular.module('myApp', 'ai.alleySlideshow']);
	 *     </script>
	 *     <div slideshow
	 *       data='myData'
	 *       >
	 *     </div>
	 *   </doc: source>
	 * </doc: example>
	 */
	
	// Define the module and add dependencies
	angular.module("ai.alleySlideshow", ["ngAnimate", "ngSanitize", "wpAjax.module", "share.module", "site.module"]);
	
	// slideshow service
	__webpack_require__(2);
	
	// Use snake case when defining the directive in markup
	// @example
	// <angular-slideshow data='myData' />
	angular.module("ai.alleySlideshow").directive("alleySlideshow", directive);
	
	// importing styles alongside other styles for now
	// import './directive.scss';
	
	// ngtemplate-loader fills the template cache after the module runs
	__webpack_require__(3);
	
	directive.$inject = ["$timeout", "$window"];
	
	function directive($timeout, $window) {
	  return {
	    // The directive template string
	    templateUrl: "directive/directive.html",
	
	    // Passed in vars
	    scope: {
	      postId: "@"
	    },
	
	    // The directive controller
	    controller: controller,
	
	    // The directive link
	    link: link,
	
	    // Localize the controller in the template to avoid scope
	    // @example
	    // <span>{{ vm.activeIndex }}</span>
	    controllerAs: "vm" };
	
	  function link(scope, elm) {
	    var element = angular.element(elm),
	        wrapper = element.children(".slideshowWrapper"),
	        slide = angular.element(element.children(".slideshowWrapper").children(".slideWrapper")[2]);
	
	    angular.element($window).bind("resize", function () {
	      setOffsetMargin();
	    });
	
	    scope.$watch("vm.slideshowVisible", function (isVisible) {
	      if (isVisible) {
	        wrapper.removeClass("ng-hide");
	        setOffsetMargin();
	      } else {
	        wrapper.addClass("ng-hide");
	      }
	    });
	
	    function setOffsetMargin() {
	      var wrapperHeight = wrapper.prop("offsetHeight"),
	          slideHeight = slide.prop("offsetHeight"),
	          offset = Math.trunc((wrapperHeight - slideHeight) / 2 - 50);
	      scope.offsetMargin = offset > 0 ? offset + "px" : "100px";
	
	      $timeout(function () {
	        scope.$apply();
	      }, 0);
	    }
	  }
	}
	
	controller.$inject = ["$scope", "$element", "$document", "$window", "$timeout", "shareService", "siteService", "slideshowService"];
	
	function controller($scope, $element, $document, $window, $timeout, shareService, siteService, slideshowService) {
	  /* jshint validthis: true */
	  var vm = this;
	  vm.imageList = []; // Gets populated w/ images
	  vm.slideshowType = ""; // Switch for how-tos
	  vm.title = "";
	  vm.permalink = "";
	  vm.activeIndex = 0;
	  vm.slideshowVisible = false;
	  vm.slideShare = false;
	  vm.active = false;
	  vm.nextSlide = nextSlide;
	  vm.prevSlide = prevSlide;
	  vm.toggleSlideshow = toggleSlideshow;
	  vm.expand = expand;
	  vm.noExpand = false;
	
	  _getImages();
	
	  function _expandStyle() {
	    var style = {},
	        children = angular.element(".expander", $element).children();
	    style.height = 0;
	
	    angular.forEach(children, function (child) {
	      style.height += angular.element(child).outerHeight();
	    });
	
	    style.bottom = 0;
	    style.top = angular.element(".expander", $element).outerHeight() - style.height;
	
	    return style;
	  }
	
	  function _checkExpand() {
	    var expandStyle = _expandStyle(),
	        expander = angular.element(".expander", $element);
	
	    if (expandStyle.height < expander.outerHeight()) {
	      vm.noExpand = true;
	    } else {
	      vm.noExpand = false;
	    }
	  }
	
	  function _getImages() {
	    slideshowService.getImages($scope.postId).then(function () {
	      var data = slideshowService.getNextGallery();
	      if (data) {
	        vm.imageList = data.images;
	        vm.slideshowType = data.gallery.style;
	        vm.title = data.gallery.title;
	        vm.permalink = data.gallery.url;
	      }
	    });
	  }
	
	  function _keyWatchers(kill) {
	    kill = kill || false;
	
	    var keyFunctions = {
	      27: toggleSlideshow,
	      37: prevSlide,
	      39: nextSlide
	    };
	
	    if (kill) {
	      $document.off("keydown");
	    } else {
	      $document.on("keydown", function (e) {
	        if (Object.keys(keyFunctions).indexOf(e.which.toString()) !== -1) {
	          if (!e.repeat) {
	            keyFunctions[e.which](" (keboard)");
	            $scope.$digest();
	          }
	        }
	      });
	    }
	  }
	
	  function expand() {
	    vm.isExpanded = !vm.isExpanded;
	    vm.expanderStyle = vm.isExpanded ? _expandStyle() : {};
	  }
	
	  function nextSlide(keyPress) {
	    if (vm.activeIndex + 1 >= vm.imageList.length) {
	      vm.activeIndex = 0;
	    } else {
	      vm.activeIndex++;
	    }
	
	    vm.isExpanded = false;
	    $timeout(_checkExpand, 30);
	
	    $window.frAnalytics.trackEvent("button", "click", "next slide" + (keyPress || ""));
	  }
	
	  function prevSlide(keyPress) {
	    if (vm.activeIndex - 1 < 0) {
	      vm.activeIndex = vm.imageList.length - 1;
	    } else {
	      vm.activeIndex--;
	    }
	
	    vm.isExpanded = false;
	    $timeout(_checkExpand, 30);
	
	    $window.frAnalytics.trackEvent("button", "click", "previous slide" + (keyPress || ""));
	  }
	
	  function toggleSlideshow(keyPress) {
	    _keyWatchers(vm.slideshowVisible);
	    vm.slideshowVisible = !vm.slideshowVisible;
	    vm.isExpanded = false;
	    siteService.updateSlideshow(vm.slideshowVisible);
	
	    if (vm.slideshowVisible) {
	      $window.frAnalytics.trackEvent("button", "click", "open slideshow" + (keyPress || ""));
	      $timeout(_checkExpand, 30);
	    } else {
	      $window.frAnalytics.trackEvent("button", "click", "close slideshow" + (keyPress || ""));
	    }
	  }
	}
	

	// If you had isolate scope values, bind them to the controller this
	//bindToController: true

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	angular.module("ai.alleySlideshow", ["wpAjax.module"]).service("slideshowService", slideshowService);
	
	slideshowService.$inject = ["$q", "wpAjaxService"];
	
	/**
	 * @ngdoc service
	 * @name siteService
	 * @desc Service for managing site state
	 */
	
	function slideshowService($q, wpAjaxService) {
	  var service = {
	    getImages: getImages,
	    getNextGallery: getNextGallery
	  },
	      galleries,
	      galleryIterator,
	      loadingImages;
	
	  return service;
	
	  function getImages(postId) {
	    if (!loadingImages) {
	      loadingImages = $q.defer();
	
	      wpAjaxService.request("gallery_data", { post_id: postId }).success(function (response) {
	        loadingImages.resolve();
	        galleries = Array.isArray(response.data) ? response.data : [].push(response.data);
	        galleryIterator = galleries.keys();
	
	        if (!galleryIterator.next) {
	          galleryIterator = _fakeKeys(galleries);
	        }
	      }).error(function (reason) {
	        loadingImages.reject("Error Loading Images Occurred:" + reason);
	      });
	    }
	
	    return loadingImages.promise;
	  }
	
	  function getNextGallery() {
	    return galleries ? galleries[galleryIterator.next().value] : false;
	  }
	
	  function _fakeKeys(array) {
	    var keys = {};
	
	    keys.ids = [];
	    keys.curr = 0;
	    keys.next = _next;
	
	
	    for (var i = 0; i < array.length; i++) {
	      keys.ids.push({ value: i });
	    }
	
	    return keys;
	
	    function _next() {
	      var curr = this.curr;
	      this.curr++;
	      return curr > this.ids.length ? false : this.ids[curr];
	    }
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	var path = 'directive/directive.html';
	window.angular.module('ai.alleySlideshow').run(['$templateCache', function(c) { c.put(path, "<div class=\"slideshowActivator\" ng-if=\"vm.imageList.length\">\n\t<span class=\"header\" ng-click=\"vm.toggleSlideshow()\"><i class=\"icon-slideshow\"></i> Start Slideshow</span>\n\t<div class=\"slideshow-img\">\n\t\t<img ng-click=\"vm.toggleSlideshow()\" ng-src=\"{{vm.imageList[0][0].src}}\" alt=\"vm.imageList[0].title\" />\n\t\t<div\n\t\t\tshare\n\t\t\tcontext=\"archive\"\n\t\t\tsocial-id=\"slideshow\"\n\t\t\turl=\"{{ vm.permalink }}\"\n\t\t\ttitle=\"{{ vm.title }}\"\n\t\t\tmedia=\"{{ vm.imageList[0][0].src }}\"\n\t\t\tclass=\"social-modal\"\n\t\t>\n\t\t</div>\n\t</div>\n\t<div class=\"footer\">\n\t\t<span ng-click=\"vm.toggleSlideshow()\"><span ng-bind-html=\"vm.title\"></span> | {{vm.imageList.length}} Photos</span>\n\t\t<share-activator social-id=\"slideshow\"></span>\n\t</div>\n</div>\n\n<div class=\"slideshowWrapper\" ng-class=\"{open: vm.slideshowVisible}\">\n\t<a class=\"closeBtn\" ng-click=\"vm.toggleSlideshow()\"><i class=\"icon-cross\"></i></a>\n\t<h1 ng-bind-html=\"vm.title\"></h1>\n\t<div ng-click=\"vm.nextSlide()\" class=\"slideWrapper\" ng-class=\"{'no-description': !vm.imageList[vm.activeIndex][0].description}\">\n\t\t<picture ng-repeat=\"(key, images) in vm.imageList\" ng-show=\"key === vm.activeIndex\">\n\t\t\t<source\n\t\t\t\tng-repeat=\"src in images\"\n\t\t\t\tng-srcset=\"{{src.src}}, {{src.srcretina}} 2x\"\n\t\t\t\tmedia=\"{{src.breakpoint}}\"\n\t\t\t>\n\t\t\t<img\n\t\t\t\tng-srcset=\"{{images[0].src}} {{images[0].width}}w,\n\t\t\t\t\t{{images[0].srcretina}} {{images[0].width * 2}}w\"\n\t\t\t\tng-src=\"{{images[0].src}}\"\n\t\t\t\tsizes=\"{{images[0].width}}px\"\n\t\t\t\talt=\"{{images[0].title}}\"\n\t\t\t>\n\t\t</picture>\n\t\t<div class=\"imgCredit\">\n\t\t\t<span>{{vm.imageList[vm.activeIndex][0].credit}}</span>\n\t\t</div>\n\t</div>\n\t<div class=\"slideshowInfo\">\n\t\t<div class=\"imgDescription\" ng-class=\"{ 'expanded': vm.isExpanded, 'no-expand': vm.noExpand, 'no-description': !vm.imageList[vm.activeIndex][0].description }\">\n\t\t\t<div class=\"expander\" ng-style=\"vm.expanderStyle\">\n\t\t\t\t<h2 ng-if=\"vm.imageList[vm.activeIndex][0].link\" class=\"slideshowTitle\">\n\t\t\t\t\t<a ng-href=\"{{vm.imageList[vm.activeIndex][0].link}}\"><span ng-if=\"vm.slideshowType === 'howto'\">{{ vm.activeIndex + 1 }}. </span><span ng-bind-html=\"vm.imageList[vm.activeIndex][0].title\"></span></a>\n\t\t\t\t</h2>\n\n\t\t\t\t<h2 ng-if=\"!vm.imageList[vm.activeIndex][0].link\" class=\"slideshowTitle\"><span ng-if=\"vm.slideshowType === 'howto'\">{{ vm.activeIndex + 1 }}. </span><span ng-bind-html=\"vm.imageList[vm.activeIndex][0].title\"></span></h2>\n\t\t\t\t<div class=\"imgInfo body-copy\" ng-if=\"vm.imageList[vm.activeIndex][0].description\" ng-bind-html=\"vm.imageList[vm.activeIndex][0].description\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"readMore\" ng-hide=\"vm.noExpand\">\n\t\t\t\t<span ng-if=\"!vm.isExpanded\" ng-click=\"vm.expand()\">Read More</span>\n\t\t\t\t<span ng-if=\"vm.isExpanded\" ng-click=\"vm.expand()\">Read Less</span>\n\t\t\t</div>\n\t\t</div>\n\t\t<div\n\t\t\tshare\n\t\t\tcontext=\"slideshow\"\n\t\t\tsocial-id=\"slide\"\n\t\t\turl=\"{{ vm.imageList[vm.activeIndex][0].src }}\"\n\t\t\ttitle=\"{{ vm.imageList[vm.activeIndex][0].title }}\"\n\t\t\tmedia=\"{{ vm.imageList[vm.activeIndex][0].src}}\"\n\t\t>\n\t\t</div>\n\t\t<div class=\"slideshowCtrl\">\n\t\t\t<span class=\"slideshowCounter\">{{vm.activeIndex + 1}} of {{vm.imageList.length}}</span>\n\t\t\t<a class=\"nav-left\" ng-click=\"vm.prevSlide()\"><span class=\"icon-chevron-left\"></span></a>\n\t\t\t<a class=\"nav-right\" ng-click=\"vm.nextSlide()\"><span class=\"icon-chevron-right\"></span></a>\n\t\t</div>\n\t</div>\n</div>\n") }]);
	module.exports = path;

/***/ }
/******/ ]);
//# sourceMappingURL=alley-slideshow.bundle.map