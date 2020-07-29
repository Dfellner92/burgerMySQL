/**
 * Google Analytics minfied loading code for analytics
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');


( function( $ ) {
  var frAnalytics = {};

  /**
   * Maps $dimensions from tracking
   * data to actual dimensions
   */
  frAnalytics.dimensionMapping = {
    'tag': 'dimension7',
    'author': 'dimension2',
    'context': 'dimension1', // Maps to page type
    'date': 'dimension6',
    'topics': 'dimension8',
    'sections': 'dimension3',
    'campaign': 'dimension9'
  };
  frAnalytics.init = init;
  frAnalytics.buildOutboundLinkTracking = buildOutboundLinkTracking;
  frAnalytics.pageView = pageView;
  frAnalytics.setDimensions = setDimensions;
  frAnalytics.trackEvent = trackEvent;
  frAnalytics.trackOutbound = trackOutbound;

  frAnalytics.init();

  /**
   * Inits the object and constructs it
   * @return void
   */
  function init() {
    this.data = JSON.parse( trackingData );

    ga( 'create', this.data.id, 'auto' );
    this.setDimensions();
    this.pageView();
    this.buildOutboundLinkTracking();

    window.frAnalytics = this;
  }

  /**
   * Set custom dimensions into GA, order dimensions
   * via this.dimensionMapping
   * @return void
   */
  function setDimensions() {
    var _this = this; // Localize!

    if (undefined !== this.data.dimensions) {
      $.each( this.data.dimensions, function( key, dimension ) {
        ga( 'set', _this.dimensionMapping[ key ], dimension );
      } );
    }
  }

  /**
   * Send page view
   * @return void
   */
  function pageView() {
    ga( 'send', 'pageview' );
  }

  /**
   * Track custom events
   * @param  {string} category [example: 'button', 'scroll', or 'form']
   * @param  {string} action   [example: 'click', 'scroll', or 'key press']
   * @param  {string} label    [example: 'nav buttons', 'slideshow open', or 'slideshow close']
   * @return void
   */
  function trackEvent( category, action, label ) {
    ga( 'send', 'event', category, action, label );
  }

  /**
   * Track outbound links
   * @param  {string} url [url of the link]
   * @return void
   */
  function trackOutbound( url ) {
    ga( 'send', 'event', 'outbound', 'click', url, {transport: 'beacon'} );
  }

  /**
   * Attach tracking to outbound links
   * @return void
   */
  function buildOutboundLinkTracking() {
    var _this = this;

    $( 'a[href]' ).each( function() {
      if( this.href.indexOf( location.host ) < 0 ) {
        $( this ).on( 'click', function() {
          _this.trackOutbound( this.href );
        } );
      }
    } );
  }

} )( jQuery );
