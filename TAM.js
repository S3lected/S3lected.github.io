/**
 * TAM plugin.
 */

/**
 * TAM BD Agent Shape:
 * allows multiplicity (stacking) and stick man to indicate human agent.
 * Control handle to move stick man
 */

// TAM BD Agent Shape: To define own shapes with behavior, extend MxShape

alert("Test")

function mxShapeTAMVertexAgent(bounds, fill, stroke, strokewidth) {
    mxShape.call(this);
    this.bounds = bounds;
    this.fill = fill;
    this.stroke = stroke;
    this.strokewidth = (strokewidth != null) ? strokewidth : 2;
    this.humany = 0.5;
    this.humanx = 0.5;
    this.multiple = 0;
    this.human = 0;
};
mxUtils.extend(mxShapeTAMVertexAgent, mxActor);

mxShapeTAMVertexAgent.prototype.cst = {
    AGENT: 'tamBDlibrary.agent2'
};

/**
* TAM BD Agent Shape
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeTAMVertexAgent.prototype.paintVertexShape = function (c, x, y, w, h) {
    c.translate(x, y);

    var humanx = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'humanx', this.humanx))));
    var humany = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'humany', this.humany))));
    var multiple = parseInt(mxUtils.getValue(this.style, 'multiple', this.multiple));
    var human = parseInt(mxUtils.getValue(this.style, 'human', this.human));
    var offset = 8;
    var stickmansize = 12;


    c.begin();

    // multiple
    if (multiple != 0) {
        // stacking
        c.moveTo(offset, offset);
        c.lineTo(offset, 0);
        c.lineTo(w, 0);
        c.lineTo(w, h - offset);
        c.lineTo(w - offset, h - offset);
        // rectangle
        c.lineTo(w - offset, h);
        c.lineTo(0, h);
        c.lineTo(0, offset);
        c.lineTo(w - offset, offset);
        c.lineTo(w - offset, h - offset);
        c.moveTo(offset, offset);
    } else {
        // rectangle
        c.moveTo(0, 0);
        c.lineTo(0, h);
        c.lineTo(w, h);
        c.lineTo(w, 0);
        c.lineTo(0, 0);
    }
    c.close();
    c.fillAndStroke();

    // human agent
    if (human != 0) {
        c.begin();
        // Kopf
        c.ellipse(humanx - stickmansize * 0.4, humany - stickmansize / 2 - stickmansize * 0.8, stickmansize * 0.8, stickmansize * 0.8);
        c.close();
        c.stroke();


        c.begin();
        // Hals
        c.moveTo(humanx, humany - stickmansize / 2);
        // Körper
        c.lineTo(humanx, humany + stickmansize / 2);
        // Beine
        c.lineTo(humanx + stickmansize / 2, humany + stickmansize * 1.5);
        c.moveTo(humanx, humany + stickmansize / 2);
        c.lineTo(humanx - stickmansize / 2, humany + stickmansize * 1.5);
        // Arme
        c.moveTo(humanx, humany - stickmansize / 3);
        c.lineTo(humanx + stickmansize / 2, humany + stickmansize / 3);
        c.moveTo(humanx, humany - stickmansize / 3);
        c.lineTo(humanx - stickmansize / 2, humany + stickmansize / 3);

        c.close();
        c.stroke();
    }
};

// Register TAM BD Agent Shape in Renderer
mxCellRenderer.registerShape(mxShapeTAMVertexAgent.prototype.cst.AGENT, mxShapeTAMVertexAgent);

// set Constraints of TAM BD Agent Shape
mxShapeTAMVertexAgent.prototype.constraints = null;

// Register TAM BD Agent Shape Handles
Graph.handleFactory[mxShapeTAMVertexAgent.prototype.cst.AGENT] = function (state) {
    var handles = [Graph.createHandle(state, ['humanx', 'humany'], function (bounds) {
        var humanx = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'humanx', this.humanx))));
        var humany = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'humany', this.humany))));

        return new mxPoint(bounds.x + humanx * bounds.width, bounds.y + humany * bounds.height);
    }, function (bounds, pt) {
        this.state.style['humanx'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
        this.state.style['humany'] = Math.round(100 * Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height))) / 100;
    })];

    return handles;

}


/**
 * TAM BD Mod. Access Shape:
 * draw two curved lines with arrows
 */

// <root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="3" value="" style="edgeStyle=none;curved=1;html=1;startArrow=classic;startFill=1;endArrow=none;endFill=0;jettySize=auto;orthogonalLoop=1;" edge="1" parent="1"><mxGeometry width="100" height="100" relative="1" as="geometry"><mxPoint x="270" y="420" as="sourcePoint"/><mxPoint x="270" y="330" as="targetPoint"/><Array as="points"><mxPoint x="300" y="380"/></Array></mxGeometry></mxCell></root>  
// TAM BD Mod. Access Shape: To define own shapes with behavior, extend MxShape

function mxShapeTAMEdgeModAccess(points, fill, stroke, strokewidth, arrowWidth, spacing, endSize) {
    mxShape.call(this);
    this.points = points;
    this.stroke = stroke;
    this.strokewidth = (strokewidth != null) ? strokewidth : 1;
    this.hx = 0.5;
    this.hy = 0.5;
    this.offset = 5;
    this.arcwidth = 10;
    this.horizontal = 0;
};
mxUtils.extend(mxShapeTAMEdgeModAccess, mxArrow);

mxShapeTAMEdgeModAccess.prototype.cst = {
    MODACCESS: 'tamBDlibrary.modaccess'
};
/**
* TAM BD Mod. Access Shape
* Function: paintEdgeShape
* 
* Paints the Edge shape.
*/
mxShapeTAMEdgeModAccess.prototype.paintEdgeShape = function (c, pts) {
    var p1 = pts[0], p2 = pts[pts.length - 1];
    var w = p2.x - p1.x, h = p2.y - p1.y;
    var l = Math.sqrt(w * w + h * h);

    var horizontal = parseInt(mxUtils.getValue(this.style, 'horizontal', this.horizontal));
    //var hx = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'hx', this.hx))));
    //var hy = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'hy', this.hy))));
    var offset = this.offset;
    var arcwidth = this.arcwidth;


    //    c.begin();
    //    if (horizontal != 0 ) {
    //      c.moveTo(p1.x, p1.y - offset );
    //      c.quadTo(p1.x + w / 2, p1.y - offset - arcwidth, p2.x, p2.y - offset);
    //      c.stroke();
    //      
    //      c.moveTo(p2.x, p2.y + offset );
    //      c.quadTo(p1.x + w / 2, p1.y + offset + arcwidth, p1.x, p1.y + offset);
    //      c.stroke();
    //    } else {
    //      // vertical mod. access
    //      c.moveTo(p1.x + offset, p1.y );
    //      c.quadTo(p1.x + offset + arcwidth, p1.y + h/2, p2.x + offset, p2.y);
    //      c.stroke();
    //      
    //      c.moveTo(p2.x - offset, p2.y);
    //      c.quadTo(p1.x - offset - arcwidth, p1.y + h/2, p1.x - offset, p1.y);
    //      c.stroke();
    //    }

    //   if (horizontal != 0 ) {
    //        // horizontal mod. access
    //        c.begin();
    //        c.moveTo(x1, y1 + hy - offset);
    //        c.quadTo(x1 + w/2, y1 + hy - offset - arcwidth, x2, y1 + hy - offset);
    //        //c.close();
    //        c.stroke();
    //        
    //        c.begin();
    //        c.moveTo(x2, y1 + hy + offset);
    //        c.quadTo(x1 + w/2, y1 + hy + offset + arcwidth, x1, y1 + hy + offset);
    //        //c.close();
    //        c.stroke();
    //    } else {
    //        // vertical mod. access
    //        c.begin();
    //        c.moveTo(x1 + hx - offset, y1);
    //        c.quadTo(x1 + hx - offset - arcwidth, y1 + h/2, x1 + hx - offset, y2);
    //        //c.close();
    //        c.stroke();
    //        
    //        c.begin();
    //        c.moveTo(x1 + hx + offset, y2);
    //        c.quadTo(x1 + hx + offset + arcwidth, y1 + h/2, x1 + hx + offset, y1);
    //        //c.close();
    //        c.stroke();
    //    }
};

// Register TAM BD BD Mod. Access Shape in Renderer
mxCellRenderer.registerShape(mxShapeTAMEdgeModAccess.prototype.cst.MODACCESS, mxShapeTAMEdgeModAccess);


Draw.loadPlugin(function(ui) {

    // Sidebar is null in lightbox
    if (ui.sidebar != null) {
        // Adds custom sidebar entry
	    ui.sidebar.addPalette('esolia', 'eSolia', true, function(content) {
	
	        // content.appendChild(ui.sidebar.createVertexTemplate(null, 120, 60));
	        content.appendChild(ui.sidebar.createVertexTemplate('shape=image;image=http://download.esolia.net.s3.amazonaws.com/img/eSolia-Logo-Color.svg;resizable=0;movable=0;rotatable=0', 100, 100));
	        content.appendChild(ui.sidebar.createVertexTemplate('text;spacingTop=-5;fontFamily=Courier New;fontSize=8;fontColor=#999999;resizable=0;movable=0;rotatable=0', 100, 100));
	        content.appendChild(ui.sidebar.createVertexTemplate('rounded=1;whiteSpace=wrap;gradientColor=none;fillColor=#004C99;shadow=1;strokeColor=#FFFFFF;align=center;fontColor=#FFFFFF;strokeWidth=3;fontFamily=Courier New;verticalAlign=middle', 100, 100));
	        content.appendChild(ui.sidebar.createVertexTemplate('curved=1;strokeColor=#004C99;endArrow=oval;endFill=0;strokeWidth=3;shadow=1;dashed=1', 100, 100));
	    });
	
	    // Collapses default sidebar entry and inserts this before
	    var c = ui.sidebar.container;
	    c.firstChild.click();
	    c.insertBefore(c.lastChild, c.firstChild);
	    c.insertBefore(c.lastChild, c.firstChild);
	
	    // Adds logo to footer
	    ui.footerContainer.innerHTML = '<img width=50px height=17px align="right" style="margin-top:14px;margin-right:12px;" ' + 'src="http://download.esolia.net.s3.amazonaws.com/img/eSolia-Logo-Color.svg"/>';
		
		// Adds placeholder for %today% and %filename%
	    var graph = ui.editor.graph;
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'today')
			{
				return new Date().toLocaleString();
			}
			else if (name == 'filename')
			{
				var file = ui.getCurrentFile();
				
				return (file != null && file.getTitle() != null) ? file.getTitle() : '';
			}
			
			return graphGetGlobalVariable.apply(this, arguments);
		};
		
		// Adds support for exporting PDF with placeholders
		var graphGetExportVariables = graph.getExportVariables;
		
		Graph.prototype.getExportVariables = function()
		{
			var vars = graphGetExportVariables.apply(this, arguments);
			var file = ui.getCurrentFile();
			
			vars['today'] = new Date().toLocaleString();
			vars['filename'] = (file != null && file.getTitle() != null) ? file.getTitle() : '';
			
			return vars;
		};
	
//	    // Adds resource for action
//	    mxResources.parse('helloWorldAction=Hello, World!');
//	
//	    // Adds action
//	    ui.actions.addAction('helloWorldAction', function() {
//	        var ran = Math.floor((Math.random() * 100) + 1);
//	        mxUtils.alert('A random number is ' + ran);
//	    });
//	
//	    // Adds menu
//	    ui.menubar.addMenu('Hello, World Menu', function(menu, parent) {
//	        ui.menus.addMenuItem(menu, 'helloWorldAction');
//	    });
//	
//	    // Reorders menubar
//	    ui.menubar.container.insertBefore(ui.menubar.container.lastChild,
//	        ui.menubar.container.lastChild.previousSibling.previousSibling);
//	
//	    // Adds toolbar button
//	    ui.toolbar.addSeparator();
//	    var elt = ui.toolbar.addItem('', 'helloWorldAction');
//	
//	    // Cannot use built-in sprites
//	    elt.firstChild.style.backgroundImage = 'url(https://www.draw.io/images/logo-small.gif)';
//	    elt.firstChild.style.backgroundPosition = '2px 3px';
    }

    // Adds custom sidebar entry
    var s = ui.sidebar;
    s.addPaletteFunctions('tamBDlibrary', 'TAM Block Diagram', false, [
        s.createVertexTemplateEntry("shape=tamBDlibrary.agent2;rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;humanx=0.5;humany=0.5;multiple=0;human=0;", 120, 60, "", "Agent", null, null, ""),
        s.createVertexTemplateEntry("shape=tamBDlibrary.agent2;rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;humanx=0.5;humany=0.5;multiple=1;human=0;", 120, 60, "", "Agent Multiple", null, null, ""),
        s.createVertexTemplateEntry("shape=tamBDlibrary.agent2;rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;humanx=0.5;humany=0.5;multiple=0;human=1;", 120, 60, "", "Human Agent", null, null, ""),
        s.createVertexTemplateEntry("rounded=1;whiteSpace=wrap;html=1;shadow=0;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;arcSize=50;", 120, 60, "", "Storage", null, null, "rounded rect rectangle box"),
        s.createVertexTemplateEntry("ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;shadow=0;", 20, 20, "", "Channel", 10, 10, "circle"),
        s.createEdgeTemplateEntry('shape=tamBDlibrary.modaccess;startArrow=none;endArrow=classic;rounded=1;hx=0.5;hy=0.5;horizontal=1;', 100, 100, "", "Hor. Modifying Access"),
        s.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;startArrow=none;endArrow=none;rounded=1;', 100, 100, "", "Access"),
        s.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;startArrow=none;endArrow=classic;rounded=1;', 100, 100, "", "directed access"),
        s.addEntry("tammodaccess", function () {
            var a = new mxCell("", new mxGeometry(0, 0, 0, 0), "startArrow=none;endArrow=none;rounded=1;");
            a.geometry.setTerminalPoint(new mxPoint(0, 0), true);
            a.geometry.setTerminalPoint(new mxPoint(100, 0), false);
            a.geometry.relative = true;
            a.edge = true;
            var b = new mxCell("", new mxGeometry(0, 0, 20, 20), "ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;shadow=0;");
            b.geometry.relative = true;
            b.setConnectable(false);
            b.vertex = true;
            b.geometry.offset =
                new mxPoint(-10, -10);
            a.insert(b);
            return s.createEdgeTemplateFromCells([a], 100, 0, "Channel 3")
        }),
        s.addEntry("tamchannel", function () {
            var a = new mxCell("", new mxGeometry(0, 0, 0, 0), "edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=none;endArrow=none;rounded=1;");
            a.geometry.setTerminalPoint(new mxPoint(0, 0), true);
            a.geometry.setTerminalPoint(new mxPoint(100, 0), false);
            a.geometry.relative = true;
            a.edge = true;
            var b = new mxCell("", new mxGeometry(0, 0, 20, 20), "ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;shadow=0;");
            b.geometry.relative = true;
            b.setConnectable(false);
            b.vertex = true;
            b.geometry.offset =
                new mxPoint(-10, -10);
            a.insert(b);
            return s.createEdgeTemplateFromCells([a], 100, 0, "Channel 2")
        }),
        s.addEntry("channelVert", function () {
            var channel = new mxCell("", new mxGeometry(0, 0, 20, 20), "ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;shadow=0;");
            channel.vertex = true;
            var fromEdge = new mxCell("", new mxGeometry(0, 0, 0, 0), "edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=none;endArrow=none;rounded=1;");
            fromEdge.geometry.setTerminalPoint(new mxPoint(10, -50), true);
            fromEdge.geometry.relative = true;
            fromEdge.edge = true;
            channel.insertEdge(fromEdge, false);

            var toEdge = new mxCell("", new mxGeometry(0, 0, 0, 0), "edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=none;endArrow=none;rounded=1;");
            toEdge.geometry.setTerminalPoint(new mxPoint(10, 50), false);
            toEdge.geometry.relative = true;
            toEdge.edge = true;
            channel.insertEdge(toEdge, true);
            return s.createVertexTemplateFromCells([channel, fromEdge, toEdge], 20, 100, "Channel Vertical")
        }),
        s.addEntry("channelVertReq", function () {
            var a = new mxCell("", new mxGeometry(0, 0, 0, 0), "edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=none;endArrow=none;rounded=1;");
            a.geometry.setTerminalPoint(new mxPoint(0, 0), true);
            a.geometry.setTerminalPoint(new mxPoint(100, 0), false);
            a.geometry.relative = true;
            a.edge = true;
            var b = new mxCell("", new mxGeometry(0, 0, 20, 20), "ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=#000000;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;shadow=0;");
            b.geometry.relative = true;
            b.setConnectable(false);
            b.vertex = true;
            b.geometry.offset =
                new mxPoint(-10, -10);
            var rr = new mxCell("", new mxGeometry(0, 0, 10, 1), "startArrow=none;endArrow=classic;");
            rr.geometry.setTerminalPoint(new mxPoint(0, 0), true);
            rr.geometry.setTerminalPoint(new mxPoint(20, 0), false);
            rr.geometry.relative = true;
            rr.edge = true;
            rr.geometry.offset =
                new mxPoint(-5, -30);
            b.insert(rr);
            a.insert(b);
            return s.createEdgeTemplateFromCells([a], 100, 0, "Channel 3")
        }),
        s.addEntry("curvedAccess", function () {
            var l = 50, w = 50, offset = 5, curve = 20, wc = w / 2;
            var conn = new mxCell("", new mxGeometry(0, 0, wc + (offset + curve), l), "strokeColor=none;endArrow=none;html=1;");
            conn.geometry.setTerminalPoint(new mxPoint(wc, 0), true);
            conn.geometry.setTerminalPoint(new mxPoint(wc, l), false);
            //conn.geometry.relative = true;
            conn.edge = true;
            var p1 = conn.geometry.getTerminalPoint(true);
            var p2 = conn.geometry.getTerminalPoint(false);
            var a = new mxCell("", new mxGeometry(0, 0, wc + (offset + curve), l), "curved=1;endArrow=classic;html=1;");
            a.geometry.setTerminalPoint(new mxPoint(p1.x + offset, p1.y), true);
            a.geometry.setTerminalPoint(new mxPoint(p2.x + offset, p2.y), false);
            a.geometry.points = [new mxPoint(p1.x + offset + curve, p1.y + l / 2)];
            //a.geometry.relative = true;
            //a.connectable = false;
            a.edge = true;
            var b = new mxCell("", new mxGeometry(p1.x - w / 2, p1.y, wc + (offset + curve), l), "curved=1;endArrow=classic;html=1;");
            b.geometry.setTerminalPoint(new mxPoint(wc - offset, l), true);
            b.geometry.setTerminalPoint(new mxPoint(wc - offset, 0), false);
            b.geometry.points = [new mxPoint(wc - (offset + curve), l / 2)];
            //b.geometry.relative = true;
            //b.connectable = false;
            b.edge = true;

            conn.insert(a);
            conn.insert(b);
            return s.createEdgeTemplateFromCells([conn], conn.geometry.width,
                conn.geometry.height, "Curved Arrow")
        })
    ]
    );

    s.addPaletteFunctions('tamADlibrary', 'TAM Activity Diagram', false, [
        s.createVertexTemplateEntry("rounded=1;whiteSpace=wrap;html=1;arcSize=50;", 120, 60, "", "Action", null, null, "rounded rect rectangle box"),
        s.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;startArrow=none;endArrow=classic;rounded=1;', 100, 100, "", "Arrow"),

        s.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=none;endArrow=classic;rounded=1;', 100, 100, "", "Arrow")

    ]);

    ui.sidebar.addPaletteFunctions('tamXXlibrary', 'DrawIO Elements', false, [
        ui.sidebar.createVertexTemplateEntry("shape=rectangle;html=1;", 100, 100, "", "Rectangle", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=cylinder;html=1;", 100, 100, "", "Cylinder", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=swimlane;html=1;", 100, 100, "", "Swimlane", null, null, ""),
        ui.sidebar.createEdgeTemplateEntry("shape=connector;html=1;", 100, 100, "", "Connector", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=actor;html=1;", 100, 100, "", "Actor", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=cloud;html=1;", 100, 100, "", "Cloud", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=triangle;html=1;", 100, 100, "", "Triangle", null, null, ""),
        ui.sidebar.createVertexTemplateEntry("shape=hexagon;html=1;", 100, 100, "", "Hexagon", null, null, ""),
        ui.sidebar.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;startArrow=block;endArrow=diamond;rounded=1;', 100, 100, "", "Arrow Block Diamond")
    ]);

    // Collapses default sidebar entry and inserts this before
    // oh, this is ugly!
    var c = ui.sidebar.container;
    c.firstChild.click();
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);

    // Adds variables in labels (%today, %filename%)
    //	var superGetLabel = ui.editor.graph.getLabel;

    //	ui.editor.graph.getLabel = function(cell)
    //	{
    //		var result = superGetLabel.apply(this, arguments);

    //		if (result != null)
    //		{
    //			var today = new Date().toLocaleString();
    //			var file = ui.getCurrentFile();
    //			var filename = (file != null && file.getTitle() != null) ? file.getTitle() : '';

    //			result = result.replace('%today%', today).replace('%filename%', filename);
    //		}

    //		return result;
    //	};

    // define Elbow as default edge style
    //    var style = ui.editor.graph.stylesheet.getDefaultEdgeStyle();
    //    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;

    // define custom edge style
    mxEdgeStyle.MyStyle = function (state, source, target, points, result) {
        if (source != null && target != null) {
            var pt = new mxPoint(target.getCenterX(), source.getCenterY());

            if (mxUtils.contains(source, pt.x, pt.y)) {
                pt.y = source.y + source.height;
            }

            result.push(pt);
        }
    };
    // register new edge style in the mxStyleRegistry 
    //    mxStyleRegistry.putValue('myEdgeStyle', mxEdgeStyle.MyStyle);

    // use it for all edges
    //    var style = ui.editor.graph.getStylesheet().getDefaultEdgeStyle();
    //    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.MyStyle;

    //    // Adds resource for action
    //    mxResources.parse('helloWorldAction=Hello, World!');
    //
    //    // Adds action
    //    ui.actions.addAction('helloWorldAction', function() {
    //        var ran = Math.floor((Math.random() * 100) + 1);
    //        mxUtils.alert('A random number is ' + ran);
    //    });
    //
    //    // Adds menu
    //    ui.menubar.addMenu('Hello, World Menu', function(menu, parent) {
    //        ui.menus.addMenuItem(menu, 'helloWorldAction');
    //    });
    //
    //    // Reorders menubar
    //    ui.menubar.container.insertBefore(ui.menubar.container.lastChild,
    //        ui.menubar.container.lastChild.previousSibling.previousSibling);
    //
    //    // Adds toolbar button
    //    ui.toolbar.addSeparator();
    //    var elt = ui.toolbar.addItem('', 'helloWorldAction');
    //
    //    // Cannot use built-in sprites
    //    elt.firstChild.style.backgroundImage = 'url(https://www.draw.io/images/logo-small.gif)';
    //    elt.firstChild.style.backgroundPosition = '2px 3px';
});