# nestedSortable jQuery plugin

*nestedSortableTree* is a jQuery plugin that extends jQuery Sortable UI functionalities to nested lists with rational number sorting.
## Features

- Designed to work seamlessly with nested set AND rational number sorting method)
- MUST have a proper browser supporting data attributes. 
- Items can be sorted in their own list, moved across the tree, or nested under other items.
- Sublists are created and deleted on the fly
- All jQuery Sortable options, events and methods are available

## Difference between this and original version
- Support rational numbers for sorting
- Serialized data is out - only support array, as you do need a lot of data... use json to serialize the array if needed.

## Not supported functions: (yet)
- It is possible to define elements that will not accept a new nested item/list and a maximum depth for nested items
- The root level can be protected ()

## Usage

```
  <ol class="sortable ui-sortable">
      <li id="node_1" data-nv="1" data-dv="1" data-snv="2" data-sdv="1"><div>Node 1</div>
        <ol>
          <li id="node_2" data-nv="3" data-dv="2" data-snv="5" data-sdv="3"><div>Node 1.1</div></li>
          <li id="node_3" data-nv="5" data-dv="3" data-snv="7" data-sdv="4"><div>Node 1.2</div></li>
        </ol>
      </li>
      <li id="node_4" data-nv="2" data-dv="1" data-snv="3" data-sdv="1"> <div>Node 2</div></li>
  </ol>
```

```
  $(document).ready(function(){
    $('ol.sortable').nestedSortableTree({
      debug: true,
      // disableNesting: 'no-nest',
      forcePlaceholderSize: true,
      handle: 'div',
      helper: 'clone',
      items: 'li',
      // maxLevels: 3,
      opacity: .75,
      placeholder: 'placeholder',
      revert: 150,
      tabSize: 25,
      tolerance: 'pointer',
      toleranceElement: '> div'
    });
```

Please note: every `<li>` must have either one or two direct children, the first one being a container element (such as `<div>` in the above example), and the (optional) second one being the nested list. The container element has to be set as the 'toleranceElement' in the options, and this, or one of its children, as the 'handle'.

Also, the default list type is `<ol>`.

## NOTE: Custom options aren't up to date... Please ignore

## Custom Options

<dl>
	<dt>tabSize</dt>
	<dd>How far right or left (in pixels) the item has to travel in order to be nested or to be sent outside its current list. Default: <b>20</b></dd>
	<dt>disableNesting</dt>
	<dd>The class name of the items that will not accept nested lists. Default: <b>ui-nestedSortable-no-nesting</b></dd>
	<dt>errorClass</dt>
	<dd>The class given to the placeholder in case of error. Default: <b>ui-nestedSortable-error</b></dd>
	<dt>listType</dt>
	<dd>The list type used (ordered or unordered). Default: <b>ol</b></dd>
	<dt>maxLevels</dt>
	<dd>The maximum depth of nested items the list can accept. If set to '0' the levels are unlimited. Default: <b>0</b></dd>
	<dt>protectRoot</dt>
	<dd>Wether to protect the root level (i.e. root items can be sorted but not nested, sub-items cannot become root items). Default: <b>false</b></dd>
	<dt>rootID</dt>
	<dd>The id given to the root element (set this to whatever suits your data structure). Default: <b>null</b></dd>
	<dt>rtl</dt>
	<dd>Set this to true if you have a right-to-left page. Default: <b>false</b></dd>
	<dt>isAllowed (function)</dt>
	<dd>You can specify a custom function to verify if a drop location is allowed. Default: <b>function(item, parent) { return true; }</b></dd>
</dl>

## Custom Methods

<dl>
	<dt>toArray</dt>
	<dd>Builds an array where each element is in the form:
<pre>setName[n] =>
{
	'item_id': itemId,
	'parent_id': parentId,
	'depth': depth,
	'left': left,
	'right': right,
}
</pre>
	It accepts the same options as the original Sortable method (<b>attribute</b> and <b>expression</b>) plus the custom <b>startDepthCount</b>, that sets the starting depth number (default is <b>0</b>).</dd>
</dl>

## Known Bugs

*nestedSortableTree* doesn't work properly with connected draggables, because of the way Draggable simulates Sortable `mouseStart` and `mouseStop` events. This bug might or might not be fixed some time in the future (it's not specific to this plugin).

## Requirements

jQuery
jQuery UI Sortable

## Browser Compatibility

Use a proper browser that supports data attributes. IE8 and older is out. :)

## License

This work is licensed under the MIT License.

This work is *pizzaware*. Please consider offering the original author a pizza or donate to him. If you visit Copenhagen, a beer is always good.