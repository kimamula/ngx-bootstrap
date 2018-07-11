import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { ComponentLoaderFactory } from '../component-loader/component-loader.factory';
import { BsDatepickerContainerComponent } from './themes/bs/bs-datepicker-container.component';
import { Subject } from 'rxjs';
import { BsDatepickerConfig } from './bs-datepicker.config';
var BsDatepickerDirective = /** @class */ (function () {
    function BsDatepickerDirective(_config, _elementRef, _renderer, _viewContainerRef, cis) {
        this._config = _config;
        /**
           * Placement of a datepicker. Accepts: "top", "bottom", "left", "right"
           */
        this.placement = 'bottom';
        /**
           * Specifies events that should trigger. Supports a space separated list of
           * event names.
           */
        this.triggers = 'click';
        /**
           * Close datepicker on outside click
           */
        this.outsideClick = true;
        /**
           * A selector specifying the element the datepicker should be appended to.
           * Currently only supports "body".
           */
        this.container = 'body';
        /**
           * Emits when datepicker value has been changed
           */
        this.bsValueChange = new EventEmitter();
        this._subs = [];
        this._dateInputFormat$ = new Subject();
        // todo: assign only subset of fields
        Object.assign(this, this._config);
        this._datepicker = cis.createLoader(_elementRef, _viewContainerRef, _renderer);
        this.onShown = this._datepicker.onShown;
        this.onHidden = this._datepicker.onHidden;
    }
    Object.defineProperty(BsDatepickerDirective.prototype, "isOpen", {
        get: /**
           * Returns whether or not the datepicker is currently being shown
           */
        function () {
            return this._datepicker.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerDirective.prototype, "bsValue", {
        set: /**
           * Initial value of datepicker
           */
        function (value) {
            if (this._bsValue === value) {
                return;
            }
            this._bsValue = value;
            this.bsValueChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerDirective.prototype, "bsConfig", {
        get: function () {
            return this._bsConfig;
        },
        set: /**
           * Config object for datepicker
           */
        function (bsConfig) {
            this._bsConfig = bsConfig;
            this.setConfig();
            this._dateInputFormat$.next(bsConfig && bsConfig.dateInputFormat);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerDirective.prototype, "dateInputFormat$", {
        get: function () {
            return this._dateInputFormat$;
        },
        enumerable: true,
        configurable: true
    });
    BsDatepickerDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._datepicker.listen({
            outsideClick: this.outsideClick,
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
        this.setConfig();
    };
    BsDatepickerDirective.prototype.ngOnChanges = function (changes) {
        if (!this._datepickerRef || !this._datepickerRef.instance) {
            return;
        }
        if (changes.minDate) {
            this._datepickerRef.instance.minDate = this.minDate;
        }
        if (changes.maxDate) {
            this._datepickerRef.instance.maxDate = this.maxDate;
        }
        if (changes.isDisabled) {
            this._datepickerRef.instance.isDisabled = this.isDisabled;
        }
    };
    /**
     * Opens an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    /**
       * Opens an element’s datepicker. This is considered a “manual” triggering of
       * the datepicker.
       */
    BsDatepickerDirective.prototype.show = /**
       * Opens an element’s datepicker. This is considered a “manual” triggering of
       * the datepicker.
       */
    function () {
        var _this = this;
        if (this._datepicker.isShown) {
            return;
        }
        this.setConfig();
        this._datepickerRef = this._datepicker
            .provide({ provide: BsDatepickerConfig, useValue: this._config })
            .attach(BsDatepickerContainerComponent)
            .to(this.container)
            .position({ attachment: this.placement })
            .show({ placement: this.placement });
        // if date changes from external source (model -> view)
        this._subs.push(this.bsValueChange.subscribe(function (value) {
            _this._datepickerRef.instance.value = value;
        }));
        // if date changes from picker (view -> model)
        this._subs.push(this._datepickerRef.instance.valueChange.subscribe(function (value) {
            _this.bsValue = value;
            _this.hide();
        }));
    };
    /**
     * Closes an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    /**
       * Closes an element’s datepicker. This is considered a “manual” triggering of
       * the datepicker.
       */
    BsDatepickerDirective.prototype.hide = /**
       * Closes an element’s datepicker. This is considered a “manual” triggering of
       * the datepicker.
       */
    function () {
        if (this.isOpen) {
            this._datepicker.hide();
        }
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    /**
     * Toggles an element’s datepicker. This is considered a “manual” triggering
     * of the datepicker.
     */
    /**
       * Toggles an element’s datepicker. This is considered a “manual” triggering
       * of the datepicker.
       */
    BsDatepickerDirective.prototype.toggle = /**
       * Toggles an element’s datepicker. This is considered a “manual” triggering
       * of the datepicker.
       */
    function () {
        if (this.isOpen) {
            return this.hide();
        }
        this.show();
    };
    /**
     * Set config for datepicker
     */
    /**
       * Set config for datepicker
       */
    BsDatepickerDirective.prototype.setConfig = /**
       * Set config for datepicker
       */
    function () {
        this._config = Object.assign({}, this._config, this.bsConfig, {
            value: this._bsValue,
            isDisabled: this.isDisabled,
            minDate: this.minDate || this.bsConfig && this.bsConfig.minDate,
            maxDate: this.maxDate || this.bsConfig && this.bsConfig.maxDate
        });
    };
    BsDatepickerDirective.prototype.ngOnDestroy = function () {
        this._datepicker.dispose();
    };
    BsDatepickerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[bsDatepicker]',
                    exportAs: 'bsDatepicker'
                },] },
    ];
    /** @nocollapse */
    BsDatepickerDirective.ctorParameters = function () { return [
        { type: BsDatepickerConfig, },
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ViewContainerRef, },
        { type: ComponentLoaderFactory, },
    ]; };
    BsDatepickerDirective.propDecorators = {
        "placement": [{ type: Input },],
        "triggers": [{ type: Input },],
        "outsideClick": [{ type: Input },],
        "container": [{ type: Input },],
        "isOpen": [{ type: Input },],
        "onShown": [{ type: Output },],
        "onHidden": [{ type: Output },],
        "bsValue": [{ type: Input },],
        "bsConfig": [{ type: Input },],
        "isDisabled": [{ type: Input },],
        "minDate": [{ type: Input },],
        "maxDate": [{ type: Input },],
        "bsValueChange": [{ type: Output },],
    };
    return BsDatepickerDirective;
}());
export { BsDatepickerDirective };
//# sourceMappingURL=bs-datepicker.component.js.map