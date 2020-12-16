(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        if (typeof angular === 'undefined') {
            factory(require('angular'));
        } else {
            factory(angular);
        }
        module.exports = 'ngDialogExtension';
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    angular
        .module('ngDialog.extension', [ 'ngDialog' ])
        .config(['ngDialogProvider', function (ngDialogProvider) {

            ngDialogProvider.setDefaults({
              className: 'ngdialog-theme-default',
              appendClassName: '',
              disableAnimation: false,
              plain: false,
              showClose: true,
              closeByDocument: true,
              closeByEscape: true,
              closeByNavigation: false,
              appendTo: false,
              preCloseCallback: false,
              overlay: true,
              cache: true,
              trapFocus: true,
              preserveFocus: true,
              ariaAuto: true,
              ariaRole: 'dialog',
              ariaLabelledById: null,
              ariaLabelledBySelector: null,
              ariaDescribedById: null,
              ariaDescribedBySelector: null,
              bodyClassName: 'ngdialog-open',
              width: null,
              height: null
            });
          }]).config(['$provide', function ($provide) {
        
            $provide.decorator('ngDialog', ['$delegate', function ngDialogDecorator($delegate) {
        
              $delegate.__PRIVATE__.filterTabbableElements = function (els) {
                var tabbableFocusableElements = [];
        
                for (var i = 0; i < els.length; i++) {
                  var $el = angular.element(els[i]);
        
                  if ($el.attr('tabindex') !== '-1') {
                    tabbableFocusableElements.push($el[0]);
                  }
                }
        
                return tabbableFocusableElements;
              };
        
              $delegate.__PRIVATE__.filterVisibleElements = function (els) {
                var visibleFocusableElements = [];
        
                for (var i = 0; i < els.length; i++) {
                  var $el = angular.element(els[i]);
        
                  if ($el[0].offsetWidth > 0 || $el[0].offsetHeight > 0) {
                    visibleFocusableElements.push($el[0]);
                  } else if ($el.children().length && $el.children().is(':visible')) {
                    visibleFocusableElements.push($el[0]);
                  }
                }
        
                return visibleFocusableElements;
              };
        
              var applyAriaAttributes = $delegate.__PRIVATE__.applyAriaAttributes;
        
              $delegate.__PRIVATE__.applyAriaAttributes = function ($dialog, options) {
        
                // Call the original `applyAriaAttributes` function
                applyAriaAttributes($dialog, options);
        
                // This allows us add aria-labels to dialogs
                $dialog.attr('aria-modal', 'true');
                if (options.ariaLabel) $dialog.attr('aria-label', '{{:: \'' + options.ariaLabel + '\' | translate }}');
        
                // This adds a <sprite-svg> X to close the dialog"
                var $dialogContent = void 0,
                    $closeButton = void 0;
        
                if ($dialog && $dialog.length && options.showClose) {
                  $dialogContent = angular.element($dialog.children()[1]);
        
                  if ($dialogContent && $dialogContent.length) {
                    $closeButton = angular.element($dialogContent.children()[1]);
        
                    if ($closeButton && $closeButton.length) {
                      $closeButton.attr('ng-click', 'closeThisDialog()');
                      $closeButton.prepend('<sprite-svg name="ico-x" size="small" aria-hidden="true"></sprite-svg>');
        
                      // We need to put the close button before the rest of the content
                      // so the tab order matches the order in the DOM
                      $dialogContent[0].insertBefore($dialogContent[0].childNodes[1], $dialogContent[0].childNodes[0]);
                    }
                  }
                }
              };
        
              return $delegate;
            }]);
          }])
}));