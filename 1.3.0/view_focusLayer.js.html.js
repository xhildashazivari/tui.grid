tui.util.defineNamespace("fedoc.content", {});
fedoc.content["view_focusLayer.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Class for the layer view that represents the currently focused cell\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar View = require('../base/view');\nvar CELL_BORDER_WIDTH = require('../common/constMap').dimension.CELL_BORDER_WIDTH;\nvar classNameConst = require('../common/classNameConst');\n\nvar HTML_BORDER_DIV = '&lt;div class=\"' + classNameConst.LAYER_FOCUS_BORDER + '\">&lt;/div>';\n\n/**\n * Class for the layer view that represents the currently focused cell\n * @module view/focusLayer\n * @extends module:base/view\n */\nvar FocusLayer = View.extend(/**@lends module:view/focusLayer.prototype */{\n    /**\n     * @constructs\n     * @param {Object} options - Options\n     */\n    initialize: function(options) {\n        this.focusModel = options.focusModel;\n        this.columnModel = options.columnModel;\n        this.dimensionModel = options.dimensionModel;\n        this.whichSide = options.whichSide;\n\n        this.borderEl = {\n            $top: $(HTML_BORDER_DIV),\n            $left: $(HTML_BORDER_DIV),\n            $right: $(HTML_BORDER_DIV),\n            $bottom: $(HTML_BORDER_DIV)\n        };\n\n        this.listenTo(this.dimensionModel, 'columnWidthChanged', this._onColumnWidthChanged);\n        this.listenTo(this.focusModel, 'blur', this._onBlur);\n        this.listenTo(this.focusModel, 'focus', this._onFocus);\n        // this.listenTo(this.focusModel, 'change:editingAddress', this._onChangeEditingAddress);\n    },\n\n    className: classNameConst.LAYER_FOCUS,\n\n    /**\n     * Event handler for 'columnWidthChanged' event on the module:model/dimension\n     * @private\n     */\n    _onColumnWidthChanged: function() {\n        var focusModel = this.focusModel;\n\n        if (this.$el.is(':visible')) {\n            this._refreshBorderLayout(focusModel.get('rowKey'), focusModel.get('columnName'));\n        }\n    },\n\n    /**\n     * Event handler for 'blur' event on the module:model/focus\n     * @private\n     */\n    _onBlur: function() {\n        this.$el.hide();\n    },\n\n    /**\n     * Event handler for 'focus' event on module:model/focus\n     * @param {Number} rowKey - target row key\n     * @param {String} columnName - target column name\n     * @private\n     */\n    _onFocus: function(rowKey, columnName) {\n        var targetSide = this.columnModel.isLside(columnName) ? 'L' : 'R';\n\n        if (targetSide === this.whichSide) {\n            this._refreshBorderLayout(rowKey, columnName);\n            this.$el.show();\n        }\n    },\n\n    _onChangeEditingAddress: function(focusModel, address) {\n        if (address) {\n            this.$el.hide();\n        } else {\n            this.$el.show();\n        }\n    },\n\n    /**\n     * Resets the position and the dimension of the layer.\n     * @param {Number} rowKey - row key\n     * @param {String} columnName - column name\n     * @private\n     */\n    _refreshBorderLayout: function(rowKey, columnName) {\n        var pos = this.dimensionModel.getCellPosition(rowKey, columnName);\n        var width = pos.right - pos.left;\n        var height = pos.bottom - pos.top;\n\n        this.borderEl.$left.css({\n            top: pos.top,\n            left: pos.left,\n            width: CELL_BORDER_WIDTH,\n            height: height + CELL_BORDER_WIDTH\n        });\n\n        this.borderEl.$top.css({\n            top: pos.top === 0 ? CELL_BORDER_WIDTH : pos.top,\n            left: pos.left,\n            width: width + CELL_BORDER_WIDTH,\n            height: CELL_BORDER_WIDTH\n        });\n\n        this.borderEl.$right.css({\n            top: pos.top,\n            left: pos.left + width,\n            width: CELL_BORDER_WIDTH,\n            height: height + CELL_BORDER_WIDTH\n        });\n\n        this.borderEl.$bottom.css({\n            top: pos.top + height,\n            left: pos.left,\n            width: width + CELL_BORDER_WIDTH,\n            height: CELL_BORDER_WIDTH\n        });\n    },\n\n    /**\n     * Render\n     * @returns {Object} this instance\n     */\n    render: function() {\n        var $el = this.$el;\n\n        _.each(this.borderEl, function($border) {\n            $el.append($border);\n        });\n        $el.hide();\n\n        return this;\n    }\n});\n\nmodule.exports = FocusLayer;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"