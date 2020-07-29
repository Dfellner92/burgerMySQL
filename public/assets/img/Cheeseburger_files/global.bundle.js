webpackJsonp([5],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @ngdoc overview
	 * @name foodRepublic
	 * @desc Main module of the application.
	 */
	angular
	  .module('foodRepublic', [
	    'ngAnimate',
	    'ngSanitize',
	    'ai.alleySlideshow',
	    'wpAjax.module',
	    'breakpoint.module',
	    'throttle.module',
	    'share.module',
	    'site.module',
	    'imageOverlay.module',
	    'html5Pushdown.module',
	  ])
	  .config(['$locationProvider', function($locationProvider) {
	    $locationProvider.html5Mode({
	      enabled: true,
	      rewriteLinks: false
	    });
	  }]);
	
	__webpack_require__(8);
	__webpack_require__(32);
	__webpack_require__(24);
	__webpack_require__(33);
	__webpack_require__(13);
	__webpack_require__(12);
	__webpack_require__(11);
	__webpack_require__(10);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name articleBody
	 * @desc directive for manipulating article body node and children
	 */
	angular
	  .module('foodRepublic')
	  .directive('articleBody', articleBody);
	
	function articleBody() {
	
	  return {
	    link: link,
	    scope: true
	  };
	
	  function link(scope, elem) {
	    var iframes = elem.find('iframe'),
	    iframeEl;
	
	    angular.forEach(iframes, function(iframe) {
	      iframeEl = angular.element(iframe);
	      if (iframe.src.indexOf('youtube') !== -1 && !iframeEl.parents('.video-wrapper').length) {
	        angular.element(iframe).wrap('<div class="video-wrapper"></div>');
	      }
	    });
	  }
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name headerSearch
	 * @desc directive for controlling searchbar in site header
	 */
	angular
	  .module('foodRepublic')
	  .directive('headerSearch', headerSearch);
	
	headerSearch.$inject = [
	  '$window',
	  '$document',
	  '$interval',
	  'siteService'
	];
	
	controller.$inject = ['siteService'];
	
	function headerSearch($window, $document, $interval, siteService) {
	
	  return {
	    link: link,
	    controller: controller,
	    controllerAs: 'vm',
	    scope: true
	  };
	
	  function link(scope) {
	    var header = document.getElementById('masthead'),
	    searchField = header.querySelector('.search-field');
	
	    // Empty search field of contents when user closes search
	    scope.$watchCollection(
	      siteService.getOptions, function(newVal) {
	        if (!newVal.searchBar && searchField) {
	          searchField.value = '';
	        }
	      });
	  }
	}
	
	function controller(siteService) {
	  /* jshint validthis: true */
	  var vm = this;
	
	  vm.toggleSearch = siteService.toggleSearch;
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name loadMore
	 * @desc Directive for sticking objects to top of screen
	 */
	angular
	  .module('foodRepublic')
	  .directive('loadMore', loadMore);
	
	loadMoreCtrl.$inject = [
	  '$scope',
	  '$attrs',
	  '$element',
	  '$compile',
	  '$rootScope',
	  '$window',
	  'loadMoreService',
	  '$location'
	];
	
	function loadMore() {
	
	  return {
	    scope: true,
	    controller: loadMoreCtrl,
	    controllerAs: 'vm'
	  };
	}
	
	function loadMoreCtrl(
	  $scope,
	  $attrs,
	  $element,
	  $compile,
	  $rootScope,
	  $window,
	  loadMoreService,
	  $location
	) {
	  /* jshint validthis: true */
	  var vm = this,
	    url = false,
	    $loadMoreWrapper,
	    $button,
	    working = false;
	
	  vm.loadMoreContent = loadMoreContent;
	
	  setNextUrl();
	
	  /**
	   * Set the next page URL
	   */
	  function setNextUrl() {
	    $button = $element.find('.load-more');
	
	    if (angular.isDefined($button)) {
	      url = $button.data('url');
	    }
	  }
	
	  /**
	   * Disable the current load more button
	   */
	  function disableButton() {
	    $button.data('value', $button.html());
	    $button.html('<span>Loading...</span>');
	    $button.addClass('disabled');
	  }
	
	  /**
	   * Push the current URL to History
	   */
	  function pushUrlToHistory() {
	    $location.path(url).replace();
	    $window.history.replaceState('', '', $location.absUrl());
	  }
	
	  function loadMoreContent() {
	    if ( working ) {
	      return;
	    } else {
	      working = true;
	    }
	
	    if (url) {
	      disableButton();
	
	      loadMoreService
	        .requestMore(url)
	        .then(function(data) {
	          $button.remove();
	          $loadMoreWrapper = angular.element(data).find('[load-more]');
	
	          if (angular.isDefined($loadMoreWrapper)) {
	            $element.append($loadMoreWrapper.html());
	
	            if (!$button.hasClass('video-load-more')) {
	              pushUrlToHistory();
	            }
	
	            setNextUrl();
	            $window.frAnalytics.trackEvent('button', 'click', 'load more articles');
	            $compile($element.children())($scope);
	            working = false;
	          }
	        });
	    }
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	angular
	  .module('foodRepublic')
	  .factory('loadMoreService', loadMoreService);
	
	loadMoreService.$inject = ['$http', '$q'];
	
	/**
	 * @ngdoc factory
	 * @name loadMoreService
	 * @desc Service for managing load more ajax and container element
	 */
	
	function loadMoreService($http, $q) {
	  return {
	    requestMore: requestMore,
	  };
	
	  function requestMore(url) {
	    var d = $q.defer();
	
	    $http({
	      method: 'POST',
	      url: url
	    })
	      .success(function(response) {
	        d.resolve(response);
	      })
	      .error(function(reason) {
	        d.reject(reason);
	      });
	
	    return d.promise;
	  }
	}


/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @ngdoc loader for scroll directives and service
	 */
	
	__webpack_require__(25);
	__webpack_require__(31);
	__webpack_require__(29);
	__webpack_require__(27);

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc service
	 * @name scrollService
	 * @desc Service for creating scroll handlers and contexts
	 */
	angular
	  .module('foodRepublic')
	  .service('scrollService', scrollService);
	
	function scrollService() {
	  var service = {
	    activateTrigger: activateTrigger,
	    addTarget: addTarget,
	    getTarget: getTarget,
	    getStickIdFromGroup: getStickIdFromGroup,
	    removeTarget: removeTarget,
	    addTrigger: addTrigger,
	    deactivateTrigger: deactivateTrigger,
	    destroyTrigger: destroyTrigger,
	    getActiveTriggers: getActiveTriggers,
	    getTrigger: getTrigger,
	    isTriggerActive: isTriggerActive,
	    removeTrigger: removeTrigger,
	    activateStick: activateStick,
	    deactivateStick: deactivateStick,
	    removeFromStickStack: removeFromStickStack,
	    calculateStack: calculateStack
	  },
	  triggers = [],
	  targets = [],
	  activeTriggers = {},
	  stickStack = [];
	
	  _initStick();
	
	  return service;
	
	  function addTarget(target) {
	    var ids = {};
	    targets.push(target);
	    ids.target = targets.length - 1;
	
	    if (target.level) {
	      stickStack.push(target);
	      ids.stickStack = stickStack.length - 1;
	    } else {
	      ids.stickStack = -1;
	    }
	
	    return ids;
	  }
	
	  function removeTarget(id) {
	    var index = targets.indexOf(id);
	
	    if (index !== -1) {
	      targets.splice(index, 1);
	    }
	  }
	
	  function getTarget(id) {
	    if (targets.indexOf(id) !== -1) {
	      return targets[id];
	    }
	
	    return false;
	  }
	
	  function getStickIdFromGroup(group) {
	    var index = false;
	
	    angular.forEach(stickStack, function(target, idx) {
	      if (target.group === group) {
	        index = idx;
	      }
	    });
	
	    return index;
	  }
	
	  function activateTrigger(id) {
	    var trigger = service.getTrigger(id);
	
	    if (trigger) {
	      if (!angular.isArray(activeTriggers[trigger.group])) {
	        activeTriggers[trigger.group] = [];
	      }
	
	      if (activeTriggers[trigger.group].indexOf(id) === -1) {
	        activeTriggers[trigger.group].push(id);
	      }
	    }
	  }
	
	  function addTrigger(triggerObj) {
	    triggers.push(triggerObj);
	
	    return triggers.length - 1;
	  }
	
	  function deactivateTrigger(id) {
	    var index, trigger = service.getTrigger(id);
	
	    if (trigger && angular.isArray(activeTriggers[trigger.group])) {
	      index = activeTriggers[trigger.group].indexOf(id);
	
	      if (index !== -1) {
	        activeTriggers[trigger.group].splice(index, 1);
	      }
	    }
	  }
	
	  function destroyTrigger(scope, id) {
	    service.removeTrigger(id);
	    scope.$destroy();
	  }
	
	  function getActiveTriggers() {
	    return activeTriggers;
	  }
	
	  function getTrigger(id) {
	    if (angular.isDefined(triggers[id])) {
	      return triggers[id];
	    }
	
	    return false;
	  }
	
	  function isTriggerActive(id) {
	    var trigger = service.getTrigger(id);
	
	    if (trigger && angular.isArray(activeTriggers[trigger.group])) {
	      if (activeTriggers[trigger.group].indexOf(id) !== -1) {
	        return true;
	      }
	    }
	
	    return false;
	  }
	
	  function removeTrigger(id) {
	    var index = triggers.indexOf(id);
	
	    if (-1 !== index) {
	      triggers.splice(index, 1);
	    }
	  }
	
	  function removeFromStickStack(index) {
	    if (angular.isDefined(stickStack[index])) {
	      stickStack.splice(index, 1);
	    }
	  }
	
	  function activateStick(index) {
	    var target = stickStack[index];
	
	    if (angular.isObject(target)) {
	      stickStack[index].stuck = true;
	    }
	  }
	
	  function deactivateStick(index) {
	    if (angular.isObject(stickStack[index])) {
	      stickStack[index].stuck = false;
	    }
	  }
	
	  function calculateStack(index, offset) {
	    var returnVal;
	    offset = offset || false;
	
	    return stickStack.filter(function(x, idx) {
	        returnVal = x.stuck;
	
	        if (returnVal) {
	          if ('inclusive' === offset) {
	            returnVal = x.level <= stickStack[index].level && idx === index;
	          } else {
	            returnVal = x.level < stickStack[index].level;
	          }
	        }
	
	        return returnVal;
	      })
	      .reduce(function(calc, x) {
	        if (angular.isDefined(x.el[0])) {
	          return calc + x.el[0].getBoundingClientRect().height;
	        }
	      }, 0) || 0;
	  }
	
	  function _initStick() {
	    var adminBar = angular.element('#wpadminbar');
	    if (angular.isDefined(adminBar[0])) {
	      service.addTarget({
	        el: adminBar,
	        stuck: true,
	        level: 1,
	        group: 'wp-admin'
	      });
	    }
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = scrollTargetCtrl;
	
	/**
	 * @ngdoc controller
	 * @name scrollTargetCtrl
	 * @desc Controller for site header/menu
	 */
	function scrollTargetCtrl($scope, $window, $elem, $attrs, scrollService, siteService) {
	  /* jshint validthis: true */
	  var vm = this,
	    stickStack = parseInt($attrs.stickStack) || false,
	    targetGroup = $attrs.group,
	    placeholder = $attrs.placeholder || false,
	    targetId,
	    parentClass,
	    $placeholder,
	    latestActiveTrigger,
	    triggerGroup,
	    stickStackKey,
	    stackHeight;
	
	  vm.targetClass = '';
	  vm.menu = '';
	  vm.ingredients = '';
	  vm.newsletter = false;
	  vm.toggleMenu = siteService.toggleMenu;
	  vm.toggleNewsletter = siteService.toggleNewsletter;
	
	  activate();
	
	  function activate() {
	    $scope.$on('trigger:activated', updateTarget);
	
	    $scope.$watchCollection(
	      siteService.getOptions, function(newVal) {
	        angular.extend(vm, newVal);
	      });
	
	    if (stickStack) {
	      $elem.ready(function() {
	        var ids = scrollService.addTarget({
	          el: $elem,
	          stuck: false,
	          level: stickStack,
	          group: targetGroup,
	          placeholder: placeholder
	        });
	
	        targetId = ids.target;
	        stickStackKey = ids.stickStack;
	      });
	    }
	  }
	
	  function updateTarget(event, triggerData) {
	    latestActiveTrigger = scrollService.getTrigger(triggerData.latestActiveTriggerId);
	    triggerGroup = triggerData.group;
	    stackHeight = scrollService.calculateStack(stickStackKey);
	
	    if (triggerGroup === targetGroup) {
	      if (angular.isDefined(latestActiveTrigger) && latestActiveTrigger) {
	        if (vm.targetClass !== latestActiveTrigger.onClass) {
	          vm.targetClass = latestActiveTrigger.onClass;
	
	          if (angular.isDefined(parentClass)) {
	            $elem.parent().removeClass(parentClass);
	          }
	
	          if (latestActiveTrigger.parentClass) {
	            parentClass = latestActiveTrigger.parentClass;
	            $elem.parent().addClass(parentClass);
	          }
	        }
	
	        if (stickStackKey >= 0 && $elem.height() < ($window.innerHeight - stackHeight)) {
	          if ('stick' === latestActiveTrigger.stick) {
	            scrollService.activateStick(stickStackKey);
	            addStick();
	          } else {
	            scrollService.deactivateStick(stickStackKey);
	            removeStick();
	          }
	        }
	      } else {
	        if (stickStackKey >= 0) {
	          scrollService.deactivateStick(stickStackKey);
	          removeStick();
	        }
	        vm.targetClass = '';
	      }
	    }
	  }
	
	  function addStick() {
	    if (placeholder) {
	      if (angular.isUndefined($placeholder)) {
	        $placeholder = angular.element('<div></div>');
	        angular.forEach($elem[0].classList, function(value) {
	          $placeholder.addClass(value);
	        });
	        $placeholder.css({'height': $elem.height()});
	      }
	
	      $elem.after($placeholder);
	    }
	
	    $elem.css({
	      'top': stackHeight + 'px',
	      'position': 'fixed'
	    });
	  }
	
	  function removeStick() {
	    if (placeholder && angular.isDefined($placeholder)) {
	      $placeholder.remove();
	    }
	
	    $elem.css({
	      'top': '',
	      'position': ''
	    });
	  }
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var scrollTargetCtrl = __webpack_require__(26);
	scrollTargetCtrl.$inject = [
	  '$scope',
	  '$window',
	  '$element',
	  '$attrs',
	  'scrollService',
	  'siteService'
	];
	
	/**
	 * @ngdoc directive
	 * @name scrollTarget
	 * @desc Directive for sticking objects to top of screen
	 */
	angular
	  .module('foodRepublic')
	  .directive('scrollTarget', scrollTarget);
	
	function scrollTarget() {
	
	  return {
	    scope: true,
	    controller: scrollTargetCtrl,
	    controllerAs: 'vm'
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = scrollTriggerCtrl;
	
	/**
	 * @ngdoc controller
	 * @name scrollTriggerCtrl
	 * @desc Controller for site header/menu
	 */
	function scrollTriggerCtrl(
	  $scope,
	  $window,
	  $elem,
	  $attrs,
	  scrollService,
	  breakpointService,
	  throttleService
	) {
	  var breakpoint = $attrs.breakpoint || false,
	    offset = $attrs.offset || false,
	    stick = $attrs.stick || false,
	    group = $attrs.group || false,
	    offsetCalc = !isNaN(parseInt(offset)) ? offset : 0,
	    position,
	    triggerId,
	    throttle;
	
	  activate();
	
	  function activate() {
	    triggerId = scrollService.addTrigger({
	      group: group,
	      offset: offset,
	      stick: stick,
	      onClass: $attrs.onClass || false,
	      parentClass: $attrs.parentClass || false
	    });
	    throttle = throttleService.addThrottle(updateOffset, 'offset:' + stick, 50);
	    $scope.$on('window:scrolled', throttle);
	    $scope.$on('window:scrolled', updateTriggerStatus);
	
	    position = $elem[0].getBoundingClientRect().top - offsetCalc;
	    $window.scroll(0, $window.scrollY + 1);
	  }
	
	  function updateOffset() {
	    var index = scrollService.getStickIdFromGroup(group);
	
	    if ((!scrollService.isTriggerActive(triggerId) || 0 === offsetCalc) && index) {
	      if ('bottom' === offset) {
	        offsetCalc = $window.innerHeight;
	      } else {
	        offsetCalc = scrollService.calculateStack(index, offset);
	      }
	    }
	  }
	
	  function updateTriggerStatus() {
	    position = $elem[0].getBoundingClientRect().top - offsetCalc;
	
	    if (!breakpoint || breakpointService.matches(breakpoint)) {
	      if (position < 0 && !scrollService.isTriggerActive(triggerId)) {
	        scrollService.activateTrigger(triggerId);
	      } else if (position > 0 && scrollService.isTriggerActive(triggerId)) {
	        scrollService.deactivateTrigger(triggerId);
	      }
	    }
	  }
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var scrollTriggerCtrl = __webpack_require__(28);
	scrollTriggerCtrl.$inject = [
	  '$scope',
	  '$window',
	  '$element',
	  '$attrs',
	  'scrollService',
	  'breakpointService',
	  'throttleService'
	];
	
	/**
	 * @ngdoc directive
	 * @name scrollTrigger
	 * @desc Directive for sticking objects to top of screen
	 */
	angular
	  .module('foodRepublic')
	  .directive('scrollTrigger', scrollTrigger);
	
	function scrollTrigger() {
	
	  return {
	    controller: scrollTriggerCtrl,
	    scope: true
	  };
	}

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = scrollWatchCtrl;
	
	/**
	 * @ngdoc directive
	 * @name scrollTrigger
	 * @desc Directive for sticking objects to top of screen
	 */
	function scrollWatchCtrl($scope, $element, throttleService, scrollService, siteService) {
	  var triggerData,
	  oldActiveTriggers,
	  throttle;
	
	  activate();
	
	  function activate() {
	    throttle = throttleService.addThrottle(scrolled, 'scroll', 25);
	    $element.on('scroll', throttle);
	  }
	
	  function scrolled() {
	    $scope.$broadcast('window:scrolled');
	    siteService.closeMenu();
	    if (!angular.element(document.activeElement).hasClass('search-field')) {
	      siteService.closeSearch();
	    }
	  }
	
	  $scope.$watch(
	    scrollService.getActiveTriggers, function(newVal, oldVal) {
	      angular.forEach(newVal, function(newActiveTriggers, group) {
	        oldActiveTriggers = oldVal[group];
	
	        if ((angular.isDefined(oldActiveTriggers) &&
	          newActiveTriggers.length !== oldActiveTriggers.length) ||
	          !angular.isDefined(oldActiveTriggers))
	        {
	          triggerData = {
	            latestActiveTriggerId: newActiveTriggers[newActiveTriggers.length - 1],
	            group: group
	          };
	          $scope.$broadcast('trigger:activated', triggerData);
	        }
	      });
	    }, true
	  );
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var scrollWatchCtrl = __webpack_require__(30);
	scrollWatchCtrl.$inject = [
	  '$scope',
	  '$element',
	  'throttleService',
	  'scrollService',
	  'siteService'
	];
	
	/**
	 * @ngdoc directive
	 * @name scrollWatch
	 * @desc Directive for watching scroll of an element and
	 *  broadcasting changes when triggers are reached
	 */
	angular
	  .module('foodRepublic')
	  .directive('scrollWatch', scrollWatch);
	
	function scrollWatch() {
	
	  return {
	    controller: scrollWatchCtrl,
	    scope: true
	  };
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc controller
	 * @name siteCtrl
	 * @desc Conroller for main site navigation
	 */
	angular
	  .module('foodRepublic')
	  .controller('siteCtrl', siteCtrl);
	
	siteCtrl.$inject = [
	  '$scope',
	  '$document',
	  '$window',
	  'siteService',
	  'shareService',
	];
	
	function siteCtrl($scope, $document, $window, siteService, shareService) {
	  /*jshint validthis: true */
	  var vm = this;
	
	  vm.menu = '';
	  vm.slideshow = false;
	  vm.searchBar = false;
	  vm.newsletter = true;
	  vm.stickyNewsletter = false;
	  vm.toggleNewsletter = siteService.toggleNewsletter;
	
	  $scope.$watchCollection(
	    siteService.getOptions, function(newVal) {
	      angular.extend(vm, newVal);
	    });
	
	  $document.on('click', function(e) {
	    var target = angular.element(e.target);
	
	    if (!target.hasClass('menu-toggle') &&
	      !target.hasClass('site-nav') &&
	      !target.parents('.site-nav').length)
	    {
	      siteService.closeMenu();
	    }
	
	    if (!target.parents('div[share]').length &&
	      !target.is('[share-activator]') &&
	      !target.hasClass('share-activator'))
	    {
	      shareService.closeAll();
	    }
	
	    $scope.$digest();
	  });
	
	  
	  jQuery('.fn-toggle-reccomended-modal, .close-recco-modal, .recommended-overlay').on('click', function() {
	    console.log('open recco modal');
	    jQuery('.modal-recommended').toggleClass('open');
	    jQuery('.recommended-overlay').toggleClass('open');
	    jQuery('.recommended-modal-box').toggleClass('open');
	
	  });
	
	
	
	  $document.on('submit', function(e) {
	    var formEl = angular.element(e.srcElement);
	
	    if (angular.isDefined(formEl)) {
	      if (angular.element(e.srcElement).hasClass('newsletter-form')) {
	        $window
	          .frAnalytics
	          .trackEvent('newsletter', 'submit', 'submit newsletter subscription');
	      } else if (angular.element(e.srcElement).hasClass('search-form')) {
	        $window
	          .frAnalytics
	          .trackEvent('search', 'submit', 'submit search query');
	      }
	    }
	  });
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	__webpack_require__(34);
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(39);
	__webpack_require__(38);


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name videoPlayer
	 * @desc directive for entire video player
	 */
	angular
	  .module('foodRepublic')
	  .directive('videoPlayer', videoPlayer);
	
	function videoPlayer() {
	  return {
	    scope: true,
	    controller: videoPlayerCtrl,
	    controllerAs: 'vm'
	  };
	}
	
	videoPlayerCtrl.$inject = [
	  '$scope',
	  '$element',
	  '$attrs',
	  '$sce',
	  'videoPlayerService',
	  '$compile'
	];
	
	/**
	 * @ngdoc controller
	 * @name videoPlayerCtrl
	 * @desc Controller for video player
	 */
	function videoPlayerCtrl($scope, $element, $attrs, $sce, videoPlayerService, $compile) {
	  /*jshint validthis: true */
	  var vm = this,
	    description;
	
	  vm.registerDescription = registerDescription;
	  vm.activateVideo = activateVideo;
	  vm.updatePlayerVideo = updatePlayerVideo;
	  vm.playerEl = $element;
	
	  /**
	   * Attach to event to refresh the video with the latest change
	   *
	   * @param  {Object} event Event object
	   * @param  {Object} $element Element of the current video
	   * @param  {$refScope} Scope Scope of the reference element
	   * @param  {Number} width
	   * @param  {Number} height
	   */
	  $scope.$on('video:refresh', function(event, $element, $refScope, width, height) {
	    // Build new element
	    var $a = angular.element('<div />');
	    $a.attr(vm.videoData.provider + '-player', '');
	    $a.attr('video-id', vm.videoData.id);
	    $a.attr('video-width', width);
	    $a.attr('video-height', height);
	
	    // Replace live element
	    $element.replaceWith( $compile($a)($refScope) );
	    $element.show();
	  });
	
	  function registerDescription(scope) {
	    description = scope;
	  }
	
	  function activateVideo(videoPostId) {
	    videoPlayerService
	      .requestPlayerDescription(videoPostId)
	      .then(function(data) {
	        data.content = $sce.trustAsHtml(data.content);
	        angular.extend(description.vm, data);
	      });
	  }
	
	  function updatePlayerVideo(videoId, provider) {
	    var updateData = {
	      id: videoId,
	      provider: provider
	    };
	
	    $scope.$broadcast('video:updated', updateData);
	  }
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc videoPlayerService
	 * @name videoPlayerService
	 * @desc Service for video player
	 */
	angular
	  .module('foodRepublic')
	  .service('videoPlayerService', videoPlayerService);
	
	videoPlayerService.$inject = ['$rootScope', '$q', '$window', 'wpAjaxService'];
	
	function videoPlayerService($rootScope, $q, $window, wpAjaxService) {
	  var service = {
	    requestPlayerDescription: requestPlayerDescription,
	  };
	
	  return service;
	
	  function requestPlayerDescription(videoPostId) {
	    var d = $q.defer();
	
	    wpAjaxService.request(
	      'update_video_player',
	      {'video_post_id': videoPostId}
	    )
	      .success(function(response) {
	        d.resolve(response.data);
	      })
	      .error(function(response) {
	        d.reject('Error loading video occurred:', response);
	      });
	
	    return d.promise;
	  }
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name videoPlayerDescription
	 * @desc directive for video player container
	 */
	angular
	  .module('foodRepublic')
	  .directive('videoPlayerDescription', videoPlayerDescription);
	
	__webpack_require__(42);
	
	function videoPlayerDescription() {
	  return {
	    scope: true,
	    link: link,
	    controller: function() {},
	    require: '^^videoPlayer',
	    templateUrl: 'video/video-description.html',
	    controllerAs: 'vm'
	  };
	
	  function link(scope, elem, attrs, videoPlayerCtrl) {
	    var descriptionVideoPostId = attrs.videoPostId || false;
	
	    activate();
	
	    function activate() {
	      videoPlayerCtrl.registerDescription(scope);
	
	      if (descriptionVideoPostId) {
	        videoPlayerCtrl.activateVideo( descriptionVideoPostId );
	      }
	    }
	  }
	}


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name videoPlayerVideo
	 * @desc directive for video player container
	 */
	angular
	  .module('foodRepublic')
	  .directive('videoPlayerVideo', videoPlayerVideo);
	
	videoPlayerVideo.$inject = ['$window'];
	
	function videoPlayerVideo() {
	  return {
	    scope: true,
	    link: link,
	    controller: function() {},
	    controllerAs: 'vm',
	    require: '^videoPlayer'
	  };
	
	  function link(scope, elem, attrs, videoPlayerCtrl) {
	    var videoId = attrs.videoId || false,
	      provider = attrs.provider || false,
	      videoPostId = attrs.videoPostId || false,
	      playerEl = videoPlayerCtrl.playerEl,
	      page = angular.element('#page');
	
	    scope.vm.sendToPlayer = sendToPlayer;
	
	    function sendToPlayer($event) {
	      $event.preventDefault();
	      page.scrollTop(playerEl.position().top);
	      videoPlayerCtrl.activateVideo(videoPostId, videoId, provider);
	      videoPlayerCtrl.updatePlayerVideo(videoId, provider);
	    }
	  }
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var froogaloop = __webpack_require__(44);
	
	/**
	 * @ngdoc directive
	 * @name vimeoPlayer
	 * @desc directive for youtube player
	 */
	
	angular
	  .module('foodRepublic')
	  .directive('vimeoPlayer', vimeoPlayer);
	
	controller.$inject = ['$scope', '$element', '$attrs', '$sce'];
	
	function vimeoPlayer() {
	  return {
	    controller: controller,
	    controllerAs: 'vm',
	    bindToController: true,
	    scope: true,
	    template: '<iframe ' +
	            'id="player1" ' +
	            'ng-src="{{ vm.videoUrl }}" ' +
	            'width="{{ vm.width }}" ' +
	            'height="{{ vm.height }}" ' +
	            'frameborder="0" ' +
	            'webkitallowfullscreen ' +
	            'mozallowfullscreen ' +
	            'allowfullscreen> ' +
	        '</iframe>'
	  };
	}
	
	function controller($scope, $element, $attrs, $sce) {
	  /*jshint validthis: true */
	  var vm = this,
	    videoId = $attrs.videoId,
	    iframe = $element.find('iframe')[0],
	    playerReady = false,
	    player;
	
	  vm.height = $attrs.videoHeight;
	  vm.width = $attrs.videoWidth;
	  vm.autoplay = $attrs.videoAutoplay;
	  vm.videoUrl = '';
	
	  activate();
	
	  $scope.$on('video:updated', updatePlayerVideo);
	
	  function activate() {
	    if (!videoId) {
	      $element.hide();
	    } else {
	      vm.videoUrl = buildUrl(videoId, vm.autoplay);
	      initPlayer();
	    }
	  }
	
	  function initPlayer() {
	    player = froogaloop(iframe);
	    player.addEvent('ready', onPlayerReady);
	  }
	
	  function onPlayerReady() {
	    playerReady = true;
	  }
	
	  function buildUrl(id, autoplay) {
	    return $sce.trustAsResourceUrl('https://player.vimeo.com/video/' +
	      id +
	      '?api=1&player_id=player1&autoplay=' +
	      autoplay
	    );
	  }
	
	  function updatePlayerVideo(event, updateData) {
	    var provider = updateData.provider,
	      id = updateData.id;
	
	    if (provider && id && 'vimeo' === provider) {
	      vm.videoUrl = buildUrl(id, vm.autoplay);
	      if (!player) {
	        initPlayer();
	      }
	      if (id === videoId) {
	        player.api('seekTo', 0);
	        player.api('play');
	      }
	      $element.show();
	      videoId = id;
	    } else {
	      vm.videoId = '';
	      $element.hide();
	
	      if (playerReady) {
	        player.api('pause');
	      }
	
	      // Build new element
	      $scope.$emit('video:refresh', $element, $scope, vm.width, vm.height);
	    }
	  }
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @ngdoc directive
	 * @name youtubePlayer
	 * @desc directive for youtube player
	 */
	
	angular
	  .module('foodRepublic')
	  .directive('youtubePlayer', youtubePlayer);
	
	youtubePlayer.$inject = ['$window'];
	
	function youtubePlayer($window) {
	  return {
	    link: link,
	    scope: {},
	    template: '<div class="player"></div>'
	  };
	
	  function link(scope, elem, attrs) {
	    // 2. This code loads the IFrame Player API code asynchronously.
	    var tagLoaded = false,
	      firstScriptTag = document.getElementsByTagName('script')[0],
	      done = false,
	      width = attrs.videoWidth || 'auto',
	      height = attrs.videoHeight || 'auto',
	      videoId = attrs.videoId,
	      autoplay = attrs.videoAutoplay || false,
	      playerReady = false,
	      tag,
	      player;
	
	    activate();
	    scope.$on('video:updated', updatePlayerVideo);
	
	    // 3. This function creates an <iframe> (and YouTube player)
	    //    after the API code downloads.
	    $window.onYouTubeIframeAPIReady = function() {
	      player = new YT.Player(elem.find('.player')[0], {
	        height: height,
	        width: width,
	        videoId: videoId,
	        events: {
	          'onReady': onPlayerReady,
	          'onStateChange': onPlayerStateChange
	        }
	      });
	    };
	
	    function activate() {
	      if (videoId) {
	        loadTag();
	        tagLoaded = true;
	      } else {
	        elem.hide();
	      }
	    }
	
	    /**
	     * Insert the YT iframe script
	     */
	    function loadTag() {
	      tag = document.createElement('script');
	      tag.src = 'https://www.youtube.com/iframe_api';
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	      tagLoaded = true;
	    }
	
	    /**
	     * Update the loaded video
	     */
	    function updatePlayerVideo(event, updateData) {
	      var provider = updateData.provider,
	        id = updateData.id;
	
	      if (provider && id && 'youtube' === updateData.provider) {
	        elem.show();
	        if (!tagLoaded) {
	          videoId = updateData.id;
	          loadTag();
	        } else if (playerReady) {
	          player.loadVideoById(updateData.id);
	        }
	      } else {
	        elem.hide();
	
	        if (playerReady) {
	          player.pauseVideo();
	        }
	
	        // Build new element
	        scope.$emit('video:refresh', elem, scope, width, height);
	      }
	    }
	
	    /**
	     * Called when the YouTube player is ready
	     */
	    function onPlayerReady(event) {
	      playerReady = true;
	      if (autoplay) {
	        event.target.playVideo();
	      }
	    }
	
	    /**
	     * Analytics event binding for YouTube player state changing (play/paused/ended)
	     */
	    function onPlayerStateChange(event) {
	      if (event.data === YT.PlayerState.PLAYING && !done) {
	        done = true;
	      }
	    }
	  }
	}


/***/ },
/* 40 */,
/* 41 */,
/* 42 */
/***/ function(module, exports) {

	var path = 'video/video-description.html';
	var html = "<div class=\"current-description\">\n\t<div ng-if=\"vm.section\" class=\"article-tax\">\n\t\t<span class=\"icon-stop\"></span>\n\t\t<a class=\"tax\" ng-href=\"{{ vm.section.link }}\">{{ vm.section.name }}</a>\n\t</div>\n\n\t<h2 class=\"article-title\">\n\t\t<a ng-if=\"vm.urls.article\" ng-href=\"{{ vm.urls.article }}\" ng-bind-html=\"vm.title\"></a>\n\t\t<span ng-if=\"!vm.urls.article\" ng-bind-html=\"vm.title\"></span>\n\t</h2>\n\n\t<div class=\"article-meta\">\n\t\t<span class=\"byline\">\n\t\t\t<span ng-repeat=\"(i, a) in vm.author\">\n\t\t\t\t<a ng-href=\"{{ a.link }}\" class=\"byline-link\">{{ a.name }}</a>\n\t\t\t\t<span ng-if=\"!$last\">and</span>\n\t\t\t</span>\n\t\t</span>\n\t\t<time datetime=\"{{ vm.time }}\">{{ vm.time }}</time>\n\t</div>\n\n\t<div class=\"body-copy excerpt\" ng-bind-html=\"vm.content\"></div>\n\n\t<a class=\"read-full\" ng-if=\"vm.urls.article\" href=\"{{ vm.urls.article }}\">Read Full Story<span>></span></a>\n\t<span share-activator social-id=\"video\"></span>\n\n\t<div\n\t\tshare\n\t\tcontext=\"archive\"\n\t\tsocial-id=\"video\"\n\t\turl=\"{{ vm.urls.share }}\"\n\t\ttitle=\"{{ vm.title }}\"\n\t\tclass=\"social-modal\"\n\t>\n\t</div>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 43 */,
/* 44 */
/***/ function(module, exports) {

	module.exports = window.Froogaloop;

/***/ }
]);
//# sourceMappingURL=global.bundle.js.map