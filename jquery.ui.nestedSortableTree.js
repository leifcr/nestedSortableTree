// Generated by CoffeeScript 1.2.1-pre

/*
# Nested Tree based with data and rational number support
# based on jQuery sortable
# Written in CoffeeScript, as the syntax is nice.
#
# For debugging/ development it requires log4javascript
# 
# Derived from Manuele J Sarfattis work (https://github.com/mjsarfatti)
#
# Still under MIT license.
# Source can be found here:
# https://github.com/mjsarfatti
*/


(function() {
  var $;

  $ = jQuery;

  $.widget("ui.nestedSortableTree", $.ui.sortable, {
    options: {
      errorClass: "tree-error",
      listType: "ol",
      maxLevels: 0,
      nested_debug: true,
      tabSize: 20,
      rtl: false,
      use_rational_numbers: true,
      doNotClear: false,
      disableNesting: "no-nest",
      protectRoot: false,
      rootID: null,
      isAllowed: function(item, parent) {
        return true;
      },
      start: function(event, ui) {
        return ui.item.data('startIndex', ui.item.index());
      },
      stop: function(event, ui) {
        return ui.item.data('stopIndex', ui.item.index());
      }
    },
    _create: function() {
      var appender, kake;
      this.element.data("sortable", this.element.data("nestedSortableTree"));
      if (this.options.nested_debug) {
        this.nestedLogger = log4javascript.getLogger();
        kake = $("div#logger");
        appender = new log4javascript.InPageAppender("logger");
        appender.setWidth("100%");
        appender.setHeight("100%");
        appender.setThreshold(log4javascript.Level.ALL);
        this.nestedLogger.addAppender(appender);
      }
      this.log("nestedSortableTree create", false);
      if (!this.element.is(this.options.listType)) {
        throw new Error("nestedSortableTree: Wrong listtype... " + (this.element.get(0).tagname) + " is not " + options.listtype);
      }
      return $.ui.sortable.prototype._create.apply(this, arguments);
    },
    destroy: function() {
      this.log("nestedSortableTree destroy");
      this.element.removeData("nestedSortableTree").unbind(".nestedSortableTree");
      return $.ui.sortable.prototype.destroy.apply(this, arguments);
    },
    log: function(msg, node_text) {
      if (node_text == null) node_text = true;
      if (this.options.nested_debug) {
        if (node_text) {
          return this.nestedLogger.debug("" + (this.element_text_without_children(this.currentItem)) + ": ", msg);
        } else {
          return this.nestedLogger.debug(msg);
        }
      }
    },
    element_text_without_children: function(node) {
      var rettext;
      if (typeof node === 'undefined') return "undefined";
      if (!this.options.nested_debug) return "";
      if (node === null) return "null-object";
      rettext = node.clone().find("li").remove().end().text().replace(/(\r\n|\n|\r)/gm, "");
      rettext = rettext.replace(/(^\s*)|(\s*$)/gi, "");
      return rettext = rettext.replace(/[ ]{2,}/gi, " ");
    },
    _mouseDrag: function(event) {
      this.position = this._generatePosition(event);
      this.positionAbs = this._convertPositionTo("absolute");
      if (!this.lastPositionAbs) this.lastPositionAbs = this.positionAbs;
      this._internal_do_scrolling(event);
      this.positionAbs = this._convertPositionTo("absolute");
      this.previousTopOffset = this.placeholder.offset().top;
      if (!this.options.axis || this.options.axis !== "y") {
        this.helper[0].style.left = this.position.left + "px";
      }
      if (!this.options.axis || this.options.axis !== "x") {
        this.helper[0].style.top = this.position.top + "px";
      }
      this._internal_rearrange(event);
      this._contactContainers(event);
      if ($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
      this._trigger("sort", event, this._uiHash());
      this.lastPositionAbs = this.positionAbs;
      return false;
    },
    _mouseStop: function(event, noPropagation) {
      var i, item;
      if (this.beyondMaxLevels) {
        this.placeholder.removeClass(this.options.errorClass);
        if (this.domPosition.prev) {
          $(this.domPosition.prev).after(this.placeholder);
        } else {
          $(this.domPosition.parent).prepend(this.placeholder);
        }
        this._trigger("revert", event, this._uiHash());
      }
      while (i >= 0) {
        i = this.items.length - 1;
        item = this.items[i].item[0];
        this._clearEmpty(item);
        i--;
      }
      $.ui.sortable.prototype._mouseStop.apply(this, arguments);
      this.previous_anc_keys = this._get_ancestor_keys(this.currentItem[0]);
      return false;
    },
    _clear: function(event) {
      var retval;
      retval = $.ui.sortable.prototype._clear.apply(this, arguments);
      if (this.options.use_rational_numbers) this._update_nv_dv();
      return retval;
    },
    _update_nv_dv: function(event) {
      var new_anc_keys, new_keys, startIndex, stopIndex;
      new_anc_keys = this._get_ancestor_keys(this.currentItem[0]);
      startIndex = this.currentItem.data("startIndex");
      stopIndex = this.currentItem.data("stopIndex");
      if ((this._compare_keys(this.previous_anc_keys, new_anc_keys)) && (startIndex === stopIndex)) {
        this.log("_update_nv_dv: Same position. Item not moved");
        return false;
      }
      new_keys = this._create_keys_from_ancestor_keys(new_anc_keys, stopIndex + 1);
      this.log("_update_nv_dv: New keys " + (JSON.stringify(new_keys)));
      this._set_nv_dv(this.currentItem, new_keys, new_anc_keys);
      return true;
    },
    _create_keys_from_ancestor_keys: function(ancestor_keys, position) {
      return this._create_key_array(ancestor_keys["nv"] + (ancestor_keys["snv"] * position), ancestor_keys["dv"] + (ancestor_keys["sdv"] * position), ancestor_keys["nv"] + (ancestor_keys["snv"] * (position + 1)), ancestor_keys["dv"] + (ancestor_keys["sdv"] * (position + 1)));
    },
    _compare_keys: function(keyset1, keyset2) {
      if (keyset1["nv"] === keyset2["nv"] && keyset1["dv"] === keyset2["dv"] && keyset1["snv"] === keyset2["snv"] && keyset1["sdv"] === keyset2["sdv"]) {
        return true;
      }
      return false;
    },
    _check_if_correct_ancestor: function(node) {
      this.log("_check_if_correct_ancestor");
      return false;
    },
    _check_if_conflicting_items: function(keys) {
      this.log("_check_if_conflicting_items");
      return false;
    },
    _get_conflicting_items: function(node) {
      return this.log("_get_conflicting_items");
    },
    _get_ancestor_keys: function(node) {
      var parentItem, parent_keys;
      parentItem = (node.parentNode.parentNode && $(node.parentNode.parentNode).closest(".ui-sortable").length ? $(node.parentNode.parentNode) : null);
      if (parentItem === null) parent_keys = this._create_key_array(0, 1, 1, 0);
      if (parentItem !== null) {
        parent_keys = this._create_key_array_from_data_attr(parentItem.data());
      }
      return parent_keys;
    },
    _sibling_count: function(node) {
      return 0;
    },
    _position_from_nv_dv: function(node) {
      return 0;
    },
    _position_from_parent: function(node) {},
    _set_nv_dv: function(node, keys, ancestor_keys, check_conflict) {
      var child, conflict_node, items, new_keys, _i, _len, _ref;
      if (check_conflict == null) check_conflict = true;
      node.attr("data-nv", keys["nv"]);
      node.attr("data-dv", keys["dv"]);
      node.attr("data-snv", keys["snv"]);
      node.attr("data-sdv", keys["sdv"]);
      this.log("" + (this.element_text_without_children(node)) + ": _set_nv_dv " + (JSON.stringify(keys)), false);
      if (check_conflict) {
        items = $("li[data-nv=\"" + keys["nv"] + "\"][data-dv=\"" + keys["dv"] + "\"][id != \"" + (node.attr("id")) + "\"]");
        this.log("Number of conflicting items: " + items.length);
        if (items.length > 0) {
          this.log("Conflicting item " + (this.element_text_without_children($(items[0]))) + " Index: " + ($(items[0]).index()));
          this.log("Node idx " + (node.index()));
          conflict_node = $(items[0]);
          new_keys = this._create_keys_from_ancestor_keys(ancestor_keys, conflict_node.index() + 1);
          this.log("Conflicting node New keys " + (JSON.stringify(new_keys)));
          this._set_nv_dv(conflict_node, new_keys, ancestor_keys);
        }
      }
      _ref = node.children(this.options.listType);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this._set_nv_dv_xl_child($(child), keys);
      }
      return true;
    },
    _set_nv_dv_xl_child: function(node, parent_keys) {
      var child, i, _i, _len, _ref;
      _ref = node.children("li");
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        this._set_nv_dv_li_child($(child), parent_keys, i + 1);
      }
      return true;
    },
    _set_nv_dv_li_child: function(node, parent_keys, idx) {
      var child, new_keys, _i, _len, _ref;
      this.log("" + (this.element_text_without_children($(node))) + ": Moving child item, idx: " + idx, false);
      new_keys = this._create_keys_from_ancestor_keys(parent_keys, idx);
      this._set_nv_dv(node, new_keys, parent_keys, false);
      _ref = node.children(this.options.listType);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this._set_nv_dv_xl_child(child, new_keys);
      }
      return true;
    },
    _create_key_array: function(nv, dv, snv, sdv) {
      var key_array;
      return key_array = {
        nv: nv,
        dv: dv,
        snv: snv,
        sdv: sdv
      };
    },
    _create_key_array_from_data_attr: function(data_attr) {
      return this._create_key_array(data_attr["nv"], data_attr["dv"], data_attr["snv"], data_attr["sdv"]);
    },
    _internal_rearrange: function(event) {
      var childLevels, i, intersection, item, itemElement, level, nextItem, o, parentItem, previousItem;
      o = this.options;
      i = this.items.length;
      while (i > 0) {
        i--;
        item = this.items[i];
        itemElement = item.item[0];
        intersection = this._intersectsWithPointer(item);
        if (!intersection) continue;
        if (itemElement !== this.currentItem[0] && this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement && !$.contains(this.placeholder[0], itemElement) && (o.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)) {
          $(itemElement).mouseenter();
          this.direction = (intersection === 1 ? "down" : "up");
          if (o.tolerance === "pointer" || this._intersectsWithSides(item)) {
            $(itemElement).mouseleave();
            this._rearrange(event, item);
          } else {
            break;
          }
          this._clearEmpty(itemElement);
          this._trigger("change", event, this._uiHash());
          break;
        }
      }
      parentItem = (this.placeholder[0].parentNode.parentNode && $(this.placeholder[0].parentNode.parentNode).closest(".ui-sortable").length ? $(this.placeholder[0].parentNode.parentNode) : null);
      level = this._getLevel(this.placeholder);
      childLevels = this._getChildLevels(this.helper);
      previousItem = (this.placeholder[0].previousSibling ? $(this.placeholder[0].previousSibling) : null);
      if (previousItem != null) {
        while (previousItem[0].nodeName.toLowerCase() !== "li" || previousItem[0] === this.currentItem[0] || previousItem[0] === this.helper[0]) {
          if (previousItem[0].previousSibling) {
            previousItem = $(previousItem[0].previousSibling);
          } else {
            previousItem = null;
            break;
          }
        }
      }
      nextItem = (this.placeholder[0].nextSibling ? $(this.placeholder[0].nextSibling) : null);
      if (nextItem != null) {
        while (nextItem[0].nodeName.toLowerCase() !== "li" || nextItem[0] === this.currentItem[0] || nextItem[0] === this.helper[0]) {
          if (nextItem[0].nextSibling) {
            nextItem = $(nextItem[0].nextSibling);
          } else {
            nextItem = null;
            break;
          }
        }
      }
      this.beyondMaxLevels = 0;
      if ((parentItem != null) && !(nextItem != null) && (o.rtl && (this.positionAbs.left + this.helper.outerWidth() > parentItem.offset().left + parentItem.outerWidth()) || !o.rtl && (this.positionAbs.left < parentItem.offset().left))) {
        parentItem.after(this.placeholder[0]);
        this._clearEmpty(parentItem[0]);
        this._trigger("change", event, this._uiHash());
      } else if ((previousItem != null) && (o.rtl && (this.positionAbs.left + this.helper.outerWidth() < previousItem.offset().left + previousItem.outerWidth() - o.tabSize) || !o.rtl && (this.positionAbs.left > previousItem.offset().left + o.tabSize))) {
        this._isAllowed(previousItem, level, level + childLevels + 1);
        if (!previousItem.children(o.listType).length) {
          previousItem[0].appendChild(document.createElement(o.listType));
        }
        if (this.previousTopOffset && (this.previousTopOffset <= previousItem.offset().top)) {
          previousItem.children(o.listType).prepend(this.placeholder);
        } else {
          previousItem.children(o.listType)[0].appendChild(this.placeholder[0]);
        }
        this._trigger("change", event, this._uiHash());
      } else {
        this._isAllowed(parentItem, level, level + childLevels);
      }
      return true;
    },
    _internal_do_scrolling: function(event) {
      var o, scrolled;
      if (this.options.scroll) {
        o = this.options;
        scrolled = false;
        if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
          if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
          } else {
            if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
              this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
            }
          }
          if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else {
            if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
              this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
            }
          }
        } else {
          if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
          } else {
            if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
            }
          }
          if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
          } else {
            if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
            }
          }
        }
        if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
          $.ui.ddmanager.prepareOffsets(this, event);
        }
        return true;
      }
    },
    _clearEmpty: function(item) {
      var emptyList;
      emptyList = $(item).children(this.options.listType);
      if (emptyList.length && !emptyList.children().length && !this.options.doNotClear) {
        return emptyList.remove();
      }
    },
    _getLevel: function(item) {
      var level, list;
      level = 1;
      if (this.options.listType) {
        list = item.closest(this.options.listType);
        while (!list.is(".ui-sortable")) {
          level++;
          list = list.parent().closest(this.options.listType);
        }
      }
      return level;
    },
    _getChildLevels: function(parent, depth) {
      var o, result, self;
      self = this;
      o = this.options;
      result = 0;
      depth = depth || 0;
      $(parent).children(o.listType).children(o.items).each(function(index, child) {
        return result = Math.max(self._getChildLevels(child, depth + 1), result);
      });
      if (depth) {
        return result + 1;
      } else {
        return result;
      }
    },
    _isAllowed: function(parentItem, level, levels) {
      var o;
      o = this.options;
      if (!(parentItem != null) || !(parentItem.hasClass(o.disableNesting))) {
        if (o.maxLevels < levels && o.maxLevels !== 0) {
          this.placeholder.addClass(o.errorClass);
          return this.beyondMaxLevels = levels - o.maxLevels;
        } else {
          this.placeholder.removeClass(o.errorClass);
          return this.beyondMaxLevels = 0;
        }
      } else {
        this.placeholder.addClass(o.errorClass);
        if (o.maxLevels < levels && o.maxLevels !== 0) {
          return this.beyondMaxLevels = levels - o.maxLevels;
        } else {
          return this.beyondMaxLevels = 1;
        }
      }
    },
    toArray: function(options) {
      var left, o, _master_this;
      o = $.extend({}, this.options, options);
      this.startDepth = o.startDepthCount || 0;
      this.ret_arr = [];
      left = 2;
      this.ret_arr.push({
        item_id: o.rootID,
        parent_id: "none",
        depth: this.startDepth,
        left: 1,
        right: ($(o.items, this.element).length + 1) * 2,
        nv: 0,
        dv: 1,
        snv: 1,
        sdv: 0
      });
      _master_this = this;
      $(this.element).children(o.items).each(function() {
        return left = _master_this._recursiveArray($(this), _master_this.startDepth + 1, o, _master_this, left);
      });
      this.ret_arr = this.ret_arr.sort(function(a, b) {
        return a.left - b.left;
      });
      return this.ret_arr;
    },
    _recursiveArray: function(item, depth, o, master, left) {
      var id, parentItem, pid, right;
      right = left + 1;
      id = void 0;
      pid = void 0;
      if (item.children(o.listType).children(o.items).length > 0) {
        depth++;
        item.children(o.listType).children(o.items).each(function() {
          return right = master._recursiveArray($(this), depth, o, master, right);
        });
        depth--;
      }
      id = (item.attr(o.attribute || "id")).match(o.expression || /(.+)[-=_](.+)/);
      if (depth === this.startDepth + 1) {
        pid = o.rootID;
      } else {
        parentItem = (item.parent(o.listType).parent(o.items).attr(o.attribute || "id")).match(o.expression || /(.+)[-=_](.+)/);
        pid = parentItem[2];
      }
      if (id) {
        this.ret_arr.push({
          item_id: id[2],
          parent_id: pid,
          depth: depth,
          left: left,
          right: right,
          nv: item.attr("data-nv"),
          dv: item.attr("data-dv"),
          snv: item.attr("data-snv"),
          sdv: item.attr("data-sdv")
        });
      }
      left = right + 1;
      return left;
    }
  });

  $.ui.nestedSortableTree.prototype.options = $.extend({}, $.ui.sortable.prototype.options, $.ui.nestedSortableTree.prototype.options);

}).call(this);
