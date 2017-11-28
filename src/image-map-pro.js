;(function ( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "imageMapPro";
    var default_settings = {
        id: Math.round(Math.random() * 10000) + 1,
        editor: {
            previewMode: 0,
            selected_hotspot: -1,
            tool: 'spot'
        },
        general: {
            name: 'Untitled',
            width: 1050,
            height: 700,
            responsive: 1,
            sticky_tooltips: 0,
            constrain_tooltips: 1,
            image_url: 'img/2.jpg',
            tooltip_animation: 'grow',
            pageload_animation: 'none'
        }, spots: [
            // type (spot, rect, ellipse, poly), x, y, width, height, points(arr)
            // default styles, mouseover styles
        ]
    };
    var default_spot_settings = {
        id: 'spot-0',
        type: 'spot',
        x: 0,
        y: 0,
        width: 44,
        height: 44,
        actions: {
            mouseover: 'show-tooltip',
            click: 'no-action',
            link: '#',
            open_link_in_new_window: 1
        },
        default_style: {
            opacity: 1,
            border_radius: 50,
            background_color: '#000000',
            background_opacity: 0.4,
            border_width: 0,
            border_style: 'solid',
            border_color: '#ffffff',
            border_opacity: 1,

            // poly-specific
            fill: '#000000',
            fill_opacity: 0.4,
            stroke_color: '#ffffff',
            stroke_opacity: 0.75,
            stroke_width: 0,
            stroke_dasharray: '10 10',
            stroke_linecap: 'round',

            // spot-specific
            use_icon: 0,
            icon_type: 'library', // or 'custom'
            icon_svg_path: '',
            icon_svg_viewbox: '',
            icon_fill: '#ffffff',
            icon_url: '',
            icon_is_pin: 0,
            icon_shadow: 0
        },
        mouseover_style: {
            opacity: 1,
            border_radius: 50,
            background_color: '#ffffff',
            background_opacity: 0.4,
            border_width: 0,
            border_style: 'solid',
            border_color: '#ffffff',
            border_opacity: 1,

            // poly-specific
            fill: '#ffffff',
            fill_opacity: 0.4,
            stroke_color: '#ffffff',
            stroke_opacity: 0.75,
            stroke_width: 0,
            stroke_dasharray: '10 10',
            stroke_linecap: 'round'
        },
        tooltip_style: {
            border_radius: 5,
            padding: 20,
            background_color: '#000000',
            background_opacity: 0.9,
            position: 'top',
            width: 300,
            height: 200,
            auto_width: 0,
            auto_height: 1
        },
        text_style: {
            title_color: '#ffffff',
            title_font_size: 18,
            title_font_family: 'sans-serif',
            title_font_weight: 700,
            title_line_height: 24,
            text_color: '#aaaaaa',
            text_font_size: 12,
            text_font_family: 'serif',
            text_font_weight: 300,
            text_line_height: 16
        },
        tooltip_content: {
            title: 'Lorem Ipsum',
            text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
        },
        points: []
    }

    var instance = undefined;

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, default_settings, options);

        this.root = $(element);
        this.wrap = undefined;
        this.hotspotContainer = undefined;
        this.hotspotSvgContainer = undefined;

        // Cache
        this.visibleTooltip = undefined;
        this.activeSpot = undefined;

        this.visibleTooltipWidth = 0;
        this.visibleTooltipHeight = 0;

        this.wrapOffsetLeft = 0;
        this.wrapOffsetTop = 0;
        this.wrapWidth = 0;
        this.wrapHeight = 0;

        this.activeSpotIndex = 0;
        this.activeSpotX = undefined;
        this.activeSpotY = undefined;
        this.activeSpotWidth = undefined;
        this.activeSpotHeight = undefined;

        // Flags
        this.touch = false;

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            instance = this;

            this.id = Math.random()*100;

            // Fill out any missing properties
            for (var i=0; i<self.settings.spots.length; i++) {
                var s = self.settings.spots[i];
                var d = $.extend(true, {}, default_spot_settings);
                s = $.extend(true, d, s);
                self.settings.spots[i] = $.extend(true, {}, s);
            }


            self.root.html('<div class="hs-wrap"></div>');
            self.wrap = self.root.find('.hs-wrap');

            var img = new Image();
            img.src = self.settings.general.image_url;

            self.loadImage(img, function() {
                // Image loading
                //console.log('image loading...');
            }, function() {
                // Image loaded
                //console.log('image loaded');

                var html = '';

                html += '<img  style="'+ self.getImageStyle() +'" src="/Resources/images/Siteplan/BASEART-01.png" id="mainBG" >';
                self.wrap.html(html);
                self.adjustSize();
                self.drawHotspots();
                //self.addTooltips();
                //self.setTooltipSizes();
                //self.events();
                //self.animateHotspotsLoop();

                self.wrapOffsetLeft = self.wrap.offset().left;
                self.wrapOffsetTop = self.wrap.offset().top;
                self.wrapWidth = self.wrap.width();
                self.wrapHeight = self.wrap.height();
            });

            $(window).on('resize', function() {
                self.adjustSize();
                self.wrapOffsetLeft = self.wrap.offset().left;
                self.wrapOffsetTop = self.wrap.offset().top;
                self.wrapWidth = self.wrap.width();
                self.wrapHeight = self.wrap.height();
            });
        },
        loadImage: function(image, cbLoading, cbComplete) {
            if (!image.complete || image.naturalWidth === undefined || image.naturalHeight === undefined) {
                cbLoading();
                $(image).on('load', function() {
                    $(image).off('load');
                    cbComplete();
                });
            } else {
                cbComplete();
            }
        },

        adjustSize: function() {
            var self = this;

            if (parseInt(self.settings.general.responsive, 10) == 1) {
                // get the width of the container
                var containerWidth = self.root.width();
                // If the width of the container is 0, look for the closest parent which has a width
                var el = self.root;
                while (containerWidth == 0) {
                    el = el.parent();
                    containerWidth = el.width();
                    if (el.is('body')) break;
                }

                // get the ratio of the general settings width/height
                var ratio = self.settings.general.width / self.settings.general.height;
                // set the width/height of the wrap
                self.wrap.css({
                    width: containerWidth,
                    height: 'auto'
                });
            } else {
                self.wrap.css({
                    width: self.settings.general.width,
                    height: 'auto',
                });
            }
        },
        getImageStyle: function() {
            var self = this;
            var style = '';

            style += 'width: 100%;';
            style += 'height: 100%;';

            return style;
        },
        drawHotspots: function() {
            var self = this;

            // Make sure spot coordinates are numbers
            for (var i=0; i<self.settings.spots.length; i++) {
                var s = self.settings.spots[i];

                s.x = parseFloat(s.x);
                s.y = parseFloat(s.y);
                s.width = parseFloat(s.width);
                s.height = parseFloat(s.height);
                s.default_style.stroke_width = parseInt(s.default_style.stroke_width);
                s.mouseover_style.stroke_width = parseInt(s.mouseover_style.stroke_width);

                if (s.type == 'poly') {
                    for (var j=0; j<s.points.length; j++) {
                        s.points[j].x = parseFloat(s.points[j].x);
                        s.points[j].y = parseFloat(s.points[j].y);
                    }
                }
            }
            self.settings.general.width = parseInt(self.settings.general.width);
            self.settings.general.height = parseInt(self.settings.general.height);
            self.wrap.prepend('<div class="hs-hotspot-container"></div>');
            self.hotspotContainer = self.wrap.find('.hs-hotspot-container');

            var html = '';
            var hasPolygons = false;
            var svgHtml = '<svg class="hs-poly-svg" viewBox="0 0 '+ self.settings.general.width +' '+ self.settings.general.height +'" preserveAspectRatio="none">';
            for (var i=0; i<self.settings.spots.length; i++) {
                var s = self.settings.spots[i];
                if (s.type == 'spot') {
                    if (parseInt(s.default_style.use_icon, 10) == 1) {
                        var style = '';

                        style += 'left: '+ s.x +'%;';
                        style += 'top: '+ s.y +'%;';
                        style += 'width: '+ s.width +'px;';
                        style += 'height: '+ s.height +'px;';

                        // If the icon is a pin, center it on the bottom edge
                        style += 'margin-left: -'+ s.width/2 +'px;';
                        if (parseInt(s.default_style.icon_is_pin, 10) == 1) {
                            style += 'margin-top: -'+ s.height +'px;';
                        } else {
                            style += 'margin-top: -'+ s.height/2 +'px;';
                        }

                        style += 'background-image: url('+ s.default_style.icon_url +')';
                        style += 'background-position: center;';
                        style += 'background-repeat: no-repeat;';

                        // Page load animations
                        if (self.settings.general.pageload_animation == 'fade') {
                            style += 'opacity: 0;';
                        }
                        if (self.settings.general.pageload_animation == 'grow') {
                            style += 'opacity: ' + s.default_style.opacity + ';';
                            style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                            if (parseInt(s.default_style.icon_is_pin, 10) == 1) {
                                style += 'transform-origin: 50% 100%;-moz-transform-origin: 50% 100%;-webkit-transform-origin: 50% 100%;';
                            }
                        }
                        if (self.settings.general.pageload_animation == 'none') {
                            style += 'opacity: ' + s.default_style.opacity + ';';
                        }

                        html += '<div class="hs-hotspot hs-hotspot-spot" id="'+ s.id +'" style="'+ style +'" data-index='+ i +'>';

                        // Icon
                        if (s.default_style.icon_type == 'library') {
                            html += '   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="'+ s.default_style.icon_svg_viewbox +'" xml:space="preserve" width="'+ s.width +'px" height="'+ s.height +'px">';
                            html += '       <path style="fill:'+ s.default_style.icon_fill +'" d="'+ s.default_style.icon_svg_path +'"></path>';
                            html += '   </svg>';
                        } else {
                            html += '<img src="'+ s.default_style.icon_url +'">';
                        }

                        // Shadow
                        if (parseInt(s.default_style.icon_shadow, 10) == 1) {
                            var shadowStyle = '';

                            shadowStyle += 'width: ' + s.width + 'px;';
                            shadowStyle += 'height: ' + s.height + 'px;';
                            shadowStyle += 'top: '+ s.height/2 +'px;';

                            html += '<div style="'+ shadowStyle +'" class="hs-hotspot-icon-shadow"></div>';
                        }

                        html += '</div>';
                    } else {
                        var style = '';
                        var color_bg = hexToRgb(s.default_style.background_color);
                        var color_border = hexToRgb(s.default_style.border_color);

                        style += 'left: '+ s.x +'%;';
                        style += 'top: '+ s.y +'%;';
                        style += 'width: '+ s.width +'px;';
                        style += 'height: '+ s.height +'px;';
                        style += 'margin-left: -'+ s.width/2 +'px;';
                        style += 'margin-top: -'+ s.height/2 +'px;';

                        style += 'border-radius: ' + s.default_style.border_radius + 'px;';
                        style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                        style += 'border-width: ' + s.default_style.border_width + 'px;';
                        style += 'border-style: ' + s.default_style.border_style + ';';
                        style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';

                        if (self.settings.general.pageload_animation == 'fade') {
                            style += 'opacity: 0;';
                        }
                        if (self.settings.general.pageload_animation == 'grow') {
                            style += 'opacity: ' + s.default_style.opacity + ';';
                            style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                        }
                        if (self.settings.general.pageload_animation == 'none') {
                            style += 'opacity: ' + s.default_style.opacity + ';';
                        }

                        html += '<div class="hs-hotspot hs-hotspot-spot" id="'+ s.id +'" style="'+ style +'" data-index='+ i +'></div>';
                    }
                }
                if (s.type == 'rect') {
                    var style = '';
                    var color_bg = hexToRgb(s.default_style.background_color);
                    var color_border = hexToRgb(s.default_style.border_color);

                    style += 'left: '+ s.x +'%;';
                    style += 'top: '+ s.y +'%;';
                    style += 'width: '+ s.width +'%;';
                    style += 'height: '+ s.height +'%;';

                    style += 'border-radius: ' + s.default_style.border_radius + 'px;';
                    style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                    style += 'border-width: ' + s.default_style.border_width + 'px;';
                    style += 'border-style: ' + s.default_style.border_style + ';';
                    style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';

                    if (self.settings.general.pageload_animation == 'fade') {
                        style += 'opacity: 0;';
                    }
                    if (self.settings.general.pageload_animation == 'grow') {
                        style += 'opacity: ' + s.default_style.opacity + ';';
                        style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                    }
                    if (self.settings.general.pageload_animation == 'none') {
                        style += 'opacity: ' + s.default_style.opacity + ';';
                    }

                    html += '<div class="hs-hotspot hs-hotspot-rect" id="'+ s.id +'" style="'+ style +'" data-index='+ i +'></div>';
                }
                if (s.type == 'oval') {
                    var style = '';
                    var color_bg = hexToRgb(s.default_style.background_color);
                    var color_border = hexToRgb(s.default_style.border_color);

                    style += 'left: '+ s.x +'%;';
                    style += 'top: '+ s.y +'%;';
                    style += 'width: '+ s.width +'%;';
                    style += 'height: '+ s.height +'%;';

                    style += 'border-radius: 50% 50%;';
                    style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                    style += 'border-width: ' + s.default_style.border_width + 'px;';
                    style += 'border-style: ' + s.default_style.border_style + ';';
                    style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';

                    if (self.settings.general.pageload_animation == 'fade') {
                        style += 'opacity: 0;';
                    }
                    if (self.settings.general.pageload_animation == 'grow') {
                        style += 'opacity: ' + s.default_style.opacity + ';';
                        style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                    }
                    if (self.settings.general.pageload_animation == 'none') {
                        style += 'opacity: ' + s.default_style.opacity + ';';
                    }

                    html += '<div class="hs-hotspot hs-hotspot-oval" id="'+ s.id +'" style="'+ style +'" data-index='+ i +'></div>';
                }
                if (s.type == 'poly') {
                    hasPolygons = true;
                    var c_fill = hexToRgb(s.default_style.fill);
                    var c_stroke = hexToRgb(s.default_style.stroke_color);

                    var svgStyle = '';
                    svgStyle += 'width: 100%;';
                    svgStyle += 'height: 100%;';
                    svgStyle += 'fill: rgba('+ c_fill.r +', '+ c_fill.g +', '+ c_fill.b +', '+ s.default_style.fill_opacity +');';
                    svgStyle += 'stroke: rgba('+ c_stroke.r +', '+ c_stroke.g +', '+ c_stroke.b +', '+ s.default_style.stroke_opacity +');';
                    svgStyle += 'stroke-width: ' + s.default_style.stroke_width + 'px;';
                    svgStyle += 'stroke-dasharray: ' + s.default_style.stroke_dasharray + ';';
                    svgStyle += 'stroke-linecap: ' + s.default_style.stroke_linecap + ';';

                    if (self.settings.general.pageload_animation == 'fade') {
                        svgStyle += 'opacity: 0;';
                    }
                    if (self.settings.general.pageload_animation == 'grow') {
                        svgStyle += 'opacity: ' + s.default_style.opacity + ';';
                        svgStyle += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                        var originX = s.x + s.width/2;
                        var originY = s.y + s.height/2;
                        svgStyle += 'transform-origin: '+ originX +'% '+ originY +'%;-moz-transform-origin: '+ originX +'% '+ originY +'%;-webkit-transform-origin: '+ originX +'% '+ originY +'%;';
                    }
                    if (self.settings.general.pageload_animation == 'none') {
                        svgStyle += 'opacity: ' + s.default_style.opacity + ';';
                    }

                    var shapeWidthPx = self.settings.general.width * (s.width/100);
                    var shapeHeightPx = self.settings.general.height * (s.height/100);

                    svgHtml += '           <polygon class="hs-hotspot  hs-hotspot-poly" style="'+ svgStyle +'"  ontouchstart="window.showResults(this.id)" onclick="window.showResults(this.id)" data-index='+ i +' id="'+ s.id +'" points="';

                    s.vs = new Array();
                    for (var j=0; j<s.points.length; j++) {
                        var x = (self.settings.general.width * (s.x/100)) + s.default_style.stroke_width + (s.points[j].x / 100) * (shapeWidthPx - s.default_style.stroke_width*2);
                        var y = (self.settings.general.height * (s.y/100)) + s.default_style.stroke_width + (s.points[j].y / 100) * (shapeHeightPx - s.default_style.stroke_width*2);
                        if(x>0){
                          svgHtml += x + ',' + y + ' ';
                        }else{
                          svgHtml += '0, 0';
                        }


                        // Cache an array of coordinates for later use in mouse events
                        s.vs.push([ x, y ]);
                    }

                    svgHtml += '           "></polygon>';
                }
            }
            svgHtml += '</svg>';

            if (hasPolygons) {
                self.hotspotContainer.html(html + svgHtml);
            } else {
                self.hotspotContainer.html(html);
            }
        },
        addTooltips: function() {
            var self = this;

            var html = '';

            for (var i=0; i<self.settings.spots.length; i++) {
                var s = self.settings.spots[i];
                var style = '';
                var color_bg = hexToRgb(s.tooltip_style.background_color);
                var tooltipBufferPolyClass = (s.type == 'poly') ? 'hs-tooltip-buffer-large' : '';

                style += 'border-radius: '+ s.tooltip_style.border_radius +'px;';
                style += 'padding: '+ s.tooltip_style.padding +'px;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.tooltip_style.background_opacity +');';

                if (self.settings.general.tooltip_animation == 'none') {
                    style += 'opacity: 0;';
                }
                if (self.settings.general.tooltip_animation == 'fade') {
                    style += 'opacity: 0;';
                    style += 'transition-property: opacity;-moz-transition-property: opacity;-webkit-transition-property: opacity;';
                }
                if (self.settings.general.tooltip_animation == 'grow') {
                    style += 'transform: scale(0, 0);-moz-transform: scale(0, 0);-webkit-transform: scale(0, 0);';
                    style += 'transition-property: transform;-moz-transition-property: -moz-transform;-webkit-transition-property: -webkit-transform;';

                    if (s.tooltip_style.position == 'top') {
                        style += 'transform-origin: 50% 100%;-moz-transform-origin: 50% 100%;-webkit-transform-origin: 50% 100%;';
                    }
                    if (s.tooltip_style.position == 'bottom') {
                        style += 'transform-origin: 50% 0%;-moz-transform-origin: 50% 0%;-webkit-transform-origin: 50% 0%;';
                    }
                    if (s.tooltip_style.position == 'left') {
                        style += 'transform-origin: 100% 50%;-moz-transform-origin: 100% 50%;-webkit-transform-origin: 100% 50%;';
                    }
                    if (s.tooltip_style.position == 'right') {
                        style += 'transform-origin: 0% 50%;-moz-transform-origin: 0% 50%;-webkit-transform-origin: 0% 50%;';
                    }
                }

                html += '<div class="hs-tooltip" style="'+ style +'" data-index="'+ i +'">';

                if (s.tooltip_style.position == 'top') {
                    html += '   <div class="hs-arrow hs-arrow-bottom" style="border-top-color: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.tooltip_style.background_opacity +');"></div>';
                    if (parseInt(self.settings.general.sticky_tooltips, 10) == 0) {
                        html += '   <div class="hs-tooltip-buffer hs-tooltip-buffer-bottom '+ tooltipBufferPolyClass +'"></div>';
                    }
                }
                if (s.tooltip_style.position == 'bottom') {
                    html += '   <div class="hs-arrow hs-arrow-top" style="border-bottom-color: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.tooltip_style.background_opacity +');"></div>';
                    if (parseInt(self.settings.general.sticky_tooltips, 10) == 0) {
                        html += '   <div class="hs-tooltip-buffer hs-tooltip-buffer-top '+ tooltipBufferPolyClass +'"></div>';
                    }
                }
                if (s.tooltip_style.position == 'left') {
                    html += '   <div class="hs-arrow hs-arrow-right" style="border-left-color: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.tooltip_style.background_opacity +');"></div>';
                    if (parseInt(self.settings.general.sticky_tooltips, 10) == 0) {
                        html += '   <div class="hs-tooltip-buffer hs-tooltip-buffer-right '+ tooltipBufferPolyClass +'"></div>';
                    }
                }
                if (s.tooltip_style.position == 'right') {
                    html += '   <div class="hs-arrow hs-arrow-left" style="border-right-color: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.tooltip_style.background_opacity +');"></div>';
                    if (parseInt(self.settings.general.sticky_tooltips, 10) == 0) {
                        html += '   <div class="hs-tooltip-buffer hs-tooltip-buffer-left '+ tooltipBufferPolyClass +'"></div>';
                    }
                }

                if (s.tooltip_content.title.length > 0) {
                    var style = '';

                    style += 'color: ' + s.text_style.title_color + ';';
                    style += 'font-size: ' + s.text_style.title_font_size + 'px;';
                    style += 'font-family: ' + s.text_style.title_font_family + ';';
                    style += 'font-weight: ' + s.text_style.title_font_weight + ';';
                    style += 'line-height: ' + s.text_style.title_line_height + 'px;';

                    if (s.tooltip_content.text.length > 0) {
                        style += 'margin-bottom: 20px;';
                    }

                    html += '<h3 style="'+ style +'">'+ s.tooltip_content.title +'</h3>';
                }
                if (s.tooltip_content.text.length > 0) {
                    var style = '';

                    style += 'color: ' + s.text_style.text_color + ';';
                    style += 'font-size: ' + s.text_style.text_font_size + 'px;';
                    style += 'font-family: ' + s.text_style.text_font_family + ';';
                    style += 'font-weight: ' + s.text_style.text_font_weight + ';';
                    style += 'line-height: ' + s.text_style.text_line_height + 'px;';

                    html += '<p style="'+ style +'">'+ s.tooltip_content.text +'</p>';
                }

                html += '</div>';
            }

            self.wrap.prepend(html);
        },
        setTooltipSizes: function() {
            var self = this;

            for (var i=0; i<self.settings.spots.length; i++) {
                var s = self.settings.spots[i];
                var t = self.wrap.find('.hs-tooltip[data-index="'+ i +'"]');

                // Set size
                if (parseInt(s.tooltip_style.auto_width, 10) == 0) {
                    t.css({
                        width: s.tooltip_style.width
                    });
                } else {
                    // Fix the dimentions of the tooltip, because
                    // margins and possition (apparently) causes changes
                    t.css({
                        width: t.outerWidth()
                    });
                }

                if (parseInt(s.tooltip_style.auto_height, 10) == 0) {
                    t.css({
                        height: s.tooltip_style.height
                    });
                } else {
                    // Fix the dimentions of the tooltip, because
                    // margins and possition (apparently) causes changes
                    t.css({
                        height: t.outerHeight()
                    });
                }
            }
        },
        events: function() {
            var self = this;

            $('body').on('touchstart', function() {
                self.touch = true;
            });

            self.wrap.find('.hs-hotspot-spot, .hs-hotspot-rect, .hs-hotspot-oval, .hs-poly-svg polygon').on('mouseover', function(e) {
                if (self.touch) return;
                var p = self.getEventCoordinates(e);

                self.wrapOffsetTop = self.wrap.offset().top;
                self.wrapOffsetLeft = self.wrap.offset().left;
                if (!$(this).hasClass('hs-mouseover')) {
                    $('.hs-mouseover').removeClass('hs-mouseover');
                    $(this).addClass('hs-mouseover');

                    self.unhighlightSpot();
                    self.highlightSpot($(this).data('index'));

                    // Tooltip
                    if (self.settings.spots[self.activeSpotIndex].actions.mouseover == 'show-tooltip') {
                        self.hideTooltip();
                        self.showTooltip(self.activeSpotIndex, p.x, p.y, false);
                    }

                    // Cache for mousemove check
                    var el = $('#'+ self.activeSpot.id);

                    self.activeSpotX = Math.floor(el.offset().left);
                    self.activeSpotY = Math.floor(el.offset().top);
                    self.activeSpotWidth = Math.ceil(el.outerWidth());
                    self.activeSpotHeight = Math.ceil(el.outerHeight());
                }
            });
            self.wrap.find('.hs-hotspot-spot, .hs-hotspot-rect, .hs-hotspot-oval, .hs-poly-svg polygon').on('mouseout', function(e) {
                if (self.touch) return;
                var p = self.getEventCoordinates(e);

                // If the click action of the spot is set to "show-tooltip", do nothing
                if (self.settings.spots[self.activeSpotIndex].actions.click == 'show-tooltip') {
                    return;
                }

                // If sticky tooltips is on, cancel
                if (parseInt(self.settings.general.sticky_tooltips, 10) == 1) return;

                // Does the spot have tooltip on mouseover?
                if (self.settings.spots[self.activeSpotIndex].actions.mouseover == 'show-tooltip') {
                    // If mouse is inside tooltip's rect, then cancel
                    var rx, ry, rw, rh;
                    if (self.activeSpot.tooltip_style.position == 'top') {
                        rx = self.visibleTooltip.offset().left;
                        ry = self.visibleTooltip.offset().top;
                        rw = self.visibleTooltipWidth;
                        rh = self.visibleTooltipHeight + 20;
                    }
                    if (self.activeSpot.tooltip_style.position == 'bottom') {
                        rx = self.visibleTooltip.offset().left;
                        ry = self.visibleTooltip.offset().top - 20;
                        rw = self.visibleTooltipWidth;
                        rh = self.visibleTooltipHeight + 20;
                    }
                    if (self.activeSpot.tooltip_style.position == 'left') {
                        rx = self.visibleTooltip.offset().left;
                        ry = self.visibleTooltip.offset().top;
                        rw = self.visibleTooltipWidth + 20;
                        rh = self.visibleTooltipHeight;
                    }
                    if (self.activeSpot.tooltip_style.position == 'right') {
                        rx = self.visibleTooltip.offset().left - 20;
                        ry = self.visibleTooltip.offset().top;
                        rw = self.visibleTooltipWidth + 20;
                        rh = self.visibleTooltipHeight;
                    }
                    if (isWithinRect(p.x, p.y, rx, ry, rw, rh)) return;

                    // If the spot is a polygon and the mouse is still inside, then return
                    if (self.activeSpot.type == 'poly') {
                        var x = p.x - self.wrapOffsetLeft;
                        var y = p.y - self.wrapOffsetTop;
                        x = (x * self.settings.general.width) / self.wrapWidth;
                        y = (y * self.settings.general.height) / self.wrapHeight;


                        if (isPointInsidePolygon({ x: x, y: y }, self.activeSpot.vs)) return;
                    }
                }

                $('.hs-mouseover').removeClass('hs-mouseover');
                self.unhighlightSpot();
                self.hideTooltip();
            });

            // Tooltip mouseout
            self.wrap.find('.hs-tooltip').on('mouseout', function(e) {
                if (self.touch) return;
                var p = self.getEventCoordinates(e);

                if (!self.settings.spots[self.activeSpotIndex]) {
                    return;
                }

                // If the click action of the spot is set to "show-tooltip", do nothing
                if (self.settings.spots[self.activeSpotIndex].actions.click == 'show-tooltip') {
                    return;
                }

                // If the event is outside the tooltip rect
                // including the buffer
                var rx = $(this).offset().left, ry = $(this).offset().top, rw = $(this).outerWidth(), rh = $(this).outerHeight();
                var s = self.settings.spots[$(this).data('index')];

                if (s.tooltip_style.position == 'top') {
                    rh += 20;
                }
                if (s.tooltip_style.position == 'bottom') {
                    ry -= 20;
                    rh += 20
                }
                if (s.tooltip_style.position == 'left') {
                    rw += 20;
                }
                if (s.tooltip_style.position == 'right') {
                    rx -= 20;
                    rw += 20;
                }

                if (!isWithinRect(p.x, p.y, rx, ry, rw, rh)) {
                    $('.hs-mouseover').removeClass('hs-mouseover');
                    self.unhighlightSpot();
                    self.hideTooltip();
                }
            });

            // Sticky tooltips
            if (parseInt(self.settings.general.sticky_tooltips, 10) == 1) {
                self.wrap.on('mousemove', function(e) {
                    if (self.touch) return;
                    if (self.activeSpot) {
                        var p = self.getEventCoordinates(e);
                        if (self.visibleTooltip && self.activeSpot.actions.mouseover == 'show-tooltip') {
                            // Update tooltip position
                            var sx = p.x - self.wrapOffsetLeft;
                            var sy = p.y - self.wrapOffsetTop;
                            var sw = 0;
                            var sh = 0;

                            self.updateTooltipPosition(self.visibleTooltip, self.visibleTooltipWidth, self.visibleTooltipHeight, sx, sy, sw, sh, 20);
                        }

                        // Check if the mouse is still inside the hotspot
                        // If not, hide the tooltip
                        if (self.activeSpot.type == 'poly') {
                            var x = p.x - self.wrapOffsetLeft;
                            var y = p.y - self.wrapOffsetTop;
                            x = (x * self.settings.general.width) / self.wrapWidth;
                            y = (y * self.settings.general.height) / self.wrapHeight;
                            if (isPointInsidePolygon({ x: x, y: y }, self.activeSpot.vs)) return;
                        } else {
                            if (isWithinRect(p.x, p.y, self.activeSpotX, self.activeSpotY, self.activeSpotWidth, self.activeSpotHeight)) return;
                        }

                        $('.hs-mouseover').removeClass('hs-mouseover');
                        self.unhighlightSpot();
                        self.hideTooltip();
                    }
                });
            }

            // Click actions
            self.wrap.find('.hs-hotspot-spot, .hs-hotspot-rect, .hs-hotspot-oval, .hs-poly-svg polygon').on('click', function(e) {
                if (self.touch) return;
                var s = self.settings.spots[$(this).data('index')];
                if (s.actions.click == 'follow-link') {
                    if (parseInt(s.actions.open_link_in_new_window) == 1) {
                        window.open(s.actions.link, '_blank');
                    } else {
                        window.location = s.actions.link;
                    }
                }
                if (s.actions.click == 'show-tooltip') {
                    self.hideTooltip();
                    self.showTooltip(self.activeSpotIndex, 0, 0, true);
                }

            });

            self.wrap.on('click', function(e) {
                if (self.touch) return;
                if ($(e.target).hasClass('hs-hotspot-container') || $(e.target).is('svg')) {
                    $('.hs-mouseover').removeClass('hs-mouseover');
                    self.unhighlightSpot();
                    self.hideTooltip();
                }
            });

            // Touch events
            self.wrap.find('.hs-hotspot-spot, .hs-hotspot-rect, .hs-hotspot-oval, .hs-poly-svg polygon').on('touchstart', function(e) {
                self.touch = true;
                var p = self.getEventCoordinates(e);
                self.wrapOffsetTop = self.wrap.offset().top;
                self.wrapOffsetLeft = self.wrap.offset().left;

                if (!$(this).hasClass('hs-mouseover')) {
                    $('.hs-mouseover').removeClass('hs-mouseover');
                    $(this).addClass('hs-mouseover');

                    self.unhighlightSpot();
                    self.highlightSpot($(this).data('index'));

                    // Tooltip
                    if (self.settings.spots[self.activeSpotIndex].actions.mouseover == 'show-tooltip') {
                        self.hideTooltip();
                        self.showTooltip(self.activeSpotIndex, p.x, p.y, false);
                    }

                    // Cache for mousemove check
                    var el = $('#'+ self.activeSpot.id);

                    self.activeSpotX = Math.floor(el.offset().left);
                    self.activeSpotY = Math.floor(el.offset().top);
                    self.activeSpotWidth = Math.ceil(el.outerWidth());
                    self.activeSpotHeight = Math.ceil(el.outerHeight());
                }

                return false;
            });
            self.wrap.on('touchmove', function(e) {
                self.touch = true;
                var p = self.getEventCoordinates(e);

                var touchIsInsideASpot = false;
                for (var i=0; i<self.settings.spots.length; i++) {
                    var s = self.settings.spots[i];

                    if (s.type == 'poly') {
                        var x = p.x - self.wrapOffsetLeft;
                        var y = p.y - self.wrapOffsetTop;
                        x = (x * self.settings.general.width) / self.wrapWidth;
                        y = (y * self.settings.general.height) / self.wrapHeight;

                        if (isPointInsidePolygon({ x: x, y: y }, s.vs)) {
                            // Show
                            self.unhighlightSpot();
                            self.highlightSpot(i);

                            self.hideTooltip();
                            if (s.actions.mouseover == 'show-tooltip') {
                                self.showTooltip(i, p.x, p.y, false);
                            }

                            touchIsInsideASpot = true;
                            break;
                        }
                    } else {
                        var spotEl = $('#' + s.id);
                        var x = spotEl.offset().left;
                        var y = spotEl.offset().top;
                        var w = spotEl.outerWidth();
                        var h = spotEl.outerHeight();
                        if (isWithinRect(p.x, p.y, x, y, w, h)) {
                            // Show
                            self.unhighlightSpot();
                            self.highlightSpot(i);

                            self.hideTooltip();
                            if (s.actions.mouseover == 'show-tooltip') {
                                self.showTooltip(i, p.x, p.y, false);
                            }

                            touchIsInsideASpot = true;
                            break;
                        }
                    }


                }

                // If no spot was highlighted, unhighlight the current one
                if (!touchIsInsideASpot) {
                    self.unhighlightSpot();
                    self.hideTooltip();
                }

                // If sticky tooltips are ON and a spot is highlighted, update tooltip position
                if (self.visibleTooltip && self.activeSpot.actions.mouseover == 'show-tooltip' && parseInt(self.settings.general.sticky_tooltips, 10) == 1) {
                    // Update tooltip position
                    var sx = p.x - self.wrapOffsetLeft;
                    var sy = p.y - self.wrapOffsetTop;
                    var sw = 0;
                    var sh = 0;

                    self.updateTooltipPosition(self.visibleTooltip, self.visibleTooltipWidth, self.visibleTooltipHeight, sx, sy, sw, sh, 20);
                }
            });
            self.wrap.find('.hs-hotspot-spot, .hs-hotspot-rect, .hs-hotspot-oval, .hs-poly-svg polygon').on('touchend', function(e) {
                var s = self.settings.spots[$(this).data('index')];
                if (s.actions.click == 'follow-link') {
                    if (parseInt(s.actions.open_link_in_new_window) == 1) {
                        window.open(s.actions.link, '_blank');
                    } else {
                        window.location = s.actions.link;
                    }
                }
                if (s.actions.click == 'show-tooltip') {
                    self.hideTooltip();
                    if (self.activeSpotIndex != undefined) {
                        self.showTooltip(self.activeSpotIndex, 0, 0, true);
                    }
                }
                return false;
            });
            self.wrap.on('touchend', function(e) {
                if ($(e.target).hasClass('hs-hotspot-container') || $(e.target).is('svg')) {
                    $('.hs-mouseover').removeClass('hs-mouseover');
                    self.unhighlightSpot();
                    self.hideTooltip();
                }
                return false;
            });

            // Button support
            $(document).on('click', '[data-open-spot]', function() {
                var id = $(this).data('open-spot');
                // Find the index of spot
                for (var i=0; i<self.settings.spots.length; i++) {
                    var s = self.settings.spots[i];
                    if (s.id == id) {
                        self.hideTooltip();
                        self.unhighlightSpot();

                        self.highlightSpot(i);
                        if (s.actions.mouseover == 'show-tooltip' || s.actions.click == 'show-tooltip') {
                            self.showTooltip(i, 0, 0, true);
                        }
                    }
                }
            });
        },
        animateHotspotsLoop: function() {
            var self = this;

            if (self.settings.general.pageload_animation == 'none') return;

            var interval = 750 / self.settings.spots.length;
            var hotspotsRandomOrderArray = shuffle(self.settings.spots.slice());

            for (var i=0; i<hotspotsRandomOrderArray.length; i++) {
                self.animateHotspot(hotspotsRandomOrderArray[i], interval * i);
            }
        },
        animateHotspot: function(hotspot, delay) {
            var self = this;
            var spotEl = $('#' + hotspot.id);

            setTimeout(function() {
                if (self.settings.general.pageload_animation == 'fade') {
                    spotEl.css({
                        opacity: hotspot.default_style.opacity
                    });
                }
                if (self.settings.general.pageload_animation == 'grow') {
                    spotEl.css({
                        transform: 'scale(1, 1)',
                        '-moz-transform': 'scale(1, 1)',
                        '-webkit-transform': 'scale(1, 1)'
                    });
                }
            }, delay);
        },

        getEventCoordinates: function(e) {
            var self = this;
            var x, y;
            if (self.touch) {
                x = e.originalEvent.touches[0].pageX;
                y = e.originalEvent.touches[0].pageY;
            } else {
                x = e.pageX;
                y = e.pageY;
            }
            return { x: x, y: y };
        },
        applyMouseoverStyles: function(i) {
            var self = this;

            var s = self.settings.spots[i];

            // If it's an icon, return
            if (s.type == 'spot' && parseInt(s.default_style.use_icon, 10) == 1) return;

            var el = $('#' + s.id);

            var style = '';

            if (s.type == 'spot' && parseInt(s.default_style.use_icon, 10) == 0) {
                var color_bg = hexToRgb(s.mouseover_style.background_color);
                var color_border = hexToRgb(s.mouseover_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'px;';
                style += 'height: '+ s.height +'px;';
                style += 'margin-left: -'+ s.width/2 +'px;';
                style += 'margin-top: -'+ s.height/2 +'px;';

                style += 'opacity: ' + s.mouseover_style.opacity + ';';
                style += 'border-radius: ' + s.mouseover_style.border_radius + 'px;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.mouseover_style.background_opacity +');';
                style += 'border-width: ' + s.mouseover_style.border_width + 'px;';
                style += 'border-style: ' + s.mouseover_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.mouseover_style.border_opacity +');';
            }
            if (s.type == 'rect') {
                var color_bg = hexToRgb(s.mouseover_style.background_color);
                var color_border = hexToRgb(s.mouseover_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'%;';
                style += 'height: '+ s.height +'%;';

                style += 'opacity: ' + s.mouseover_style.opacity + ';';
                style += 'border-radius: ' + s.mouseover_style.border_radius + 'px;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.mouseover_style.background_opacity +');';
                style += 'border-width: ' + s.mouseover_style.border_width + 'px;';
                style += 'border-style: ' + s.mouseover_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.mouseover_style.border_opacity +');';
            }
            if (s.type == 'oval') {
                var color_bg = hexToRgb(s.mouseover_style.background_color);
                var color_border = hexToRgb(s.mouseover_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'%;';
                style += 'height: '+ s.height +'%;';

                style += 'opacity: ' + s.mouseover_style.opacity + ';';
                style += 'border-radius: 50% 50%;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.mouseover_style.background_opacity +');';
                style += 'border-width: ' + s.mouseover_style.border_width + 'px;';
                style += 'border-style: ' + s.mouseover_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.mouseover_style.border_opacity +');';
            }
            if (s.type == 'poly') {
                var c_fill = hexToRgb(s.mouseover_style.fill);
                var c_stroke = hexToRgb(s.mouseover_style.stroke_color);

                style += 'opacity: ' + s.mouseover_style.opacity + ';';
                style += 'fill: rgba('+ c_fill.r +', '+ c_fill.g +', '+ c_fill.b +', '+ s.mouseover_style.fill_opacity +');';
                style += 'stroke: rgba('+ c_stroke.r +', '+ c_stroke.g +', '+ c_stroke.b +', '+ s.mouseover_style.stroke_opacity +');';
                style += 'stroke-width: ' + s.mouseover_style.stroke_width + 'px;';
                style += 'stroke-dasharray: ' + s.mouseover_style.stroke_dasharray + ';';
                style += 'stroke-linecap: ' + s.mouseover_style.stroke_linecap + ';';
            }

            el.attr('style', style);
        },
        applyDefaultStyles: function(i) {
            var self = this;
            var s = self.settings.spots[i];

            // If it's an icon, return
            if (s.type == 'spot' && parseInt(s.default_style.use_icon, 10) == 1) return;

            var el = $('#' + s.id);
            var style = '';

            if (s.type == 'spot' && parseInt(s.default_style.use_icon, 10) == 0) {
                var color_bg = hexToRgb(s.default_style.background_color);
                var color_border = hexToRgb(s.default_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'px;';
                style += 'height: '+ s.height +'px;';
                style += 'margin-left: -'+ s.width/2 +'px;';
                style += 'margin-top: -'+ s.height/2 +'px;';

                style += 'opacity: ' + s.default_style.opacity + ';';
                style += 'border-radius: ' + s.default_style.border_radius + 'px;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                style += 'border-width: ' + s.default_style.border_width + 'px;';
                style += 'border-style: ' + s.default_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';
            }
            if (s.type == 'rect') {
                var color_bg = hexToRgb(s.default_style.background_color);
                var color_border = hexToRgb(s.default_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'%;';
                style += 'height: '+ s.height +'%;';

                style += 'opacity: ' + s.default_style.opacity + ';';
                style += 'border-radius: ' + s.default_style.border_radius + 'px;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                style += 'border-width: ' + s.default_style.border_width + 'px;';
                style += 'border-style: ' + s.default_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';
            }
            if (s.type == 'oval') {
                var color_bg = hexToRgb(s.default_style.background_color);
                var color_border = hexToRgb(s.default_style.border_color);

                style += 'left: '+ s.x +'%;';
                style += 'top: '+ s.y +'%;';
                style += 'width: '+ s.width +'%;';
                style += 'height: '+ s.height +'%;';

                style += 'opacity: ' + s.default_style.opacity + ';';
                style += 'border-radius: 50% 50%;';
                style += 'background: rgba('+ color_bg.r +', '+ color_bg.g +', '+ color_bg.b +', '+ s.default_style.background_opacity +');';
                style += 'border-width: ' + s.default_style.border_width + 'px;';
                style += 'border-style: ' + s.default_style.border_style + ';';
                style += 'border-color: rgba('+ color_border.r +', '+ color_border.g +', '+ color_border.b +', '+ s.default_style.border_opacity +');';
            }
            if (s.type == 'poly') {
                var c_fill = hexToRgb(s.default_style.fill);
                var c_stroke = hexToRgb(s.default_style.stroke_color);

                style += 'opacity: ' + s.default_style.opacity + ';';
                style += 'fill: rgba('+ c_fill.r +', '+ c_fill.g +', '+ c_fill.b +', '+ s.default_style.fill_opacity +');';
                style += 'stroke: rgba('+ c_stroke.r +', '+ c_stroke.g +', '+ c_stroke.b +', '+ s.default_style.stroke_opacity +');';
                style += 'stroke-width: ' + s.default_style.stroke_width + 'px;';
                style += 'stroke-dasharray: ' + s.default_style.stroke_dasharray + ';';
                style += 'stroke-linecap: ' + s.default_style.stroke_linecap + ';';
            }

            el.attr('style', style);
        },

        highlightSpot: function(i) {
            var self = this;
            self.activeSpotIndex = i;
            self.activeSpot = self.settings.spots[self.activeSpotIndex];
            self.applyMouseoverStyles(self.activeSpotIndex);
        },
        unhighlightSpot: function() {
            var self = this;
            if (self.activeSpotIndex == undefined) return;
            self.applyDefaultStyles(self.activeSpotIndex);
            self.activeSpot = undefined;
            self.activeSpotIndex = undefined;
        },

        showTooltip: function(i, ex, ey, ignoreStickyTooltips) {
            var self = this;

            self.visibleTooltip = self.wrap.find('.hs-tooltip[data-index="'+ i +'"]');
            var s = self.settings.spots[i];

            var sw, sh, sx, sy;
            if (parseInt(self.settings.general.sticky_tooltips, 10) == 1 && !ignoreStickyTooltips) {
                // Sticky tooltips
                // Set width/height of the spot to 0
                // and X and Y to the mouse coordinates
                sx = ex - self.wrapOffsetLeft;
                sy = ey - self.wrapOffsetTop;
                sw = 0;
                sh = 0;
            } else {
                // Calculate the position and dimentions of the spot
                if (s.type == 'spot') {
                    sw = s.width;
                    sh = s.height;
                    sx = ((Math.round(s.x*10)/10)/100)*self.wrap.width() - sw/2;
                    sy = ((Math.round(s.y*10)/10)/100)*self.wrap.height() - sh/2;
                } else {
                    sw = (s.width/100)*self.wrap.width();
                    sh = (s.height/100)*self.wrap.height();
                    sx = ((Math.round(s.x*10)/10)/100)*self.wrap.width();
                    sy = ((Math.round(s.y*10)/10)/100)*self.wrap.height();
                }
            }

            self.visibleTooltipWidth = self.visibleTooltip.outerWidth();
            self.visibleTooltipHeight = self.visibleTooltip.outerHeight();

            self.updateTooltipPosition(self.visibleTooltip, self.visibleTooltipWidth, self.visibleTooltipHeight, sx, sy, sw, sh, 20);
            self.visibleTooltip.addClass('hs-tooltip-visible');
        },
        hideTooltip: function() {
            var self = this;
            $('.hs-tooltip-visible').removeClass('hs-tooltip-visible');
            self.visibleTooltip = undefined;
        },
        updateTooltipPosition: function(t, tw, th, sx, sy, sw, sh, p) {
            // t = tooltip element
            // tw/th = tooltip width/height
            // sx/sy/sw/sh = spot x/y/width/height
            var self = this;

            // Calculate and set the position
            var x, y;
            if (self.activeSpot.tooltip_style.position == 'left') {
                x = sx - tw - p;
                y = sy + sh/2 - th/2;
            }
            if (self.activeSpot.tooltip_style.position == 'right') {
                x = sx + sw + p;
                y = sy + sh/2 - th/2;
            }
            if (self.activeSpot.tooltip_style.position == 'top') {
                x = sx + sw/2 - tw/2
                y = sy - th - p;
            }
            if (self.activeSpot.tooltip_style.position == 'bottom') {
                x = sx + sw/2 - tw/2;
                y = sy + sh + p;
            }

            // If the spot is a pin, offset it to the top
            if (self.activeSpot.type == 'spot' && parseInt(self.activeSpot.default_style.icon_is_pin, 10) == 1) {
                y -= sh/2;
            }

            var pos = { x: x, y: y };
            if (parseInt(self.settings.general.constrain_tooltips, 10) == 1) {
                pos = fitRectToScreen(x + self.wrapOffsetLeft, y + self.wrapOffsetTop, tw, th);
                pos.x -= self.wrapOffsetLeft;
                pos.y -= self.wrapOffsetTop;
            }

            t.css({
                left: pos.x,
                top: pos.y
            });
        },
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
        });
    };

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function isWithinRect(x, y, rx, ry, rw, rh) {
        if (x>=rx && x<=rx+rw && y>=ry && y<=ry+rh) return true;
        return false;
    }
    function isPointInsidePolygon(point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var x = point.x, y = point.y;

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }
    function fitRectToScreen(x, y, w, h) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > $(document).width() - w) x = $(document).width() - w;
        if (y > $(document).height() - h) y = $(document).height() - h;

        return { x: x, y: y };
    }
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // API
    $.image_map_pro_highlight_spot = function(i) {
        if (!instance) return;
        instance.unhighlightSpot();
        instance.hideTooltip();
        instance.highlightSpot(i);
        instance.showTooltip(i, 0, 0, true);
    }

})( jQuery, window, document );
