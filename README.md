# nestedSortable jQuery plugin

*nestedSortable* is a jQuery plugin that extends jQuery Sortable UI functionalities to nested lists.

## Features

- Designed to work seamlessly with the [nested](http://articles.sitepoint.com/article/hierarchical-data-database "A Sitepoint tutorial on PHP, MYSQL and nested sets") [set](http://en.wikipedia.org/wiki/Nested_set_model "Wikipedia article on nested sets") model (have a look at the `toArray` method)
- Items can be sorted in their own list, moved across the tree, or nested under other items.
- Sublists are created and deleted on the fly
- All jQuery Sortable options, events and methods are available
- It is possible to define elements that will not accept a new nested item/list and a maximum depth for nested items
- The root level can be protected

## Difference between this and original version
- Support rational numbers for sorting
- Serialized data is out - only support array, as you do need a lot of data... use json to serialize the array if needed.
## Usage

```
<ol class="sortable">
	<li><div>I'm a bear</div></li>
	<li>
		<div>I'm the second bear</div>
		<ol>
			<li><div>I'm a child bear</div></li>
			<li><div>I'm the brother child bear</div></li>
		</ol>
	</li>
	<li><div>And I'm the third bear</div></li>
</ol>
```

```
	$(document).ready(function(){

		$('.sortable').nestedSortable({
			handle: 'div',
			items: 'li',
			toleranceElement: '> div'
		});

	});
```

Please note: every `<li>` must have either one or two direct children, the first one being a container element (such as `<div>` in the above example), and the (optional) second one being the nested list. The container element has to be set as the 'toleranceElement' in the options, and this, or one of its children, as the 'handle'.

Also, the default list type is `<ol>`.

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

*nestedSortable* doesn't work properly with connected draggables, because of the way Draggable simulates Sortable `mouseStart` and `mouseStop` events. This bug might or might not be fixed some time in the future (it's not specific to this plugin).

## Requirements

jQuery 1.4+  
jQuery UI Sortable 1.8+

## Browser Compatibility

Tested with: IE 6/7/8, Firefox 3.6/4, Chrome, Safari 3

## License

This work is licensed under the MIT License.

This work is *pizzaware*. Please consider offering the original author a pizza or donate to him. If you visit Copenhagen, a beer without a bear is always good.