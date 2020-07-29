webpackJsonp([6],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(21);
	__webpack_require__(23);
	__webpack_require__(14);
	__webpack_require__(22);
	__webpack_require__(18);
	__webpack_require__(16);
	module.exports = __webpack_require__(15);


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	'use strict';
	
	module.exports = shareCtrl;
	
	/**
	 * @ngdoc controller
	 * @name shareCtrl
	 * @desc Controller share activator directive
	 */
	function shareCtrl($scope, $attrs, $window, shareService) {
	  /*jshint validthis: true */
	  var vm = this,
	  params;
	
	  vm.social = {};
	  vm.active = false;
	  vm.trackEvent = $window.frAnalytics.trackEvent;
	  vm.footerSocialHide = true;
	  vm.isHidden = isHidden;
	  vm.notSorted = notSorted;
	  vm.print = _print;
	
	  activate();
	
	  function activate() {
	    if (angular.isDefined($attrs.links)) {
	      vm.links = $scope.$eval($attrs.links);
	    }
	
	    if ('archive' === vm.context && vm.socialId) {
	      $scope.$watch(
	        shareService.getActiveModal, function(newVal) {
	          if (newVal === vm.socialId) {
	            vm.active = true;
	          } else {
	            vm.active = false;
	          }
	        });
	    }
	
	    if (('video' === vm.socialId || 'slideshow' === vm.socialId || 'slide' === vm.socialId)) {
	      $scope.$watch('vm.url', function() {
	        params = getParams();
	        if (angular.isDefined(params.url)) {
	          shareService
	            .requestSocialData(params)
	            .then(function(data) {
	              vm.links = angular.fromJson(data);
	            });
	        }
	      });
	    }
	  }
	
	  function isHidden(index) {
	    if (index > 3 && 'footer' === vm.context && vm.footerSocialHide) {
	      return true;
	    }
	
	    return false;
	  }
	
	  function notSorted(obj) {
	      if (!obj) {
	          return [];
	      }
	      return Object.keys(obj);
	  }
	
	  function getParams() {
	    return {
	      'context': vm.context,
	      'url': vm.url,
	      'title': vm.title,
	      'media': vm.media,
	      'author': vm.authorId
	    };
	  }
	
	  function _print() {
	    $window.print();
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = shareActivatorCtrl;
	
	/**
	 * @ngdoc controller
	 * @name shareActivatorCtrl
	 * @desc Controller share activator directive
	 */
	function shareActivatorCtrl($attrs, shareService) {
	  /*jshint validthis: true */
	  var vm = this;
	
	  vm.socialId = $attrs.socialId;
	  vm.update = update;
	
	  function update() {
	    shareService.updateModal(vm.socialId);
	  }
	}

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc module
	 * @name breakpointService
	 * @desc Service and module for getting and matching breakpoints
	 */
	angular
	  .module('breakpoint.module', [])
	  .service('breakpointService', breakpointService);
	
	function breakpointService() {
	  var service = {
	    matches: matches
	  },
	  breakpoints = {
	    xl: '(min-width: 80em)',
	    l: '(min-width: 65em) and (max-width: 80em)',
	    mUp: '(min-width: 50em)',
	    m: '(min-width: 50em) and (max-width: 65em)',
	    sUp: '(min-width: 50em)',
	    s: '(min-width: 30em) and (max-width: 50em)',
	    xsS: '(max-width: 50em)',
	    xs: '(max-width: 30em)'
	  };
	
	  return service;
	
	  function matches(bp) {
	    bp = getBreakpoint(bp);
	
	    if (bp) {
	      if (matchMedia(bp).matches) {
	        return true;
	      }
	    }
	
	    return false;
	  }
	
	  function getBreakpoint(bpName) {
	    if (angular.isDefined(breakpoints[bpName])) {
	      return breakpoints[bpName];
	    }
	
	    return false;
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	angular
	  .module('html5Pushdown.module', [])
	  .directive('googleTagPushdown', googleTagPushdown);
	
	googleTagPushdown.$inject = [
	  '$window',
	  '$document',
	  '$timeout',
	];
	
	function googleTagPushdown() {
	
	  return {
	    controller: googleTagPushdownCtrl,
	    controllerAs: 'vm',
	    bindToController: true,
	    scope: {
	      'slot': '@',
	    },
	  };
	}
	
	function googleTagPushdownCtrl(
	  $element,
	  $attrs,
	  $window,
	  $document,
	  $timeout) {
	
	  var vm = this;
	
	  $window.googletag.cmd.push(adEventListener);
	
	  function adEventListener() {
	    $window.frVars = $window.frVars || {};
	    // Prevent multiple additions of this...
	    if ($window.frVars.slotRenderEnded !== true) {
	      $window
	        .googletag
	        .pubads()
	        .addEventListener('slotRenderEnded', slotRenderEnded);
	    }
	
	    $window.frVars.slotRenderEnded = true;
	
	    $window.googletag.display('div-gpt-ad-' + vm.slot);
	  }
	
	  function slotRenderEnded(event) {
	    // Check that the ad unit is one of the pushdown-compatible leaderboard slots
	    var adUnitName = event.slot.getAdUnitPath().split('/').pop();
	    var isCompatibleSlot = $window
	                            .pushdownAdVars
	                            .compatibleSlots
	                            .indexOf(adUnitName) >= 0;
	
	    // 2. check that it's the correct pushdown size, 1600x200
	    var isPushdownSize = (!event.isEmpty) ? event.size.toString() === $window
	                                                    .pushdownAdVars
	                                                    .creativeSize
	                                                    .toString() : null;
	
	    if (!event.isEmpty && isCompatibleSlot && isPushdownSize) {
	      var adContainer = $document[0]
	                          .getElementById(event.slot.getSlotElementId())
	                          .parentElement;
	      var close = angular
	                    .element(
	                      angular.element(adContainer).children()[0]
	                    );
	
	      // Setup classes that enable the pushdown transition
	      angular.element(adContainer).addClass('pushdown');
	      angular.element(adContainer).removeClass('hidden');
	
	      // Set height to match ad creative and animate the pushdown
	      $timeout(function(){
	        angular.element(adContainer).addClass('visible');
	        angular.element(adContainer).css('height', event.size[1] + 'px');
	
	        close.on('click', function(e) {
	          e.preventDefault();
	          angular.element(adContainer).removeClass('visible');
	          angular.element(adContainer).css('height', 0);
	        });
	      }, 50);
	    }
	    // Handle non-pushdown ad creative in leaderboard slot
	    else if (!event.isEmpty && !isPushdownSize && isCompatibleSlot) {
	      $document[0]
	        .getElementById(event.slot.getSlotElementId())
	        .parentElement
	        .classList
	        .remove('hidden');
	    }
	  }
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(40);
	
	/**
	 * @ngdoc directive
	 * @name imageOverlay
	 * @desc Directive for sticking objects to top of screen
	 */
	angular
	  .module('imageOverlay.module', [])
	  .directive('imageOverlay', imageOverlay);
	
	imageOverlayCtrl.$inject = ['$element', '$attrs', 'breakpointService'];
	
	function imageOverlay() {
	
	  return {
	    controller: imageOverlayCtrl,
	    controllerAs: 'vm',
	    bindToController: true,
	    templateUrl: 'modules/image-overlay/imageOverlay.html'
	  };
	}
	
	function imageOverlayCtrl($element, $attrs, breakpointService) {
	  /* jshint validthis: true */
	  var vm = this,
	  overlayData = angular.fromJson($attrs.overlayData);
	
	  vm.overlayText = overlayData.items;
	  vm.overlayTitle = overlayData.title;
	
	  vm.currentTextItem = false;
	  vm.height = $element.height();
	  vm.position = {
	    horizontal: 'right',
	    vertical: 'top'
	  };
	  vm.textStyle = {};
	  vm.calculatePosition = calculatePosition;
	  vm.checkBreakpoint = checkBreakpoint;
	
	  function calculatePosition(textItem) {
	    if (textItem !== vm.currentTextItem) {
	      vm.currentTextItem = textItem;
	    } else {
	      vm.currentTextItem = false;
	    }
	
	    if ((textItem.x + 225) > $element.width()) {
	      vm.position.horizontal = 'left';
	    } else {
	      vm.position.horizontal = 'right';
	    }
	
	    if (textItem.y > ($element.height() / 2)) {
	      vm.position.vertical = 'bottom';
	      vm.textStyle[vm.position.vertical] = (vm.height - textItem.y) + 'px';
	      vm.textStyle.top = 'auto';
	    } else {
	      vm.position.vertical = 'top';
	      vm.textStyle[vm.position.vertical] = textItem.y + 'px';
	      vm.textStyle.bottom = 'auto';
	    }
	
	    vm.textStyle.left = textItem.x + 'px';
	  }
	
	  function checkBreakpoint() {
	    return breakpointService.matches('xl');
	  }
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var shareCtrl = __webpack_require__(1);
	shareCtrl.$inject = ['$scope', '$attrs', '$window', 'shareService'];
	
	__webpack_require__(41);
	
	/**
	 * @ngdoc directive
	 * @name share
	 * @desc Directive for social sharing overlay
	 */
	angular
	  .module('share.module')
	  .directive('share', share);
	
	function share() {
	
	  return {
	    controller: shareCtrl,
	    controllerAs: 'vm',
	    bindToController: true,
	    scope: {
	      context: '@',
	      socialId: '@',
	      url: '@',
	      title: '@',
	      media: '@',
	      authorId: '@'
	    },
	    templateUrl: 'modules/sharing/share.html'
	  };
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @ngdoc module
	 * @name share
	 * @desc Module and service for sharing and social profile buttons
	 */
	angular
	  .module('share.module', []);
	
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(2);
	__webpack_require__(17);
	__webpack_require__(1);


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	angular
	  .module('share.module')
	  .factory('shareService', shareService);
	
	shareService.$inject = ['wpAjaxService', '$q', '$window'];
	
	/**
	 * @ngdoc factory
	 * @name share
	 * @desc Service for managing social sharing modals
	 */
	function shareService(wpAjaxService, $q, $window) {
	  var service = {
	    getActiveModal: getActiveModal,
	    closeAll: closeAll,
	    updateModal: updateModal,
	    requestSocialData: requestSocialData
	  },
	  activeModal = null;
	
	  return service;
	
	  function getActiveModal() {
	    return activeModal;
	  }
	
	  function closeAll() {
	    activeModal = null;
	  }
	
	  function updateModal(socialId) {
	    if (activeModal !== socialId) {
	      if (null !== activeModal) {
	        $window.frAnalytics.trackEvent('button', 'click', 'share modal closed: ' + activeModal);
	      }
	      $window.frAnalytics.trackEvent('button', 'click', 'share modal open: ' + socialId);
	      activeModal = socialId;
	    } else {
	      $window.frAnalytics.trackEvent('button', 'click', 'share modal closed: ' + socialId);
	      activeModal = null;
	    }
	  }
	
	  function requestSocialData(params) {
	    var d = $q.defer();
	
	    wpAjaxService
	      .request('update_social', params)
	      .success(function(response) {
	        d.resolve(response.data);
	      })
	      .error(function(reason) {
	        d.reject('Error loading social occurred: ' + reason);
	      });
	
	    return d.promise;
	  }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var shareActivatorCtrl = __webpack_require__(2);
	shareActivatorCtrl.$inject = ['$attrs', 'shareService'];
	
	/**
	 * @ngdoc directive
	 * @name shareActivator
	 * @desc Directive for activator of article archive social sharing
	 */
	angular
	  .module('share.module')
	  .directive('shareActivator', shareActivator);
	
	function shareActivator() {
	
	  return {
	    controller: shareActivatorCtrl,
	    controllerAs: 'vm',
	    bindToController: true,
	    template: '<span class="share-activator" ng-click="vm.update()"></span>',
	    scope: {
	      socialId: '@'
	    }
	  };
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	angular
	  .module('site.module', [])
	  .service('siteService', siteService);
	
	siteService.$inject = ['$window'];
	
	/**
	 * @ngdoc service
	 * @name siteService
	 * @desc Service for managing site state
	 */
	
	function siteService($window) {
	  var options = {
	    menu: '',
	    slideshow: false,
	    searchBar: false,
	    newsletter: false
	  },
	  service = {
	    getOptions: getOptions,
	    closeSearch: closeSearch,
	    closeNewsletter: closeNewsletter,
	    closeMenu: closeMenu,
	    updateSlideshow: updateSlideshow,
	    toggleMenu: toggleMenu,
	    toggleSearch: toggleSearch,
	    toggleNewsletter: toggleNewsletter,
	    options: options
	  };
	
	  return service;
	
	  function getOptions() {
	    return options;
	  }
	
	  function updateSlideshow(val) {
	    options.slideshow = val;
	  }
	
	  function closeSearch() {
	    if (options.searchBar) {
	      options.searchBar = false;
	    }
	  }
	
	  function closeNewsletter() {
	    if (options.newsletter) {
	      options.newsletter = false;
	    }
	  }
	
	  function closeMenu() {
	    if (options.menu === 'push') {
	      options.menu = '';
	    }
	  }
	
	  function toggleMenu() {
	    if ( options.menu === '' ) {
	      options.menu = 'push';
	      $window.frAnalytics.trackEvent('button', 'click', 'main menu open');
	    } else {
	      options.menu = '';
	      service.closeSearch();
	      $window.frAnalytics.trackEvent('button', 'click', 'main menu close');
	    }
	  }
	
	  function toggleSearch() {
	    options.searchBar = !options.searchBar;
	    if ( options.searchBar ) {
	      $window.frAnalytics.trackEvent('button', 'click', 'header searchbar open');
	    } else {
	      $window.frAnalytics.trackEvent('button', 'click', 'header searchbar close');
	    }
	
	    // Focus on search input
	    if ( options.searchBar ) {
	      var searchField = document.getElementById('masthead').querySelector('.search-field');
	
	      if (searchField !== null) {
	        searchField.focus();
	      }
	    }
	  }
	
	  function toggleNewsletter() {
	    options.newsletter = !options.newsletter;
	    if ( options.newsletter ) {
	      $window.frAnalytics.trackEvent('button', 'click', 'header newsletter subscribe open');
	    } else {
	      $window.frAnalytics.trackEvent('button', 'click', 'header newsletter subscribe close');
	    }
	    return options.newsletter;
	  }
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc overview
	 * @name foodRepublic
	 * @desc Callback throttling module and service
	 */
	angular
	  .module('throttle.module', [])
	  .service('throttleService', throttleService);
	
	throttleService.$inject = ['$timeout'];
	
	function throttleService($timeout) {
	  var service = {
	    addThrottle: addThrottle,
	    testThrottle: testThrottle,
	    flush: flush
	  },
	  throttles = {};
	
	  return service;
	
	  function addThrottle(fn, id, wait) {
	    /* jshint validthis: true */
	    throttles[id] = {
	      fn: fn,
	      wait: wait,
	      id: id
	    };
	
	    return service.testThrottle.bind(this, throttles[id]);
	  }
	
	  function testThrottle(throttle) {
	    /* jshint validthis: true */
	    if (!throttle.timeout || !angular.isDefined(throttle.timeout)) {
	      throttle.timeout = $timeout(
	        flush.bind(this, throttle),
	        throttle.wait
	      );
	    }
	  }
	
	  function flush(throttle) {
	    throttle.fn.apply(throttle.context, throttle.args);
	    $timeout.cancel(throttle.timeout);
	    throttle.timeout = false;
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc module
	 * @name wpAjaxService
	 * @desc Wrapper for $http to generate properly-formed wpAjax requests
	 */
	angular
	  .module('wpAjax.module', [])
	  .service('wpAjaxService', wpAjaxService);
	
	wpAjaxService.$inject = ['$http', '$location'];
	
	function wpAjaxService($http, $location) {
	  var service = {
	    request: request
	  },
	  requestObj = {},
	  ajaxUrl = $location.protocol() + '://' + $location.host() + '/wp-admin/admin-ajax.php';
	
	  return service;
	
	  function request(action, data) {
	    data = data || {};
	
	    _buildRequest(action, data);
	
	    return $http(requestObj);
	  }
	
	  function _buildRequest(action, data) {
	
	    data = angular.extend({
	      'action': action
	    }, data);
	
	    requestObj = {
	      method: 'POST',
	      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	      transformRequest: _transformRequest,
	      url: ajaxUrl,
	      data: data
	    };
	  }
	
	  function _transformRequest(obj) {
	    var str = [];
	    for (var key in obj) {
	      if (angular.isObject(obj[key])) {
	        for(var idx in obj[key]){
	          var subObj = obj[key][idx];
	          for(var subKey in subObj){
	            str.push(
	              encodeURIComponent(key) +
	              '[' +
	              idx +
	              '][' +
	              encodeURIComponent(subKey) +
	              ']=' +
	              encodeURIComponent(subObj[subKey])
	            );
	          }
	        }
	      } else {
	        str.push(
	          encodeURIComponent(key) +
	          '=' +
	          encodeURIComponent(obj[key])
	        );
	      }
	    }
	    return str.join('&');
	  }
	}


/***/ },
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ function(module, exports) {

	var path = 'modules/image-overlay/imageOverlay.html';
	var html = "<div ng-if=\"vm.checkBreakpoint()\">\n\t<div class=\"overlay-instructions\">{{ vm.overlayTitle }}</div>\n\n\t<ul class=\"overlay-markers\">\n\t\t<li\n\t\t\tng-repeat=\"textItem in vm.overlayText track by $index\"\n\t\t\tng-click=\"vm.calculatePosition(textItem)\"\n\t\t\tng-class=\"{active: textItem == vm.currentTextItem}\"\n\t\t\tstyle=\"left: {{ textItem.x }}px; top: {{ textItem.y }}px;\"\n\t\t>\n\t\t</li>\n\t</ul>\n\n\t<div\n\t\tclass=\"overlay-text\"\n\t\tng-class=\"[vm.position.horizontal, vm.position.vertical]\"\n\t\tng-show=\"vm.currentTextItem\"\n\t\tng-style=\"vm.textStyle\"\n\t>\n\t\t<span class=\"arrow\"></span>\n\t\t<span class=\"text\">{{ vm.currentTextItem.text }}</span>\n\t</div>\n</div>";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 41 */
/***/ function(module, exports) {

	var path = 'modules/sharing/share.html';
	var html = "<div class=\"{{vm.context}}\" ng-class=\"{open: vm.active}\" ng-click=\"vm.trackStatus()\">\n\t<div class=\"overlay\" ng-if=\"'archive' === vm.context\"></div>\n\t<a share-activator social-id=\"{{vm.socialId}}\" ng-if=\"'archive' === vm.context\"></a>\n\t<div class=\"social-nav\">\n\n\t\t<p ng-if=\"'footer' === vm.context\" ng-cloak><strong>Follow</strong></p>\n\t\t<p ng-if=\"'header' === vm.context\" ng-cloak><strong>Follow:</strong></p>\n\n\t\t<ul class=\"pushable\">\n\t\t\t<div class=\"social-expand-wrapper\" ng-class=\"{open: vm.active}\">\n\n\t\t\t\t<li ng-repeat=\"network in vm.notSorted(vm.links)\"\n\t\t\t\t\tng-init=\"info = vm.links[network]\"\n\t\t\t\t\tng-click=\"vm.trackEvent('share', network, vm.socialId)\"\n\t\t\t\t\tng-class=\"{hidden: vm.isHidden($index)}\"\n\t\t\t\t>\n\t\t\t\t\t<a ng-if=\"network !== 'printer'\" ng-href=\"{{ info.link }}\">\n\t\t\t\t\t\t<span class=\"icon-{{ network }}\"></span>\n\t\t\t\t\t\t<span class=\"text\">{{ info.name }}</span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<a ng-if=\"network === 'printer'\" ng-click=\"vm.print()\">\n\t\t\t\t\t\t<span class=\"icon-{{ network }}\"></span>\n\t\t\t\t\t\t<span class=\"text\">{{ info.name }}</span>\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\n\t\t\t\t<li class=\"footer-more\" ng-if=\"'footer' === vm.context\" ng-click=\"vm.footerSocialHide = !vm.footerSocialHide\">\n\t\t\t\t\t<p>More <span ng-class=\"{'icon-chevron-down': vm.footerSocialHide, 'icon-chevron-up': !vm.footerSocialHide}\"></span></p>\n\t\t\t\t</li>\n\t\t\t</div>\n\t\t\t<li ng-if=\"'single' === vm.context || 'slideshow' === vm.context\" ng-click=\"vm.active = !vm.active\">\n\t\t\t\t<span class=\"icon-share\"></span>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ }
]);
//# sourceMappingURL=modules.bundle.js.map