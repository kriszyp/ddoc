define(['dgrid/OnDemandGrid', 'dgrid/Tree', 'dgrid/Selection', 'put-selector/put', 'dojo/store/Memory', 'dojo/_base/declare', 'dojo/domReady!'], function(Grid, Tree, Selection, put, Memory, declare){
	var elements = document.getElementById("content").getElementsByTagName("*");
	var root = {children:[]}, current;
	var nextId = 1;
	var stack = [root];
	for(var i = 0, l = elements.length; i < l; i++){
		var element = elements[i];
		var tagName = element.tagName;
		if(tagName.charAt(0) == 'H'){
			var depth = +tagName.charAt(1);
			while(stack.length > depth){
				stack.pop();
			}
			current = stack[stack.length - 1];
			while(stack.length < depth + 1){
				current.children.push(current = {id:nextId, children:[]});
				stack.push(current);
			}
			current.description = element.innerHTML;
			put(element, '-a[name=$]', nextId); 
			i++; // skip ahead because put creates a new element
			nextId++;
		}
	}
	var grid = new (declare([Grid, Selection]))({
		columns: {
			description: new Tree({label: "Contents", sortable: false}),
		},
		store: new Memory({
			data: root.children,
			getChildren: function(parent){
				return parent.children;
			},
			mayHaveChildren: function(parent){
				return parent.children.length;				
			}
		})
	}, "toc");
	grid.on("dgrid-select", function(event){
		location.hash = event.row.data.id;
	});
});