/*!
 *  * dragtable
 *   *
 *    * @Version 2.0.15
 *     *
 *      * Copyright (c) 2010-2013, Andres akottr@gmail.com
 *       * Dual licensed under the MIT (MIT-LICENSE.txt)
 *        * and GPL (GPL-LICENSE.txt) licenses.
 *         *
 *          * Inspired by the the dragtable from Dan Vanderkam (danvk.org/dragtable/)
 *           * Thanks to the jquery and jqueryui comitters
 *            *
 *             * Any comment, bug report, feature-request is welcome
 *              * Feel free to contact me.
 *               */

/* TOKNOW:
 *  * For IE7 you need this css rule:
 *   * table {
 *    *   border-collapse: collapse;
 *     * }
 *      * Or take a clean reset.css (see http://meyerweb.com/eric/tools/css/reset/)
 *       */

/* TODO: investigate
 *  * Does not work properly with css rule:
 *   * html {
 *    *      overflow: -moz-scrollbars-vertical;
 *     *  }
 *      * Workaround:
 *       * Fixing Firefox issues by scrolling down the page
 *        * http://stackoverflow.com/questions/2451528/jquery-ui-sortable-scroll-helper-element-offset-firefox-issue
 *         *
 *          * var start = $.noop;
 *           * var beforeStop = $.noop;
 *            * if($.browser.mozilla) {
 *             * var start = function (event, ui) {
 *              *               if( ui.helper !== undefined )
 *               *                 ui.helper.css('position','absolute').css('margin-top', $(window).scrollTop() );
 *                *               }
 *                 * var beforeStop = function (event, ui) {
 *                  *              if( ui.offset !== undefined )
 *                   *                ui.helper.css('margin-top', 0);
 *                    *              }
 *                     * }
 *                      *
 *                       * and pass this as start and stop function to the sortable initialisation
 *                        * start: start,
 *                         * beforeStop: beforeStop
 *                          */
/*
 *  * Special thx to all pull requests comitters
 *   */

(function($) {
  $.widget("akottr.dragtable", {
    options: {
      revert: false,               // smooth revert
      dragHandle: '.table-handle', // handle for moving cols, if not exists the whole 'th' is the handle
      maxMovingRows: 40,           // 1 -> only header. 40 row should be enough, the rest is usually not in the viewport
      excludeFooter: false,        // excludes the footer row(s) while moving other columns. Make sense if there is a footer with a colspan. */
      onlyHeaderThreshold: 100,    // TODO:  not implemented yet, switch automatically between entire col moving / only header moving
      dragaccept: null,            // draggable cols -> default all
      persistState: null,          // url or function -> plug in your custom persistState function right here. function call is persistState(originalTable)
      restoreState: null,          // JSON-Object or function:  some kind of experimental aka Quick-Hack TODO: do it better
      exact: true,                 // removes pixels, so that the overlay table width fits exactly the original table width
      clickDelay: 10,              // ms to wait before rendering sortable list and delegating click event
      containment: null,           // @see http://api.jqueryui.com/sortable/#option-containment, use it if you want to move in 2 dimesnions (together with axis: null)
      cursor: 'move',              // @see http://api.jqueryui.com/sortable/#option-cursor
      cursorAt: false,             // @see http://api.jqueryui.com/sortable/#option-cursorAt
      distance: 0,                 // @see http://api.jqueryui.com/sortable/#option-distance, for immediate feedback use "0"
      tolerance: 'pointer',        // @see http://api.jqueryui.com/sortable/#option-tolerance
      axis: 'x',                   // @see http://api.jqueryui.com/sortable/#option-axis, Only vertical moving is allowed. Use 'x' or null. Use this in conjunction with the 'containment' setting
      beforeStart: $.noop,         // returning FALSE will stop the execution chain.
      beforeMoving: $.noop,
      beforeReorganize: $.noop,
      beforeStop: $.noop
    },
    originalTable: {
      el: null,
      selectedHandle: null,
      sortOrder: null,
      startIndex: 0,
      endIndex: 0
    },
    sortableTable: {
      el: $(),
      selectedHandle: $(),
      movingRow: $()
    },
    persistState: function() {
      var _this = this;
      this.originalTable.el.find('th').each(function(i) {
        if (this.id !== '') {
          _this.originalTable.sortOrder[this.id] = i;
        }
      });
      $.ajax({
        url: this.options.persistState,
        data: this.originalTable.sortOrder
      });
    },
    /*
     *      * persistObj looks like
     *           * {'id1':'2','id3':'3','id2':'1'}
     *                * table looks like
     *                     * |   id2  |   id1   |   id3   |
     *                          */
    _restoreState: function(persistObj) {
      for (var n in persistObj) {
        this.originalTable.startIndex = $('#' + n).closest('th').prevAll().length + 1;
        this.originalTable.endIndex = parseInt(persistObj[n], 10) + 1;
        this._bubbleCols();
      }
    },
    // bubble the moved col left or right
    _bubbleCols: function() {
      var i, j, col1, col2;
      var from = this.originalTable.startIndex;
      var to = this.originalTable.endIndex;
      /* Find children thead and tbody.
       * Only to process the immediate tr-children. Bugfix for inner tables
       */
                                                       var thtb = this.originalTable.el.children();
                                                             if (this.options.excludeFooter) {
                                                                     thtb = thtb.not('tfoot');
                                                                           }
                                                                                 if (from < to) {
                                                                                         for (i = from; i < to; i++) {
                                                                                                   col1 = thtb.find('> tr > td:nth-child(' + i + ')')
                                                                                                               .add(thtb.find('> tr > th:nth-child(' + i + ')'));
                                                                                                                         col2 = thtb.find('> tr > td:nth-child(' + (i + 1) + ')')
                                                                                                                                     .add(thtb.find('> tr > th:nth-child(' + (i + 1) + ')'));
                                                                                                                                               for (j = 0; j < col1.length; j++) {
                                                                                                                                                           swapNodes(col1[j], col2[j]);
                                                                                                                                                                     }
                                                                                                                                                                             }
                                                                                                                                                                                   } else {
                                                                                                                                                                                           for (i = from; i > to; i--) {
                                                                                                                                                                                                     col1 = thtb.find('> tr > td:nth-child(' + i + ')')
                                                                                                                                                                                                                 .add(thtb.find('> tr > th:nth-child(' + i + ')'));
                                                                                                                                                                                                                           col2 = thtb.find('> tr > td:nth-child(' + (i - 1) + ')')
                                                                                                                                                                                                                                       .add(thtb.find('> tr > th:nth-child(' + (i - 1) + ')'));
                                                                                                                                                                                                                                                 for (j = 0; j < col1.length; j++) {
                                                                                                                                                                                                                                                             swapNodes(col1[j], col2[j]);
                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                                                                     }
                                                                                                                                                                                                                                                                                         },
                                                                                                                                                                                                                                                                                             _rearrangeTableBackroundProcessing: function() {
                                                                                                                                                                                                                                                                                                   var _this = this;
                                                                                                                                                                                                                                                                                                         return function() {
                                                                                                                                                                                                                                                                                                                 _this._bubbleCols();
                                                                                                                                                                                                                                                                                                                         _this.options.beforeStop(_this.originalTable);
                                                                                                                                                                                                                                                                                                                                 _this.sortableTable.el.remove();
                                                                                                                                                                                                                                                                                                                                         restoreTextSelection();
                                                                                           // persist state if necessary
                                                                                                                                                                                                                                                                                                                                                         if (_this.options.persistState !== null) {
                                                                                                                                                                                                                                                                                                                                                                   $.isFunction(_this.options.persistState) ? _this.options.persistState(_this.originalTable) : _this.persistState();
                                                                                                                                                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                                                                                                                                                                 };
                                                                                                                                                                                                                                                                                                                                                                                     },
                                                                                                                                                                                                                                                                                                                                                                                         _rearrangeTable: function() {
                                                                                                                                                                                                                                                                                                                                                                                               var _this = this;
                                                                                                                                                                                                                                                                                                                                                                                                     return function() {
                                                                                           // remove handler-class -> handler is now finished
                                                                                                                                                                                                                                                                                                                                                                                                                     _this.originalTable.selectedHandle.removeClass('dragtable-handle-selected');
                                                                                           // add disabled class -> reorgorganisation starts soon
            _this.sortableTable.el.sortable("disable");
            _this.sortableTable.el.addClass('dragtable-disabled');
            _this.options.beforeReorganize(_this.originalTable, _this.sortableTable);
                                                                                           // do reorganisation asynchronous
                                                                                           // for chrome a little bit more than 1 ms because we want to force a rerender
            _this.originalTable.endIndex = _this.sortableTable.movingRow.prevAll().length + 1;
            setTimeout(_this._rearrangeTableBackroundProcessing(), 50);
          };
  },
                                                                                                                                                                                                                                                                                                                                                                                         /*
                                                                                                                                                                                                                                                                                                                                                                                          * Disrupts the table. The original table stays the same.
                                                                                                                                                                                                                                                                                                                                                                                          * But on a layer above the original table we are constructing a list (ul > li)
                                                                                                                                                                                                                                                                                                                                                                                          * each li with a separate table representig a single col of the original table.
                                                                                                                                                                                                                                                                                                                                                                                          */
                                                                                           _generateSortable: function(e) {
                                                                                             !e.cancelBubble && (e.cancelBubble = true);
                                                                                             var _this = this;
                                                                                             // table attributes
                                                                                             var attrs = this.originalTable.el[0].attributes;
                                                                                             var attrsString = '';
                                                                                             for (var i = 0; i < attrs.length; i++) {
                                                                                               if (attrs[i].nodeValue && attrs[i].nodeName != 'id' && attrs[i].nodeName != 'width') {
                                                                                                 attrsString += attrs[i].nodeName + '="' + attrs[i].nodeValue + '" ';
                                                                                               }
                                                                                             }

                                                                                             // row attributes
                                                                                             var rowAttrsArr = [];
                                                                                             //compute height, special handling for ie needed :-(
                                                                                             var heightArr = [];
                                                                                             this.originalTable.el.find('tr').slice(0, this.options.maxMovingRows).each(function(i, v) {
                                                                                               // row attributes
                                                                                               var attrs = this.attributes;
                                                                                               var attrsString = "";
                                                                                               for (var j = 0; j < attrs.length; j++) {
                                                                                                 if (attrs[j].nodeValue && attrs[j].nodeName != 'id') {
                                                                                                   attrsString += " " + attrs[j].nodeName + '="' + attrs[j].nodeValue + '"';
                                                                                                 }
                                                                                               }
                                                                                               rowAttrsArr.push(attrsString);
                                                                                               heightArr.push($(this).height());
                                                                                             });

                                                                                             // compute width, no special handling for ie needed :-)
                                                                                             var widthArr = [];
                                                                                             // compute total width, needed for not wrapping around after the screen ends (floating)
                                                                                             var totalWidth = 0;
                                                                                             /* Find children thead and tbody.
                                                                                              * Only to process the immediate tr-children. Bugfix for inner tables
                                                                                              */
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             var thtb = _this.originalTable.el.children();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   if (this.options.excludeFooter) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           thtb = thtb.not('tfoot');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       thtb.find('> tr > th').each(function(i, v) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               var w = $(this).is(':visible') ? $(this).outerWidth() : 0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       widthArr.push(w);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               totalWidth += w;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           if(_this.options.exact) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     var difference = totalWidth - _this.originalTable.el.outerWidth();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               widthArr[0] -= difference;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // one extra px on right and left side
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 totalWidth += 2

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       var sortableHtml = '<ul class="dragtable-sortable" style="position:absolute; width:' + totalWidth + 'px;">';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // assemble the needed html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   thtb.find('> tr > th').each(function(i, v) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           var width_li = $(this).is(':visible') ? $(this).outerWidth() : 0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   sortableHtml += '<li style="width:' + width_li + 'px;">';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           sortableHtml += '<table ' + attrsString + '>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   var row = thtb.find('> tr > th:nth-child(' + (i + 1) + ')');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           if (_this.options.maxMovingRows > 1) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     row = row.add(thtb.find('> tr > td:nth-child(' + (i + 1) + ')').slice(0, _this.options.maxMovingRows - 1));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     row.each(function(j) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // TODO: May cause duplicate style-Attribute
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         var row_content = $(this).clone().wrap('<div></div>').parent().html();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   if (row_content.toLowerCase().indexOf('<th') === 0) sortableHtml += "<thead>";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             sortableHtml += '<tr ' + rowAttrsArr[j] + '" style="height:' + heightArr[j] + 'px;">';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       sortableHtml += row_content;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 if (row_content.toLowerCase().indexOf('<th') === 0) sortableHtml += "</thead>";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           sortableHtml += '</tr>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           sortableHtml += '</table>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   sortableHtml += '</li>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               sortableHtml += '</ul>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     this.sortableTable.el = this.originalTable.el.before(sortableHtml).prev();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // set width if necessary
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 this.sortableTable.el.find('> li > table').each(function(i, v) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $(this).css('width', widthArr[i] + 'px');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // assign this.sortableTable.selectedHandle
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           this.sortableTable.selectedHandle = this.sortableTable.el.find('th .dragtable-handle-selected');

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 var items = !this.options.dragaccept ? 'li' : 'li:has(' + this.options.dragaccept + ')';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       this.sortableTable.el.sortable({
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               items: items,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       stop: this._rearrangeTable(),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // pass thru options for sortable widget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       revert: this.options.revert,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               tolerance: this.options.tolerance,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       containment: this.options.containment,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               cursor: this.options.cursor,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       cursorAt: this.options.cursorAt,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               distance: this.options.distance,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       axis: this.options.axis
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // assign start index
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         this.originalTable.startIndex = $(e.target).closest('th').prevAll().length + 1;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               this.options.beforeMoving(this.originalTable, this.sortableTable);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // Start moving by delegating the original event to the new sortable table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           this.sortableTable.movingRow = this.sortableTable.el.find('> li:nth-child(' + this.originalTable.startIndex + ')');

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // prevent the user from drag selecting "highlighting" surrounding page elements
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       disableTextSelection();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // clone the initial event and trigger the sort with it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   this.sortableTable.movingRow.trigger($.extend($.Event(e.type), {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           which: 1,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   clientX: e.clientX,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           clientY: e.clientY,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   pageX: e.pageX,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           pageY: e.pageY,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   screenX: e.screenX,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           screenY: e.screenY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }));

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // Some inner divs to deliver the posibillity to style the placeholder more sophisticated
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             var placeholder = this.sortableTable.el.find('.ui-sortable-placeholder');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   if(!placeholder.height()  <= 0) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           placeholder.css('height', this.sortableTable.el.find('.ui-sortable-helper').height());
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       placeholder.html('<div class="outer" style="height:100%;"><div class="inner" style="height:100%;"></div></div>');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               bindTo: {},
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   _create: function() {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         this.originalTable = {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 el: this.element,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         selectedHandle: $(),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 sortOrder: {},
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         startIndex: 0,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 endIndex: 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // bind draggable to 'th' by default
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   this.bindTo = this.originalTable.el.find('th');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // filter only the cols that are accepted
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               if (this.options.dragaccept) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       this.bindTo = this.bindTo.filter(this.options.dragaccept);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // bind draggable to handle if exists
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         if (this.bindTo.find(this.options.dragHandle).length > 0) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 this.bindTo = this.bindTo.find(this.options.dragHandle);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // restore state if necessary
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   if (this.options.restoreState !== null) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           $.isFunction(this.options.restoreState) ? this.options.restoreState(this.originalTable) : this._restoreState(this.options.restoreState);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       var _this = this;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             this.bindTo.mousedown(function(evt) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // listen only to left mouse click
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             if(evt.which!==1) return;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     if (_this.options.beforeStart(_this.originalTable) === false) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               return;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               clearTimeout(this.downTimer);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       this.downTimer = setTimeout(function() {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 _this.originalTable.selectedHandle = $(this);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           _this.originalTable.selectedHandle.addClass('dragtable-handle-selected');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     _this._generateSortable(evt);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             }, _this.options.clickDelay);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   }).mouseup(function(evt) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           clearTimeout(this.downTimer);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         redraw: function(){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               this.destroy();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     this._create();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             destroy: function() {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   this.bindTo.unbind('mousedown');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $.Widget.prototype.destroy.apply(this, arguments); // default destroy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // now do other stuff particular to this widget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     });

  /** closure-scoped "private" functions **/

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     var body_onselectstart_save = $(document.body).attr('onselectstart'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       body_unselectable_save = $(document.body).attr('unselectable');

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // css properties to disable user-select on the body tag by appending a <style> tag to the <head>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // remove any current document selections

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     function disableTextSelection() {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       // jQuery doesn't support the element.text attribute in MSIE 8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       // http://stackoverflow.com/questions/2692770/style-style-textcss-appendtohead-does-not-work-in-ie
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       var $style = $('<style id="__dragtable_disable_text_selection__" type="text/css">body { -ms-user-select:none;-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;user-select:none; }</style>');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       $(document.head).append($style);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       $(document.body).attr('onselectstart', 'return false;').attr('unselectable', 'on');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       if (window.getSelection) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         window.getSelection().removeAllRanges();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       } else {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         document.selection.empty(); // MSIE http://msdn.microsoft.com/en-us/library/ms535869%28v=VS.85%29.aspx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     }

                                                                                             // remove the <style> tag, and restore the original <body> onselectstart attribute

                                                                                             function restoreTextSelection() {
                                                                                               $('#__dragtable_disable_text_selection__').remove();
                                                                                               if (body_onselectstart_save) {
                                                                                                 $(document.body).attr('onselectstart', body_onselectstart_save);
                                                                                               } else {
                                                                                                 $(document.body).removeAttr('onselectstart');
                                                                                               }
                                                                                               if (body_unselectable_save) {
                                                                                                 $(document.body).attr('unselectable', body_unselectable_save);
                                                                                               } else {
                                                                                                 $(document.body).removeAttr('unselectable');
                                                                                               }
                                                                                             }

                                                                                             function swapNodes(a, b) {
                                                                                               var aparent = a.parentNode;
                                                                                               var asibling = a.nextSibling === b ? a : a.nextSibling;
                                                                                               b.parentNode.insertBefore(a, b);
                                                                                               aparent.insertBefore(b, asibling);
                                                                                             }
                                                                                           })(jQuery);

                                                                                           /**
                                                                                            *  * @author zhixin wen <wenzhixin2010@gmail.com>
                                                                                            *   * extensions: https://github.com/kayalshri/tableExport.jquery.plugin
                                                                                            *    */

                                                                                           (function ($) {
                                                                                             'use strict';
                                                                                             var sprintf = $.fn.bootstrapTable.utils.sprintf;

                                                                                             var TYPE_NAME = {
                                                                                               json: 'JSON',
                                                                                               xml: 'XML',
                                                                                               png: 'PNG',
                                                                                               csv: 'CSV',
                                                                                               txt: 'TXT',
                                                                                               sql: 'SQL',
                                                                                               doc: 'MS-Word',
                                                                                               excel: 'MS-Excel',
                                                                                               xlsx: 'MS-Excel (OpenXML)',
                                                                                               powerpoint: 'MS-Powerpoint',
                                                                                               pdf: 'PDF'
                                                                                             };

                                                                                             $.extend($.fn.bootstrapTable.defaults, {
                                                                                               showExport: false,
                                                                                               exportDataType: 'basic', // basic, all, selected
                                                                                               exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
                                                                                               exportOptions: {}
                                                                                             });

                                                                                             $.extend($.fn.bootstrapTable.defaults.icons, {
                                                                                               export: 'glyphicon-export icon-share'
                                                                                             });

                                                                                             $.extend($.fn.bootstrapTable.locales, {
                                                                                               formatExport: function () {
                                                                                                 return 'Export data';
                                                                                               }
                                                                                             });
                                                                                             $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

                                                                                             var BootstrapTable = $.fn.bootstrapTable.Constructor,
                                                                                               _initToolbar = BootstrapTable.prototype.initToolbar;

                                                                                             BootstrapTable.prototype.initToolbar = function () {
                                                                                               this.showToolbar = this.options.showExport;

                                                                                               _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

                                                                                               if (this.options.showExport) {
                                                                                                 var that = this,
                                                                                                   $btnGroup = this.$toolbar.find('>.btn-group'),
                                                                                                   $export = $btnGroup.find('div.export');

                                                                                                 if (!$export.length) {
                                                                                                   $export = $([
                                                                                                     '<div class="export btn-group">',
                                                                                                     '<button class="btn' +
                                                                                                       sprintf(' btn-%s', this.options.buttonsClass) +
                                                                                                       sprintf(' btn-%s', this.options.iconSize) +
                                                                                                       ' dropdown-toggle" aria-label="export type" ' +
                                                                                                       'title="' + this.options.formatExport() + '" ' +
                                                                                                       'data-toggle="dropdown" type="button">',
                                                                                                     sprintf('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.export),
                                                                                                     '<span class="caret"></span>',
                                                                                                     '</button>',
                                                                                                     '<ul class="dropdown-menu" role="menu">',
                                                                                                     '</ul>',
                                                                                                     '</div>'].join('')).appendTo($btnGroup);

                                                                                                   var $menu = $export.find('.dropdown-menu'),
                                                                                                     exportTypes = this.options.exportTypes;

                                                                                                   if (typeof this.options.exportTypes === 'string') {
                                                                                                     var types = this.options.exportTypes.slice(1, -1).replace(/ /g, '').split(',');

                                                                                                     exportTypes = [];
                                                                                                     $.each(types, function (i, value) {
                                                                                                       exportTypes.push(value.slice(1, -1));
                                                                                                     });
                                                                                                   }
                                                                                                   $.each(exportTypes, function (i, type) {
                                                                                                     if (TYPE_NAME.hasOwnProperty(type)) {
                                                                                                       $menu.append(['<li role="menuitem" data-type="' + type + '">',
                                                                                                         '<a href="javascript:void(0)">',
                                                                                                         TYPE_NAME[type],
                                                                                                         '</a>',
                                                                                                         '</li>'].join(''));
                                                                                                     }
                                                                                                   });

                                                                                                   $menu.find('li').click(function () {
                                                                                                     var type = $(this).data('type'),
                                                                                                       doExport = function () {
                                                                                                         that.$el.tableExport($.extend({}, that.options.exportOptions, {
                                                                                                           type: type,
                                                                                                           escape: false
                                                                                                         }));
                                                                                                       };

                                                                                                     if (that.options.exportDataType === 'all' && that.options.pagination) {
                                                                                                       that.$el.one(that.options.sidePagination === 'server' ? 'post-body.bs.table' : 'page-change.bs.table', function () {
                                                                                                         doExport();
                                                                                                         that.togglePagination();
                                                                                                       });
                                                                                                       that.togglePagination();
                                                                                                     } else if (that.options.exportDataType === 'selected') {
                                                                                                       var data = that.getData(),
                                                                                                         selectedData = that.getAllSelections();

                                                                                                       // Quick fix #2220
                                                                                                       if (that.options.sidePagination === 'server') {
                                                                                                         data = {total: that.options.totalRows};
                                                                                                         data[that.options.dataField] = that.getData();

                                                                                                         selectedData = {total: that.options.totalRows};
                                                                                                         selectedData[that.options.dataField] = that.getAllSelections();
                                                                                                       }

                                                                                                       that.load(selectedData);
                                                                                                       doExport();
                                                                                                       that.load(data);
                                                                                                     } else {
                                                                                                       doExport();
                                                                                                     }
                                                                                                   });
                                                                                                 }
                                                                                               }
                                                                                             };
                                                                                           })(jQuery);


                                                                                           /**
                                                                                            *  * @author: Dennis Hernández
                                                                                            *   * @webSite: http://djhvscf.github.io/Blog
                                                                                            *    * @version: v1.1.0
                                                                                            *     */

                                                                                           !function ($) {

                                                                                             'use strict';

                                                                                             //From MDN site, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                                                                                             var filterFn = function () {
                                                                                               if (!Array.prototype.filter) {
                                                                                                 Array.prototype.filter = function(fun/*, thisArg*/) {
                                                                                                   'use strict';

                                                                                                   if (this === void 0 || this === null) {
                                                                                                     throw new TypeError();
                                                                                                   }

                                                                                                   var t = Object(this);
                                                                                                   var len = t.length >>> 0;
                                                                                                   if (typeof fun !== 'function') {
                                                                                                     throw new TypeError();
                                                                                                   }

                                                                                                   var res = [];
                                                                                                   var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                                                                                                   for (var i = 0; i < len; i++) {
                                                                                                     if (i in t) {
                                                                                                       var val = t[i];

                                                                                                       // NOTE: Technically this should Object.defineProperty at
                                                                                                       //       the next index, as push can be affected by
                                                                                                       //       properties on Object.prototype and Array.prototype.
                                                                                                       //       But that method's new, and collisions should be
                                                                                                       //       rare, so use the more-compatible alternative.
                                                                                                       if (fun.call(thisArg, val, i, t)) {
                                                                                                         res.push(val);
                                                                                                       }
                                                                                                     }
                                                                                                   }

                                                                                                   return res;
                                                                                                 };
                                                                                               }
                                                                                             };

                                                                                             $.extend($.fn.bootstrapTable.defaults, {
                                                                                               reorderableColumns: false,
                                                                                               maxMovingRows: 10,
                                                                                               onReorderColumn: function (headerFields) {
                                                                                                 return false;
                                                                                               },
                                                                                               dragaccept: null
                                                                                             });

                                                                                             $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
                                                                                               'reorder-column.bs.table': 'onReorderColumn'
                                                                                             });

                                                                                             var BootstrapTable = $.fn.bootstrapTable.Constructor,
                                                                                               _initHeader = BootstrapTable.prototype.initHeader,
                                                                                               _toggleColumn = BootstrapTable.prototype.toggleColumn,
                                                                                               _toggleView = BootstrapTable.prototype.toggleView,
                                                                                               _resetView = BootstrapTable.prototype.resetView;

                                                                                             BootstrapTable.prototype.initHeader = function () {
                                                                                               _initHeader.apply(this, Array.prototype.slice.apply(arguments));

                                                                                               if (!this.options.reorderableColumns) {
                                                                                                 return;
                                                                                               }

                                                                                               this.makeRowsReorderable();
                                                                                             };

                                                                                             BootstrapTable.prototype.toggleColumn = function () {
                                                                                               _toggleColumn.apply(this, Array.prototype.slice.apply(arguments));

                                                                                               if (!this.options.reorderableColumns) {
                                                                                                 return;
                                                                                               }

                                                                                               this.makeRowsReorderable();
                                                                                             };

                                                                                             BootstrapTable.prototype.toggleView = function () {
                                                                                               _toggleView.apply(this, Array.prototype.slice.apply(arguments));

                                                                                               if (!this.options.reorderableColumns) {
                                                                                                 return;
                                                                                               }

                                                                                               if (this.options.cardView) {
                                                                                                 return;
                                                                                               }

                                                                                               this.makeRowsReorderable();
                                                                                             };

                                                                                             BootstrapTable.prototype.resetView = function () {
                                                                                               _resetView.apply(this, Array.prototype.slice.apply(arguments));

                                                                                               if (!this.options.reorderableColumns) {
                                                                                                 return;
                                                                                               }

                                                                                               this.makeRowsReorderable();
                                                                                             };

                                                                                             BootstrapTable.prototype.makeRowsReorderable = function () {
                                                                                               var that = this;
                                                                                               try {
                                                                                                 $(this.$el).dragtable('destroy');
                                                                                               } catch (e) {}
                                                                                               $(this.$el).dragtable({
                                                                                                 maxMovingRows: that.options.maxMovingRows,
                                                                                                 dragaccept: that.options.dragaccept,
                                                                                                 clickDelay:200,
                                                                                                 beforeStop: function() {
                                                                                                   var ths = [],
                                                                                                     formatters = [],
                                                                                                     columns = [],
                                                                                                     columnsHidden = [],
                                                                                                     columnIndex = -1,
                                                                                                     optionsColumns = [];
                                                                                                   that.$header.find('th').each(function (i) {
                                                                                                     ths.push($(this).data('field'));
                                                                                                     formatters.push($(this).data('formatter'));
                                                                                                   });

                                                                                                   //Exist columns not shown
                                                                                                   if (ths.length < that.columns.length) {
                                                                                                     columnsHidden = $.grep(that.columns, function (column) {
                                                                                                       return !column.visible;
                                                                                                     });
                                                                                                     for (var i = 0; i < columnsHidden.length; i++) {
                                                                                                       ths.push(columnsHidden[i].field);
                                                                                                       formatters.push(columnsHidden[i].formatter);
                                                                                                     }
                                                                                                   }

                                                                                                   for (var i = 0; i < ths.length; i++ ) {
                                                                                                     columnIndex = $.fn.bootstrapTable.utils.getFieldIndex(that.columns, ths[i]);
                                                                                                     if (columnIndex !== -1) {
                                                                                                       that.columns[columnIndex].fieldIndex = i;
                                                                                                       columns.push(that.columns[columnIndex]);
                                                                                                       that.columns.splice(columnIndex, 1);
                                                                                                     }
                                                                                                   }

                                                                                                   that.columns = that.columns.concat(columns);

                                                                                                   filterFn(); //Support <IE9
                                                                                                   $.each(that.columns, function(i, column) {
                                                                                                     var found = false,
                                                                                                       field = column.field;
                                                                                                     that.options.columns[0].filter(function(item) {
                                                                                                       if(!found && item["field"] == field) {
                                                                                                         optionsColumns.push(item);
                                                                                                         found = true;
                                                                                                         return false;
                                                                                                       } else
                                                                                                         return true;
                                                                                                     })
                                                                                                   });

                                                                                                   that.options.columns[0] = optionsColumns;

                                                                                                   that.header.fields = ths;
                                                                                                   that.header.formatters = formatters;
                                                                                                   that.initHeader();
                                                                                                   that.initToolbar();
                                                                                                   that.initBody();
                                                                                                   that.resetView();
                                                                                                   that.trigger('reorder-column', ths);
                                                                                                 }
                                                                                               });
                                                                                             };
                                                                                           }(jQuery);
/**
 * @preserve tableExport.jquery.plugin
 *
 * Copyright (c) 2015-2017 hhurz, https://github.com/hhurz/tableExport.jquery.plugin
 * Original work Copyright (c) 2014 Giri Raj, https://github.com/kayalshri/
 *
 * Licensed under the MIT License, http://opensource.org/licenses/mit-license
 */

(function ($) {
  $.fn.extend({
    tableExport: function (options) {
      var defaults = {
        consoleLog: false,
        csvEnclosure: '"',
        csvSeparator: ',',
        csvUseBOM: true,
        displayTableName: false,
        escape: false,
        excelstyles: [],       // e.g. ['border-bottom', 'border-top', 'border-left', 'border-right']
        fileName: 'tableExport',
        htmlContent: false,
        ignoreColumn: [],
        ignoreRow:[],
        jsonScope: 'all', // head, data, all
        jspdf: {orientation: 'p',
                unit: 'pt',
                format: 'a4', // jspdf page format or 'bestfit' for autmatic paper format selection
                margins: {left: 20, right: 10, top: 10, bottom: 10},
                autotable: {styles: {cellPadding: 2,
                                     rowHeight: 12,
                                     fontSize: 8,
                                     fillColor: 255,        // color value or 'inherit' to use css background-color from html table
                                     textColor: 50,         // color value or 'inherit' to use css color from html table
                                     fontStyle: 'normal',   // normal, bold, italic, bolditalic or 'inherit' to use css font-weight and fonst-style from html table
                                     overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
                                     halign: 'left',        // left, center, right
                                     valign: 'middle'       // top, middle, bottom
                                    },
                            headerStyles: {fillColor: [52, 73, 94],
                                           textColor: 255,
                                           fontStyle: 'bold',
                                           halign: 'center'
                                          },
                            alternateRowStyles: {fillColor: 245
                                                },
                            tableExport: {onAfterAutotable: null,
                                          onBeforeAutotable: null,
                                          onAutotableText: null,
                                          onTable: null,
                                          outputImages: true
                                         }
                           }
               },
        numbers: {html: {decimalMark: '.',
                         thousandsSeparator: ','
                        },
                  output: // set to false to not format numbers in exported output
                          {decimalMark: '.',
                           thousandsSeparator: ','
                          }
                 },
        onCellData: null,
        onCellHtmlData: null,
        outputMode: 'file',  // 'file', 'string', 'base64' or 'window' (experimental)
        pdfmake: {enabled: false}, // true: use pdfmake instead of jspdf and jspdf-autotable (experimental)
        tbodySelector: 'tr',
        tfootSelector: 'tr', // set empty ('') to prevent export of tfoot rows
        theadSelector: 'tr',
        tableName: 'myTableName',
        type: 'csv', // 'csv', 'tsv', 'txt', 'sql', 'json', 'xml', 'excel', 'doc', 'png' or 'pdf'
        worksheetName: 'xlsWorksheetName'
      };

      var FONT_ROW_RATIO = 1.15;
      var el = this;
      var DownloadEvt = null;
      var $hrows = [];
      var $rows = [];
      var rowIndex = 0;
      var rowspans = [];
      var trData = '';
      var colNames = [];
      var blob;

      $.extend(true, defaults, options);

      colNames = GetColumnNames (el);

      if (defaults.type == 'csv' || defaults.type == 'tsv' || defaults.type == 'txt') {

        var csvData = "";
        var rowlength = 0;
        rowIndex = 0;

        function csvString(cell, rowIndex, colIndex) {
          var result = '';

          if (cell !== null) {
            var dataString = parseString(cell, rowIndex, colIndex);

            var csvValue = (dataString === null || dataString === '') ? '' : dataString.toString();

            if (defaults.type == 'tsv') {
              if (dataString instanceof Date)
                result = dataString.toLocaleString();

              // According to http://www.iana.org/assignments/media-types/text/tab-separated-values
              // are fields that contain tabs not allowable in tsv encoding
              result = replaceAll(csvValue, '\t', ' ');
            }
            else {
              // Takes a string and encapsulates it (by default in double-quotes) if it
              // contains the csv field separator, spaces, or linebreaks.
              if (dataString instanceof Date)
                result = defaults.csvEnclosure + dataString.toLocaleString() + defaults.csvEnclosure;
              else {
                result = replaceAll(csvValue, defaults.csvEnclosure, defaults.csvEnclosure + defaults.csvEnclosure);

                if (result.indexOf(defaults.csvSeparator) >= 0 || /[\r\n ]/g.test(result))
                  result = defaults.csvEnclosure + result + defaults.csvEnclosure;
              }
            }
          }

          return result;
        }

        var CollectCsvData = function ($rows, rowselector, length) {

          $rows.each(function () {
            trData = "";
            ForEachVisibleCell(this, rowselector, rowIndex, length + $rows.length,
                    function (cell, row, col) {
                      trData += csvString(cell, row, col) + (defaults.type == 'tsv' ? '\t' : defaults.csvSeparator);
                    });
            trData = $.trim(trData).substring(0, trData.length - 1);
            if (trData.length > 0) {

              if (csvData.length > 0)
                csvData += "\n";

              csvData += trData;
            }
            rowIndex++;
          });

          return $rows.length;
        };

        rowlength += CollectCsvData ($(el).find('thead').first().find(defaults.theadSelector), 'th,td', rowlength);
        $(el).find('tbody').each(function() {
          rowlength += CollectCsvData ($(this).find(defaults.tbodySelector), 'td,th', rowlength);
        });
        if (defaults.tfootSelector.length)
          CollectCsvData ($(el).find('tfoot').first().find(defaults.tfootSelector), 'td,th', rowlength);

        csvData += "\n";

        //output
        if (defaults.consoleLog === true)
          console.log(csvData);

        if (defaults.outputMode === 'string')
          return csvData;

        if (defaults.outputMode === 'base64')
          return base64encode(csvData);

        if (defaults.outputMode === 'window') {
          downloadFile(false, 'data:text/' + (defaults.type == 'csv' ? 'csv' : 'plain') + ';charset=utf-8,', csvData);
          return;
        }

        try {
          blob = new Blob([csvData], {type: "text/" + (defaults.type == 'csv' ? 'csv' : 'plain') + ";charset=utf-8"});
          saveAs(blob, defaults.fileName + '.' + defaults.type, (defaults.type != 'csv' || defaults.csvUseBOM === false));
        }
        catch (e) {
          downloadFile(defaults.fileName + '.' + defaults.type,
                       'data:text/' + (defaults.type == 'csv' ? 'csv' : 'plain') + ';charset=utf-8,' + ((defaults.type == 'csv' && defaults.csvUseBOM)? '\ufeff' : ''),
                       csvData);
        }

      } else if (defaults.type == 'sql') {

        // Header
        rowIndex = 0;
        var tdData = "INSERT INTO `" + defaults.tableName + "` (";
        $hrows = $(el).find('thead').first().find(defaults.theadSelector);
        $hrows.each(function () {
          ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                  function (cell, row, col) {
                    tdData += "'" + parseString(cell, row, col) + "',";
                  });
          rowIndex++;
          tdData = $.trim(tdData);
          tdData = $.trim(tdData).substring(0, tdData.length - 1);
        });
        tdData += ") VALUES ";
        // Row vs Column
        $(el).find('tbody').each(function() {
          $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
        });
        if (defaults.tfootSelector.length)
          $rows.push.apply ($rows, $(el).find('tfoot').find(defaults.tfootSelector));
        $($rows).each(function () {
          trData = "";
          ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                  function (cell, row, col) {
                    trData += "'" + parseString(cell, row, col) + "',";
                  });
          if (trData.length > 3) {
            tdData += "(" + trData;
            tdData = $.trim(tdData).substring(0, tdData.length - 1);
            tdData += "),";
          }
          rowIndex++;
        });

        tdData = $.trim(tdData).substring(0, tdData.length - 1);
        tdData += ";";

        //output
        if (defaults.consoleLog === true)
          console.log(tdData);

        if (defaults.outputMode === 'string')
          return tdData;

        if (defaults.outputMode === 'base64')
          return base64encode(tdData);

        try {
          blob = new Blob([tdData], {type: "text/plain;charset=utf-8"});
          saveAs(blob, defaults.fileName + '.sql');
        }
        catch (e) {
          downloadFile(defaults.fileName + '.sql',
                       'data:application/sql;charset=utf-8,',
                       tdData);
        }

      } else if (defaults.type == 'json') {

        var jsonHeaderArray = [];
        $hrows = $(el).find('thead').first().find(defaults.theadSelector);
        $hrows.each(function () {
          var jsonArrayTd = [];

          ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                  function (cell, row, col) {
                    jsonArrayTd.push(parseString(cell, row, col));
                  });
          jsonHeaderArray.push(jsonArrayTd);
        });

        var jsonArray = [];
        $(el).find('tbody').each(function() {
          $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
        });
        if (defaults.tfootSelector.length)
          $rows.push.apply ($rows, $(el).find('tfoot').find(defaults.tfootSelector));
        $($rows).each(function () {
          var jsonObjectTd = {};

          var colIndex = 0;
          ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                  function (cell, row, col) {
                    if (jsonHeaderArray.length) {
                      jsonObjectTd[jsonHeaderArray[jsonHeaderArray.length-1][colIndex]] = parseString(cell, row, col);
                    } else {
                      jsonObjectTd[colIndex] = parseString(cell, row, col);
                    }
                    colIndex++;
                  });
          if ($.isEmptyObject(jsonObjectTd) === false)
            jsonArray.push(jsonObjectTd);

          rowIndex++;
        });

        var sdata = "";

        if (defaults.jsonScope == 'head')
          sdata = JSON.stringify(jsonHeaderArray);
        else if (defaults.jsonScope == 'data')
          sdata = JSON.stringify(jsonArray);
        else // all
          sdata = JSON.stringify({header: jsonHeaderArray, data: jsonArray});

        if (defaults.consoleLog === true)
          console.log(sdata);

        if (defaults.outputMode === 'string')
          return sdata;

        if (defaults.outputMode === 'base64')
          return base64encode(sdata);

        try {
          blob = new Blob([sdata], {type: "application/json;charset=utf-8"});
          saveAs(blob, defaults.fileName + '.json');
        }
        catch (e) {
          downloadFile(defaults.fileName + '.json',
                       'data:application/json;charset=utf-8;base64,',
                       sdata);
        }

      } else if (defaults.type === 'xml') {

        rowIndex = 0;
        var xml = '<?xml version="1.0" encoding="utf-8"?>';
        xml += '<tabledata><fields>';

        // Header
        $hrows = $(el).find('thead').first().find(defaults.theadSelector);
        $hrows.each(function () {

          ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                  function (cell, row, col) {
                    xml += "<field>" + parseString(cell, row, col) + "</field>";
                  });
          rowIndex++;
        });
        xml += '</fields><data>';

        // Row Vs Column
        var rowCount = 1;
        $(el).find('tbody').each(function() {
          $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
        });
        if (defaults.tfootSelector.length)
          $rows.push.apply ($rows, $(el).find('tfoot').find(defaults.tfootSelector));
        $($rows).each(function () {
          var colCount = 1;
          trData = "";
          ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                  function (cell, row, col) {
                    trData += "<column-" + colCount + ">" + parseString(cell, row, col) + "</column-" + colCount + ">";
                    colCount++;
                  });
          if (trData.length > 0 && trData != "<column-1></column-1>") {
            xml += '<row id="' + rowCount + '">' + trData + '</row>';
            rowCount++;
          }

          rowIndex++;
        });
        xml += '</data></tabledata>';

        //output
        if (defaults.consoleLog === true)
          console.log(xml);

        if (defaults.outputMode === 'string')
          return xml;

        if (defaults.outputMode === 'base64')
          return base64encode(xml);

        try {
          blob = new Blob([xml], {type: "application/xml;charset=utf-8"});
          saveAs(blob, defaults.fileName + '.xml');
        }
        catch (e) {
          downloadFile(defaults.fileName + '.xml',
                       'data:application/xml;charset=utf-8;base64,',
                       xml);
        }

      } else if (defaults.type == 'excel' || defaults.type == 'xls' || defaults.type == 'word' || defaults.type == 'doc') {

        var MSDocType = (defaults.type == 'excel' || defaults.type == 'xls') ? 'excel' : 'word';
        var MSDocExt = (MSDocType == 'excel') ? 'xls' : 'doc';
        var MSDocSchema = 'xmlns:x="urn:schemas-microsoft-com:office:' + MSDocType + '"';
        var $tables = $(el).filter(function() {
            return $(this).data("tableexport-display") != 'none' &&
                   ($(this).is(':visible') ||
                    $(this).data("tableexport-display") == 'always');
          });
        var docData = '';

        $tables.each(function(){
          var $table = $(this);
          rowIndex = 0;
          colNames = GetColumnNames (this);

          docData += '<table><thead>';
          // Header
          $hrows = $table.find('thead').first().find(defaults.theadSelector);
          $hrows.each(function() {
            trData = "";
            ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
              function(cell, row, col) {
                if (cell !== null) {
                  var thstyle = '';
                  trData += '<th';
                  for (var styles in defaults.excelstyles) {
                    if (defaults.excelstyles.hasOwnProperty(styles)) {
                      var thcss = $(cell).css(defaults.excelstyles[styles]);
                      if (thcss !== '' && thcss !='0px none rgb(0, 0, 0)' && thcss != 'rgba(0, 0, 0, 0)') {
                        thstyle += (thstyle === '') ? 'style="' : ';';
                        thstyle += defaults.excelstyles[styles] + ':' + thcss;
                      }
                    }
                  }
                  if (thstyle !== '' )
                    trData += ' ' + thstyle + '"';
                  if ($(cell).is("[colspan]"))
                    trData += ' colspan="' + $(cell).attr('colspan') + '"';
                  if ($(cell).is("[rowspan]"))
                    trData += ' rowspan="' + $(cell).attr('rowspan') + '"';
                  trData += '>' + parseString(cell, row, col) + '</th>';
                }
              });
            if (trData.length > 0)
              docData += '<tr>' + trData + '</tr>';
            rowIndex++;
          });

          docData += '</thead><tbody>';
          // Row Vs Column, support multiple tbodys
          $table.find('tbody').each(function() {
            $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
          });
          if (defaults.tfootSelector.length)
            $rows.push.apply ($rows, $table.find('tfoot').find(defaults.tfootSelector));

          $($rows).each(function() {
            var $row = $(this);
            trData = "";
            ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
              function(cell, row, col) {
                if (cell !== null) {
                  var tdstyle = '';
                  var tdcss = $(cell).data("tableexport-msonumberformat");

                  if (typeof tdcss == 'undefined' && typeof defaults.onMsoNumberFormat === 'function')
                    tdcss = defaults.onMsoNumberFormat(cell, row, col);

                  if (typeof tdcss != 'undefined' && tdcss !== '')
                    tdstyle = 'style="mso-number-format:\'' + tdcss + '\'';

                  for (var cssStyle in defaults.excelstyles) {
                    if (defaults.excelstyles.hasOwnProperty(cssStyle)) {
                      tdcss = $(cell).css(defaults.excelstyles[cssStyle]);
                      if (tdcss === '')
                        tdcss = $row.css(defaults.excelstyles[cssStyle]);

                      if (tdcss !== '' && tdcss !='0px none rgb(0, 0, 0)' && tdcss != 'rgba(0, 0, 0, 0)') {
                        tdstyle += (tdstyle === '') ? 'style="' : ';';
                        tdstyle += defaults.excelstyles[cssStyle] + ':' + tdcss;
                      }
                    }
                  }
                  trData += '<td';
                  if (tdstyle !== '' )
                    trData += ' ' + tdstyle + '"';
                  if ($(cell).is("[colspan]"))
                    trData += ' colspan="' + $(cell).attr('colspan') + '"';
                  if ($(cell).is("[rowspan]"))
                    trData += ' rowspan="' + $(cell).attr('rowspan') + '"';
                  trData += '>' + parseString(cell, row, col).replace(/\n/g,'<br>') + '</td>';
                }
              });
            if (trData.length > 0)
              docData += '<tr>' + trData + '</tr>';
            rowIndex++;
          });

          if (defaults.displayTableName)
            docData += '<tr><td></td></tr><tr><td></td></tr><tr><td>' + parseString($('<p>' + defaults.tableName + '</p>')) + '</td></tr>';

          docData += '</tbody></table>';

          if (defaults.consoleLog === true)
            console.log(docData);
        });

        var docFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' + MSDocSchema + ' xmlns="http://www.w3.org/TR/REC-html40">';
        docFile += '<meta http-equiv="content-type" content="application/vnd.ms-' + MSDocType + '; charset=UTF-8">';
        docFile += "<head>";
        if (MSDocType === 'excel') {
          docFile += "<!--[if gte mso 9]>";
          docFile += "<xml>";
          docFile += "<x:ExcelWorkbook>";
          docFile += "<x:ExcelWorksheets>";
          docFile += "<x:ExcelWorksheet>";
          docFile += "<x:Name>";
          docFile += defaults.worksheetName;
          docFile += "</x:Name>";
          docFile += "<x:WorksheetOptions>";
          docFile += "<x:DisplayGridlines/>";
          docFile += "</x:WorksheetOptions>";
          docFile += "</x:ExcelWorksheet>";
          docFile += "</x:ExcelWorksheets>";
          docFile += "</x:ExcelWorkbook>";
          docFile += "</xml>";
          docFile += "<![endif]-->";
        }
        docFile += "<style>br {mso-data-placement:same-cell;}</style>";
        docFile += "</head>";
        docFile += "<body>";
        docFile += docData;
        docFile += "</body>";
        docFile += "</html>";

        if (defaults.consoleLog === true)
          console.log(docFile);

        if (defaults.outputMode === 'string')
          return docFile;

        if (defaults.outputMode === 'base64')
          return base64encode(docFile);

        try {
          blob = new Blob([docFile], {type: 'application/vnd.ms-' + defaults.type});
          saveAs(blob, defaults.fileName + '.' + MSDocExt);
        }
        catch (e) {
          downloadFile(defaults.fileName + '.' + MSDocExt,
                       'data:application/vnd.ms-' + MSDocType + ';base64,',
                       docFile);
        }

      } else if (defaults.type == 'xlsx') {

        var data = [];
        var ranges = [];
        rowIndex = 0;

        $rows = $(el).find('thead').first().find(defaults.theadSelector);
        $(el).find('tbody').each(function() {
          $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
        });
        if (defaults.tfootSelector.length)
          $rows.push.apply ($rows, $(el).find('tfoot').find(defaults.tfootSelector));

        $($rows).each(function () {
          var cols = [];
          ForEachVisibleCell(this, 'th,td', rowIndex, $rows.length,
            function (cell, row, col) {
              if (typeof cell !== 'undefined' && cell !== null) {

                var colspan = parseInt(cell.getAttribute('colspan'));
                var rowspan = parseInt(cell.getAttribute('rowspan'));

                var cellValue = parseString(cell, row, col);

                if(cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

                //Skip ranges
                ranges.forEach(function(range) {
                  if(rowIndex >= range.s.r && rowIndex <= range.e.r && cols.length >= range.s.c && cols.length <= range.e.c) {
                    for(var i = 0; i <= range.e.c - range.s.c; ++i) cols.push(null);
                  }
                });

                //Handle Row Span
                if (rowspan || colspan) {
                  rowspan = rowspan || 1;
                  colspan = colspan || 1;
                  ranges.push({s:{r:rowIndex, c:cols.length},e:{r:rowIndex+rowspan-1, c:cols.length+colspan-1}});
                }

                //Handle Value
                cols.push(cellValue !== "" ? cellValue : null);

                //Handle Colspan
                if (colspan) for (var k = 0; k < colspan - 1; ++k) cols.push(null);
              }
            });
          data.push(cols);
          rowIndex++;
        });

        var wb = new jx_Workbook(),
            ws = jx_createSheet(data);

        // add ranges to worksheet
        ws['!merges'] = ranges;

        // add worksheet to workbook
        wb.SheetNames.push(defaults.worksheetName);
        wb.Sheets[defaults.worksheetName] = ws;

        var wbout = XLSX.write(wb, {bookType: defaults.type, bookSST: false, type: 'binary'});

        try {
          blob = new Blob([jx_s2ab(wbout)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
          saveAs(blob, defaults.fileName + '.' + defaults.type);
        }
        catch (e) {
          downloadFile(defaults.fileName + '.' + defaults.type,
                       'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8,',
                       blob);
        }

      } else if (defaults.type == 'png') {
        //html2canvas($(el)[0], {
        //  onrendered: function (canvas) {
        html2canvas($(el)[0]).then(
          function (canvas) {

            var image = canvas.toDataURL();
            var byteString = atob(image.substring(22)); // remove data stuff
            var buffer = new ArrayBuffer(byteString.length);
            var intArray = new Uint8Array(buffer);

            for (var i = 0; i < byteString.length; i++)
              intArray[i] = byteString.charCodeAt(i);

            if (defaults.consoleLog === true)
              console.log(byteString);

            if (defaults.outputMode === 'string')
              return byteString;

            if (defaults.outputMode === 'base64')
              return base64encode(image);

            if (defaults.outputMode === 'window') {
              window.open(image);
              return;
            }

            try {
              blob = new Blob([buffer], {type: "image/png"});
              saveAs(blob, defaults.fileName + '.png');
            }
            catch (e) {
              downloadFile(defaults.fileName + '.png', 'data:image/png,', blob);
            }
          //}
        });

      } else if (defaults.type == 'pdf') {

        if (defaults.pdfmake.enabled === true) {
          // pdf output using pdfmake
          // https://github.com/bpampuch/pdfmake

          var widths = [];
          var body = [];
          rowIndex = 0;

          $hrows = $(this).find('thead').first().find(defaults.theadSelector);
          $hrows.each(function () {
            var h = [];

            ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                    function (cell, row, col) {
                      h.push(parseString(cell, row, col));
                    });

            if (h.length)
              body.push(h);

            for(var i = widths.length; i < h.length;i++)
              widths.push("*");

            rowIndex++;
          });

          $(this).find('tbody').each(function() {
            $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
          });
          if (defaults.tfootSelector.length)
            $rows.push.apply ($rows, $(this).find('tfoot').find(defaults.tfootSelector));

          $($rows).each(function () {
            var r = [];

            ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                    function (cell, row, col) {
                      r.push(parseString(cell, row, col));
                    });

            if (r.length)
              body.push(r);
            rowIndex++;
          });

          var docDefinition = {
              pageOrientation: 'landscape',
              content: [
                      {
                        table: {
                          headerRows: $hrows.length,
                          widths: widths,
                          body: body
                        }
                      }
                     ]
          };
          pdfMake.createPdf(docDefinition).getBuffer(function (buffer) {

            try {
              var blob = new Blob([buffer], {type: "application/pdf"});
              saveAs(blob, defaults.fileName + '.pdf');
            }
            catch (e) {
              downloadFile(defaults.fileName + '.pdf',
                           'data:application/pdf;base64,',
                           buffer);
            }
          });

        }
        else if (defaults.jspdf.autotable === false) {
          // pdf output using jsPDF's core html support

          var addHtmlOptions = {
            dim: {
              w: getPropertyUnitValue($(el).first().get(0), 'width', 'mm'),
              h: getPropertyUnitValue($(el).first().get(0), 'height', 'mm')
            },
            pagesplit: false
          };

          var doc = new jsPDF(defaults.jspdf.orientation, defaults.jspdf.unit, defaults.jspdf.format);
          doc.addHTML($(el).first(),
                  defaults.jspdf.margins.left,
                  defaults.jspdf.margins.top,
                  addHtmlOptions,
                  function () {
                    jsPdfOutput(doc, false);
                  });
          //delete doc;
        }
        else {
          // pdf output using jsPDF AutoTable plugin
          // https://github.com/simonbengtsson/jsPDF-AutoTable

          var teOptions = defaults.jspdf.autotable.tableExport;

          // When setting jspdf.format to 'bestfit' tableExport tries to choose
          // the minimum required paper format and orientation in which the table
          // (or tables in multitable mode) completely fits without column adjustment
          if (typeof defaults.jspdf.format === 'string' && defaults.jspdf.format.toLowerCase() === 'bestfit') {
            var pageFormats = {
              'a0': [2383.94, 3370.39], 'a1': [1683.78, 2383.94],
              'a2': [1190.55, 1683.78], 'a3': [841.89, 1190.55],
              'a4': [595.28, 841.89]
            };
            var rk = '', ro = '';
            var mw = 0;

            $(el).filter(':visible').each(function () {
              if ($(this).css('display') != 'none') {
                var w = getPropertyUnitValue($(this).get(0), 'width', 'pt');

                if (w > mw) {
                  if (w > pageFormats.a0[0]) {
                    rk = 'a0';
                    ro = 'l';
                  }
                  for (var key in pageFormats) {
                    if (pageFormats.hasOwnProperty(key)) {
                      if (pageFormats[key][1] > w) {
                        rk = key;
                        ro = 'l';
                        if (pageFormats[key][0] > w)
                          ro = 'p';
                      }
                    }
                  }
                  mw = w;
                }
              }
            });
            defaults.jspdf.format = (rk === '' ? 'a4' : rk);
            defaults.jspdf.orientation = (ro === '' ? 'w' : ro);
          }

          // The jsPDF doc object is stored in defaults.jspdf.autotable.tableExport,
          // thus it can be accessed from any callback function
          teOptions.doc = new jsPDF(defaults.jspdf.orientation,
                  defaults.jspdf.unit,
                  defaults.jspdf.format);

          if (teOptions.outputImages === true)
            teOptions.images = {};

          if (typeof teOptions.images != 'undefined') {
            $(el).filter(function() {
              return $(this).data("tableexport-display") != 'none' &&
                     ($(this).is(':visible') ||
                      $(this).data("tableexport-display") == 'always');
            }).each(function () {
              var rowCount = 0;

              $hrows = $(this).find('thead').find(defaults.theadSelector);
              $(this).find('tbody').each(function() {
                $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
              });
              if (defaults.tfootSelector.length)
                $rows.push.apply ($rows, $(this).find('tfoot').find(defaults.tfootSelector));

              $($rows).each(function () {
                ForEachVisibleCell(this, 'td,th', $hrows.length + rowCount, $hrows.length + $rows.length,
                  function (cell, row, col) {
                    if (typeof cell !== 'undefined' && cell !== null) {
                      var kids = $(cell).children();
                      if (typeof kids != 'undefined' && kids.length > 0)
                        collectImages (cell, kids, teOptions);
                    }
                  });
                rowCount++;
              });
            });

            $hrows = [];
            $rows = [];
          }

          loadImages ( teOptions, function (imageCount) {

            $(el).filter(function() {
              return $(this).data("tableexport-display") != 'none' &&
                     ($(this).is(':visible') ||
                      $(this).data("tableexport-display") == 'always');
            }).each(function () {
              var colKey;
              var rowIndex = 0;

              colNames = GetColumnNames (this);

              teOptions.columns = [];
              teOptions.rows = [];
              teOptions.rowoptions = {};

              // onTable: optional callback function for every matching table that can be used
              // to modify the tableExport options or to skip the output of a particular table
              // if the table selector targets multiple tables
              if (typeof teOptions.onTable === 'function')
                if (teOptions.onTable($(this), defaults) === false)
                  return true; // continue to next iteration step (table)

              // each table works with an own copy of AutoTable options
              defaults.jspdf.autotable.tableExport = null;  // avoid deep recursion error
              var atOptions = $.extend(true, {}, defaults.jspdf.autotable);
              defaults.jspdf.autotable.tableExport = teOptions;

              atOptions.margin = {};
              $.extend(true, atOptions.margin, defaults.jspdf.margins);
              atOptions.tableExport = teOptions;

              // Fix jsPDF Autotable's row height calculation
              if (typeof atOptions.beforePageContent !== 'function') {
                atOptions.beforePageContent = function (data) {
                  if (data.pageCount == 1) {
                    var all = data.table.rows.concat(data.table.headerRow);
                    all.forEach(function (row) {
                      if ( row.height > 0 ) {
                        row.height += (2 - FONT_ROW_RATIO) / 2 * row.styles.fontSize;
                        data.table.height += (2 - FONT_ROW_RATIO) / 2 * row.styles.fontSize;
                      }
                    });
                  }
                };
              }

              if (typeof atOptions.createdHeaderCell !== 'function') {
                // apply some original css styles to pdf header cells
                atOptions.createdHeaderCell = function (cell, data) {

                  // jsPDF AutoTable plugin v2.0.14 fix: each cell needs its own styles object
                  cell.styles = $.extend({}, data.row.styles);

                  if (typeof teOptions.columns [data.column.dataKey] != 'undefined') {
                    var col = teOptions.columns [data.column.dataKey];

                    if (typeof col.rect != 'undefined') {
                      var rh;

                      cell.contentWidth = col.rect.width;

                      if (typeof teOptions.heightRatio == 'undefined' || teOptions.heightRatio === 0) {
                        if (data.row.raw [data.column.dataKey].rowspan)
                          rh = data.row.raw [data.column.dataKey].rect.height / data.row.raw [data.column.dataKey].rowspan;
                        else
                          rh = data.row.raw [data.column.dataKey].rect.height;

                        teOptions.heightRatio = cell.styles.rowHeight / rh;
                      }

                      rh = data.row.raw [data.column.dataKey].rect.height * teOptions.heightRatio;
                      if (rh > cell.styles.rowHeight)
                        cell.styles.rowHeight = rh;
                    }

                    if (typeof col.style != 'undefined' && col.style.hidden !== true) {
                      cell.styles.halign = col.style.align;
                      if (atOptions.styles.fillColor === 'inherit')
                        cell.styles.fillColor = col.style.bcolor;
                      if (atOptions.styles.textColor === 'inherit')
                        cell.styles.textColor = col.style.color;
                      if (atOptions.styles.fontStyle === 'inherit')
                        cell.styles.fontStyle = col.style.fstyle;
                    }
                  }
                };
              }

              if (typeof atOptions.createdCell !== 'function') {
                // apply some original css styles to pdf table cells
                atOptions.createdCell = function (cell, data) {
                  var rowopt = teOptions.rowoptions [data.row.index + ":" + data.column.dataKey];

                  if (typeof rowopt != 'undefined' &&
                      typeof rowopt.style != 'undefined' &&
                      rowopt.style.hidden !== true) {
                    cell.styles.halign = rowopt.style.align;
                    if (atOptions.styles.fillColor === 'inherit')
                      cell.styles.fillColor = rowopt.style.bcolor;
                    if (atOptions.styles.textColor === 'inherit')
                      cell.styles.textColor = rowopt.style.color;
                    if (atOptions.styles.fontStyle === 'inherit')
                      cell.styles.fontStyle = rowopt.style.fstyle;
                  }
                };
              }

              if (typeof atOptions.drawHeaderCell !== 'function') {
                atOptions.drawHeaderCell = function (cell, data) {
                  var colopt = teOptions.columns [data.column.dataKey];

                  if ((colopt.style.hasOwnProperty("hidden") !== true || colopt.style.hidden !== true) &&
                      colopt.rowIndex >= 0 )
                    return prepareAutoTableText (cell, data, colopt);
                  else
                    return false; // cell is hidden
                };
              }

              if (typeof atOptions.drawCell !== 'function') {
                atOptions.drawCell = function (cell, data) {
                  var rowopt = teOptions.rowoptions [data.row.index + ":" + data.column.dataKey];
                  if ( prepareAutoTableText (cell, data, rowopt) ) {

                    teOptions.doc.rect(cell.x, cell.y, cell.width, cell.height, cell.styles.fillStyle);

                    if (typeof rowopt != 'undefined' && typeof rowopt.kids != 'undefined' && rowopt.kids.length > 0) {

                      var dh = cell.height / rowopt.rect.height;
                      if (dh > teOptions.dh || typeof teOptions.dh == 'undefined')
                        teOptions.dh = dh;
                      teOptions.dw = cell.width / rowopt.rect.width;

                      drawAutotableElements (cell, rowopt.kids, teOptions);
                      drawAutotableText (cell, rowopt.kids, teOptions);
                    }
                    else
                      drawAutotableText (cell, {}, teOptions);
                  }
                  return false;
                };
              }

              // collect header and data rows
              teOptions.headerrows = [];
              $hrows = $(this).find('thead').find(defaults.theadSelector);
              $hrows.each(function () {
                colKey = 0;

                teOptions.headerrows[rowIndex] = [];

                ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                        function (cell, row, col) {
                          var obj = getCellStyles (cell);
                          obj.title = parseString(cell, row, col);
                          obj.key = colKey++;
                          obj.rowIndex = rowIndex;
                          teOptions.headerrows[rowIndex].push(obj);
                        });
                rowIndex++;
              });

              if (rowIndex > 0) {
                // iterate through last row
                var lastrow = rowIndex-1;
                while (lastrow >= 0) {
                  $.each(teOptions.headerrows[lastrow], function () {
                    var obj = this;

                    if (lastrow > 0 && this.rect === null)
                      obj = teOptions.headerrows[lastrow-1][this.key];

                    if (obj !== null && obj.rowIndex >= 0 &&
                        (obj.style.hasOwnProperty("hidden") !== true || obj.style.hidden !== true))
                      teOptions.columns.push(obj);
                  });

                  lastrow = (teOptions.columns.length > 0) ? -1 : lastrow-1;
                }
              }

              var rowCount = 0;
              $rows = [];
              $(this).find('tbody').each(function() {
                $rows.push.apply ($rows, $(this).find(defaults.tbodySelector));
              });
              if (defaults.tfootSelector.length)
                $rows.push.apply ($rows, $(this).find('tfoot').find(defaults.tfootSelector));
              $($rows).each(function () {
                var rowData = [];
                colKey = 0;

                ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                        function (cell, row, col) {
                          if (typeof teOptions.columns[colKey] === 'undefined') {
                            // jsPDF-Autotable needs columns. Thus define hidden ones for tables without thead
                            var obj = {
                              title: '',
                              key: colKey,
                              style: {
                                hidden: true
                              }
                            };
                            teOptions.columns.push(obj);
                          }
                          if (typeof cell !== 'undefined' && cell !== null) {
                            var obj = getCellStyles (cell);
                            obj.kids = $(cell).children();
                            teOptions.rowoptions [rowCount + ":" + colKey++] = obj;
                          }
                          else {
                            var obj = $.extend(true, {}, teOptions.rowoptions [rowCount + ":" + (colKey-1)]);
                            obj.colspan = -1;
                            teOptions.rowoptions [rowCount + ":" + colKey++] = obj;
                          }

                          rowData.push(parseString(cell, row, col));
                        });
                if (rowData.length) {
                  teOptions.rows.push(rowData);
                  rowCount++;
                }
                rowIndex++;
              });

              // onBeforeAutotable: optional callback function before calling
              // jsPDF AutoTable that can be used to modify the AutoTable options
              if (typeof teOptions.onBeforeAutotable === 'function')
                teOptions.onBeforeAutotable($(this), teOptions.columns, teOptions.rows, atOptions);

              teOptions.doc.autoTable(teOptions.columns, teOptions.rows, atOptions);

              // onAfterAutotable: optional callback function after returning
              // from jsPDF AutoTable that can be used to modify the AutoTable options
              if (typeof teOptions.onAfterAutotable === 'function')
                teOptions.onAfterAutotable($(this), atOptions);

              // set the start position for the next table (in case there is one)
              defaults.jspdf.autotable.startY = teOptions.doc.autoTableEndPosY() + atOptions.margin.top;

            });

            jsPdfOutput(teOptions.doc, (typeof teOptions.images != 'undefined' && jQuery.isEmptyObject(teOptions.images) === false));

            if (typeof teOptions.headerrows != 'undefined')
              teOptions.headerrows.length = 0;
            if (typeof teOptions.columns != 'undefined')
              teOptions.columns.length = 0;
            if (typeof teOptions.rows != 'undefined')
              teOptions.rows.length = 0;
            delete teOptions.doc;
            teOptions.doc = null;
          });
        }
      }

      function FindColObject (objects, colIndex, rowIndex) {
        var result = null;
        $.each(objects, function () {
          if (this.rowIndex == rowIndex && this.key == colIndex) {
            result = this;
            return false;
          }
        });
        return result;
      }

      function GetColumnNames (table) {
        var result = [];
        $(table).find('thead').first().find('th').each(function(index, el) {
          if ($(el).attr("data-field") !== undefined)
            result[index] = $(el).attr("data-field");
          else
            result[index] = index.toString();
        });
        return result;
      }

      function isColumnIgnored($row, colIndex) {
        var result = false;
        if (defaults.ignoreColumn.length > 0) {
          if (typeof defaults.ignoreColumn[0] == 'string') {
            if (colNames.length > colIndex && typeof colNames[colIndex] != 'undefined')
              if ($.inArray(colNames[colIndex], defaults.ignoreColumn) != -1)
                result = true;
          }
          else if (typeof defaults.ignoreColumn[0] == 'number') {
            if ($.inArray(colIndex, defaults.ignoreColumn) != -1 ||
                $.inArray(colIndex-$row.length, defaults.ignoreColumn) != -1)
              result = true;
          }
        }
        return result;
      }

      function ForEachVisibleCell(tableRow, selector, rowIndex, rowCount, cellcallback) {
        if ($.inArray(rowIndex, defaults.ignoreRow) == -1 &&
            $.inArray(rowIndex-rowCount, defaults.ignoreRow) == -1) {

          var $row = $(tableRow).filter(function() {
            return $(this).data("tableexport-display") != 'none' &&
                   ($(this).is(':visible') ||
                    $(this).data("tableexport-display") == 'always' ||
                    $(this).closest('table').data("tableexport-display") == 'always');
          }).find(selector);

          var rowColspan = 0;
          var rowColIndex = 0;

          $row.each(function (colIndex) {
            if ($(this).data("tableexport-display") == 'always' ||
                ($(this).css('display') != 'none' &&
                 $(this).css('visibility') != 'hidden' &&
                 $(this).data("tableexport-display") != 'none')) {
              if (isColumnIgnored($row, colIndex) === false) {
                if (typeof (cellcallback) === "function") {
                  var c, Colspan = 0;
                  var r, Rowspan = 0;

                  // handle rowspans from previous rows
                  if (typeof rowspans[rowIndex] != 'undefined' && rowspans[rowIndex].length > 0) {
                    for (c = 0; c <= colIndex; c++) {
                      if (typeof rowspans[rowIndex][c] != 'undefined') {
                        cellcallback(null, rowIndex, c);
                        delete rowspans[rowIndex][c];
                        colIndex++;
                      }
                    }
                  }
                  rowColIndex = colIndex;

                  if ($(this).is("[colspan]")) {
                    Colspan = parseInt($(this).attr('colspan'));
                    rowColspan += Colspan > 0 ? Colspan - 1 : 0;
                  }

                  if ($(this).is("[rowspan]"))
                    Rowspan = parseInt($(this).attr('rowspan'));

                  // output content of current cell
                  cellcallback(this, rowIndex, colIndex);

                  // handle colspan of current cell
                  for (c = 0; c < Colspan - 1; c++)
                    cellcallback(null, rowIndex, colIndex + c);

                  // store rowspan for following rows
                  if (Rowspan) {
                    for (r = 1; r < Rowspan; r++) {
                      if (typeof rowspans[rowIndex + r] == 'undefined')
                        rowspans[rowIndex + r] = [];

                      rowspans[rowIndex + r][colIndex + rowColspan] = "";

                      for (c = 1; c < Colspan; c++)
                        rowspans[rowIndex + r][colIndex + rowColspan - c] = "";
                    }
                  }
                }
              }
            }
          });
          // handle rowspans from previous rows
          if (typeof rowspans[rowIndex] != 'undefined' && rowspans[rowIndex].length > 0) {
            for (var c = 0; c <= rowspans[rowIndex].length; c++) {
              if (typeof rowspans[rowIndex][c] != 'undefined') {
                cellcallback(null, rowIndex, c);
                delete rowspans[rowIndex][c];
              }
            }
          }
        }
      }

      function jsPdfOutput(doc, hasimages) {
        if (defaults.consoleLog === true)
          console.log(doc.output());

        if (defaults.outputMode === 'string')
          return doc.output();

        if (defaults.outputMode === 'base64')
          return base64encode(doc.output());

        if (defaults.outputMode === 'window') {
          window.open(URL.createObjectURL(doc.output("blob")));
          return;
        }

        try {
          var blob = doc.output('blob');
          saveAs(blob, defaults.fileName + '.pdf');
        }
        catch (e) {
          downloadFile(defaults.fileName + '.pdf',
                       'data:application/pdf' + (hasimages ? '' : ';base64') + ',',
                       hasimages ? blob : doc.output());
        }
      }

      function prepareAutoTableText (cell, data, cellopt) {
        var cs = 0;
        if ( typeof cellopt != 'undefined' )
          cs = cellopt.colspan;

        if ( cs >= 0 ) {
          // colspan handling
          var cellWidth = cell.width;
          var textPosX = cell.textPos.x;
          var i = data.table.columns.indexOf(data.column);

          for (var c = 1; c < cs; c++) {
            var column = data.table.columns[i+c];
            cellWidth += column.width;
          }

          if ( cs > 1 ) {
            if ( cell.styles.halign === 'right' )
              textPosX = cell.textPos.x + cellWidth - cell.width;
            else if ( cell.styles.halign === 'center' )
              textPosX = cell.textPos.x + (cellWidth - cell.width) / 2;
          }

          cell.width = cellWidth;
          cell.textPos.x = textPosX;

          if ( typeof cellopt != 'undefined' && cellopt.rowspan > 1 )
            cell.height = cell.height * cellopt.rowspan;

          // fix jsPDF's calculation of text position
          if ( cell.styles.valign === 'middle' || cell.styles.valign === 'bottom' ) {
            var splittedText = typeof cell.text === 'string' ? cell.text.split(/\r\n|\r|\n/g) : cell.text;
            var lineCount = splittedText.length || 1;
            if (lineCount > 2)
              cell.textPos.y -= ((2 - FONT_ROW_RATIO) / 2 * data.row.styles.fontSize) * (lineCount-2) / 3 ;
          }
          return true;
        }
        else
          return false; // cell is hidden (colspan = -1), don't draw it
      }

      function collectImages (cell, elements, teOptions) {
        if (typeof teOptions.images != 'undefined') {
          elements.each(function () {
            var kids = $(this).children();

            if ( $(this).is("img") ) {
              var hash = strHashCode(this.src);

              teOptions.images[hash] = { url: this.src,
                                         src: this.src };
            }

            if (typeof kids != 'undefined' && kids.length > 0)
              collectImages (cell, kids, teOptions);
          });
        }
      }

      function loadImages (teOptions, callback) {
        var i;
        var imageCount = 0;
        var x = 0;

        function done() {
          callback(imageCount);
        }
        function loadImage(image) {
          if (!image.url)
            return;
          var img = new Image();
          imageCount = ++x;
          img.crossOrigin = 'Anonymous';
          img.onerror = img.onload = function () {
            if(img.complete) {

              if (img.src.indexOf('data:image/') === 0) {
                img.width = image.width || img.width || 0;
                img.height = image.height || img.height || 0;
              }

              if (img.width + img.height) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage( img, 0, 0 );

                image.src = canvas.toDataURL("image/jpeg");
              }
            }
            if(!--x)
              done();
          };
          img.src = image.url;
        }

        if (typeof teOptions.images != 'undefined') {
          for (i in teOptions.images)
            if (teOptions.images.hasOwnProperty(i))
              loadImage(teOptions.images[i]);
        }

        return x || done();
      }

      function drawAutotableElements (cell, elements, teOptions) {
        elements.each(function () {
          var kids = $(this).children();

          if ( $(this).is("div") ) {
            var bcolor = rgb2array(getStyle(this, 'background-color'), [255, 255, 255]);
            var lcolor = rgb2array(getStyle(this, 'border-top-color'), [0, 0, 0]);
            var lwidth = getPropertyUnitValue(this, 'border-top-width', defaults.jspdf.unit);

            var r = this.getBoundingClientRect();
            var ux = this.offsetLeft * teOptions.dw;
            var uy = this.offsetTop * teOptions.dh;
            var uw = r.width * teOptions.dw;
            var uh = r.height * teOptions.dh;

            teOptions.doc.setDrawColor.apply (undefined, lcolor);
            teOptions.doc.setFillColor.apply (undefined, bcolor);
            teOptions.doc.setLineWidth (lwidth);
            teOptions.doc.rect(cell.x + ux, cell.y + uy, uw, uh, lwidth ? "FD" : "F");
          }
          else if ( $(this).is("img") ) {
            if (typeof teOptions.images != 'undefined') {
              var hash = strHashCode(this.src);
              var image = teOptions.images[hash];

              if (typeof image != 'undefined') {

                var arCell = cell.width / cell.height;
                var arImg  = this.width / this.height;
                var imgWidth = cell.width;
                var imgHeight = cell.height;
                var uy = 0;

                if (arImg < arCell) {
                  imgHeight = Math.min (cell.height, this.height);
                  imgWidth  = this.width * imgHeight / this.height;
                }
                else if (arImg > arCell) {
                  imgWidth  = Math.min (cell.width, this.width);
                  imgHeight = this.height * imgWidth / this.width;
                }

                if (imgHeight < cell.height)
                  uy = (cell.height - imgHeight) / 2;

                try {
                  teOptions.doc.addImage (image.src, cell.textPos.x, cell.y + uy, imgWidth, imgHeight);
                }
                catch (e) {
                  // TODO: IE -> convert png to jpeg
                }
                cell.textPos.x += imgWidth;
              }
            }
          }

          if (typeof kids != 'undefined' && kids.length > 0)
            drawCellElements (cell, kids, teOptions);
        });
      }

      function drawAutotableText (cell, texttags, teOptions) {
        if (typeof teOptions.onAutotableText === 'function') {
          teOptions.onAutotableText(teOptions.doc, cell, texttags);
        }
        else {
          var x = cell.textPos.x;
          var y = cell.textPos.y;
          var style = {halign: cell.styles.halign, valign: cell.styles.valign};

          if (texttags.length) {
            var tag = texttags[0];
            while (tag.previousSibling)
              tag = tag.previousSibling;

            var b = false, i = false;

            while (tag) {
              var txt = $(tag).text();

              if ($(tag).is("br")) {
                x = cell.textPos.x;
                y += teOptions.doc.internal.getFontSize();
              }

              if ($(tag).is("b"))
                b = true;
              else if ($(tag).is("i"))
                i = true;

              if (b || i)
                teOptions.doc.setFontType((b && i) ? "bolditalic" : b ? "bold" : "italic");

              var w = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();

              if (w) {
                if (cell.styles.overflow === 'linebreak' &&
                    x > cell.textPos.x && (x + w) > (cell.textPos.x + cell.width)) {
                  var chars = ".,!%*;:=-";
                  if (chars.indexOf(txt.charAt(0)) >= 0) {
                    var s = txt.charAt(0);
                    w = teOptions.doc.getStringUnitWidth(s) * teOptions.doc.internal.getFontSize();
                    if ((x + w) <= (cell.textPos.x + cell.width)) {
                      teOptions.doc.autoTableText(s, x, y, style);
                      txt = txt.substring (1, txt.length);
                    }
                    w = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();
                  }
                  x = cell.textPos.x;
                  y += teOptions.doc.internal.getFontSize();
                }

                while (txt.length && (x + w) > (cell.textPos.x + cell.width)) {
                  txt = txt.substring (0, txt.length - 1);
                  w = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();
                }
              }

              teOptions.doc.autoTableText(txt, x, y, style);
              x += w;

              if (b || i) {
                if ($(tag).is("b"))
                  b = false;
                else if ($(tag).is("i"))
                  i = false;

                teOptions.doc.setFontType((!b && !i) ? "normal" : b ? "bold" : "italic");
              }

              tag = tag.nextSibling;
            }
            cell.textPos.x = x;
            cell.textPos.y = y;
          }
          else {
            teOptions.doc.autoTableText(cell.text, x, y, style);
          }
        }
      }

      function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      }

      function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
      }

      function parseNumber(value) {
        value = value || "0";
        value = replaceAll(value, defaults.numbers.html.thousandsSeparator, '');
        value = replaceAll(value, defaults.numbers.html.decimalMark, '.');

        return typeof value === "number" || jQuery.isNumeric(value) !== false ? value : false;
      }

      function parseString(cell, rowIndex, colIndex) {
        var result = '';

        if (cell !== null) {
          var $cell = $(cell);
          var htmlData;

          if ($cell[0].hasAttribute("data-tableexport-value"))
            htmlData = $cell.data("tableexport-value");
          else {
            htmlData = $cell.html();

            if (typeof defaults.onCellHtmlData === 'function')
              htmlData = defaults.onCellHtmlData($cell, rowIndex, colIndex, htmlData);
            else if (htmlData != '') {
              var html = $.parseHTML( htmlData );
              var inputidx = 0;
              var selectidx = 0;

              htmlData = '';
              $.each( html, function() {
                if ( $(this).is("input") )
                  htmlData += $cell.find('input').eq(inputidx++).val();
                else if ( $(this).is("select") )
                  htmlData += $cell.find('select option:selected').eq(selectidx++).text();
                else {
                  if ( typeof $(this).html() === 'undefined' )
                    htmlData += $(this).text();
                  else if ( jQuery().bootstrapTable === undefined || $(this).hasClass('filterControl') !== true )
                    htmlData += $(this).html();
                }
              });
            }
          }

          if (defaults.htmlContent === true) {
            result = $.trim(htmlData);
          }
          else if (htmlData != '') {
            var text = htmlData.replace(/\n/g,'\u2028').replace(/<br\s*[\/]?>/gi, '\u2060');
            var obj = $('<div/>').html(text).contents();
            text = '';
            $.each(obj.text().split("\u2028"), function(i, v) {
              if (i > 0)
                text += " ";
              text += $.trim(v);
            });

            $.each(text.split("\u2060"), function(i, v) {
              if (i > 0)
                result += "\n";
              result += $.trim(v).replace(/\u00AD/g, ""); // remove soft hyphens
            });

            if (defaults.type == 'json' || defaults.numbers.output === false) {
              var number = parseNumber (result);

              if (number !== false)
                result = Number (number);
            }
            else if (defaults.numbers.html.decimalMark != defaults.numbers.output.decimalMark ||
                     defaults.numbers.html.thousandsSeparator != defaults.numbers.output.thousandsSeparator) {
              var number = parseNumber (result);

              if ( number !== false ) {
                var frac = ("" + number).split('.');
                if ( frac.length == 1 )
                  frac[1] = "";
                var mod = frac[0].length > 3 ? frac[0].length % 3 : 0;

                result = (number < 0 ? "-" : "") +
                         (defaults.numbers.output.thousandsSeparator ? ((mod ? frac[0].substr(0, mod) + defaults.numbers.output.thousandsSeparator : "") + frac[0].substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + defaults.numbers.output.thousandsSeparator)) : frac[0]) +
                         (frac[1].length ? defaults.numbers.output.decimalMark + frac[1] : "");
              }
            }
          }

          if (defaults.escape === true) {
            result = escape(result);
          }

          if (typeof defaults.onCellData === 'function') {
            result = defaults.onCellData($cell, rowIndex, colIndex, result);
          }
        }

        return result;
      }

      function hyphenate(a, b, c) {
        return b + "-" + c.toLowerCase();
      }

      function rgb2array(rgb_string, default_result) {
        var re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
        var bits = re.exec(rgb_string);
        var result = default_result;
        if (bits)
          result = [ parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]) ];
        return result;
      }

      function getCellStyles (cell) {
        var a = getStyle(cell, 'text-align');
        var fw = getStyle(cell, 'font-weight');
        var fs = getStyle(cell, 'font-style');
        var f = '';
        if (a == 'start')
          a = getStyle(cell, 'direction') == 'rtl' ? 'right' : 'left';
        if (fw >= 700)
          f = 'bold';
        if (fs == 'italic')
          f += fs;
        if (f === '')
          f = 'normal';

        var result = {
          style: {
            align: a,
            bcolor: rgb2array(getStyle(cell, 'background-color'), [255, 255, 255]),
            color: rgb2array(getStyle(cell, 'color'), [0, 0, 0]),
            fstyle: f
          },
          colspan: (parseInt($(cell).attr('colspan')) || 0),
          rowspan: (parseInt($(cell).attr('rowspan')) || 0)
        };

        if (cell !== null) {
          var r = cell.getBoundingClientRect();
          result.rect = {
            width: r.width,
            height: r.height
          };
        }

        return result;
      }

      // get computed style property
      function getStyle(target, prop) {
        try {
          if (window.getComputedStyle) { // gecko and webkit
            prop = prop.replace(/([a-z])([A-Z])/, hyphenate);  // requires hyphenated, not camel
            return window.getComputedStyle(target, null).getPropertyValue(prop);
          }
          if (target.currentStyle) { // ie
            return target.currentStyle[prop];
          }
          return target.style[prop];
        }
        catch (e) {
        }
        return "";
      }

      function getUnitValue(parent, value, unit) {
        var baseline = 100;  // any number serves

        var temp = document.createElement("div");  // create temporary element
        temp.style.overflow = "hidden";  // in case baseline is set too low
        temp.style.visibility = "hidden";  // no need to show it

        parent.appendChild(temp); // insert it into the parent for em, ex and %

        temp.style.width = baseline + unit;
        var factor = baseline / temp.offsetWidth;

        parent.removeChild(temp);  // clean up

        return (value * factor);
      }

      function getPropertyUnitValue(target, prop, unit) {
        var value = getStyle(target, prop);  // get the computed style value

        var numeric = value.match(/\d+/);  // get the numeric component
        if (numeric !== null) {
          numeric = numeric[0];  // get the string

          return getUnitValue (target.parentElement, numeric, unit);
        }
        return 0;
      }

      function jx_Workbook() {
        if(!(this instanceof jx_Workbook)) return new jx_Workbook();
        this.SheetNames = [];
        this.Sheets = {};
      }

      function jx_s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

      function jx_datenum(v, date1904) {
        if(date1904) v+=1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
      }

      function jx_createSheet(data) {
        var ws = {};
        var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
        for(var R = 0; R != data.length; ++R) {
          for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v === null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
              cell.t = 'n'; cell.z = XLSX.SSF._table[14];
              cell.v = jx_datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
          }
        }

        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
      }

      function strHashCode (str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
          chr   = str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      }

      function downloadFile(filename, header, data) {

        var ua = window.navigator.userAgent;
        if (filename !== false && (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./))) {
          if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(new Blob([data]), filename);
          else {
            // Internet Explorer (<= 9) workaround by Darryl (https://github.com/dawiong/tableExport.jquery.plugin)
            // based on sampopes answer on http://stackoverflow.com/questions/22317951
            // ! Not working for json and pdf format !
            var frame = document.createElement("iframe");

            if (frame) {
              document.body.appendChild(frame);
              frame.setAttribute("style", "display:none");
              frame.contentDocument.open("txt/html", "replace");
              frame.contentDocument.write(data);
              frame.contentDocument.close();
              frame.focus();

              frame.contentDocument.execCommand("SaveAs", true, filename);
              document.body.removeChild(frame);
            }
          }
        }
        else {
          var DownloadLink = document.createElement('a');

          if (DownloadLink) {
            var blobUrl = null;

            DownloadLink.style.display = 'none';
            if (filename !== false)
              DownloadLink.download = filename;
            else
              DownloadLink.target = '_blank';

            if ( typeof data == 'object' ) {
              blobUrl = window.URL.createObjectURL(data);
              DownloadLink.href = blobUrl;
            }
            else if (header.toLowerCase().indexOf("base64,") >= 0)
              DownloadLink.href = header + base64encode(data);
            else
              DownloadLink.href = header + encodeURIComponent(data);

            document.body.appendChild(DownloadLink);

            if (document.createEvent) {
              if (DownloadEvt === null)
                DownloadEvt = document.createEvent('MouseEvents');

              DownloadEvt.initEvent('click', true, false);
              DownloadLink.dispatchEvent(DownloadEvt);
            }
            else if (document.createEventObject)
              DownloadLink.fireEvent('onclick');
            else if (typeof DownloadLink.onclick == 'function')
              DownloadLink.onclick();

            if (blobUrl)
              window.URL.revokeObjectURL(blobUrl);

            document.body.removeChild(DownloadLink);
          }
        }
      }

      function utf8Encode(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          }
          else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }

      function base64encode(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = utf8Encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
                  keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
      }

      return this;
    }
  });
})(jQuery);
