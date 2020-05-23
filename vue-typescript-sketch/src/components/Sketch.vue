<template>
    <div class="col-12 col-sm-10 col-sm-offset-1 lb-settings">
        <div style="font-size: 2vw; text-align:center">
            Sketch Pad
        </div>
        <div class="row">
            <div class="col-2 col-xs-12">
                <div class="jumbotron"  id="toolbox">
                    <div  class="row" >
                        <div class="col-sm-12 col-md-6" @click="undo">
                            <div class="tool">
                                <i class="fa fa-reply"></i>
                                <!--<i class="fa fa-undo"></i>-->
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="redo">
                            <div class="tool">
                                <i class="fa fa-share"></i>
                                <!--<i class="fa fa-redo"></i>-->
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="selectTool(0)">
                            <div class="tool">
                                <i class="fa fa-mouse-pointer"></i>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="selectTool(1)">
                            <div class="tool">
                                <i class="fa fa fa-pencil"></i>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="selectTool(2)">
                            <div class="tool">
                                <i class="fa fa-square"></i>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="selectTool(3)">
                            <div class="tool">
                                <i class="fa fa-circle"></i>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6" @click="selectTool(4)">
                            <div class="tool">
                                <i class="fa fa-font"></i>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="file-btn-wrapper">
                                <ImageDownloadDialog @pathIsSet="loadBackground" />
                            </div>
                            <div class="file-btn-wrapper">
                                <button class="file-btn" @click="fromNewSketch">New Sketch</button>
                            </div>
                            <div class="file-btn-wrapper">
                                <label class="file-btn" for="input-file"><i class="fa fa-download"></i>Import</label>
                                <input type="file" id="input-file" ref="inputFile" accept=".json" @change="importFile"/>
                            </div>
                            <div class="file-btn-wrapper" @click="exportFile">
                                <label class="file-btn" for="output-file"><i class="fa fa-upload"></i>Export</label>
                                <a id="output-file"  ref="outputFileLink" style="display: none">Export</a>
                            </div>
                        </div>
                        <div class="tool-setting text-center">
                            <h4>font-size</h4>
                            <div style="width: 100%; background-color: gray; height: 2px; margin-bottom: 5px"></div>
                            <div style="width: 100%;">
                                <input id="font-size" type="range" min="10" max="50" v-model="FontSize" step="10">
                                <input type="number" min="10" max="50" step="10" v-model="FontSize">
                            </div>
                        </div>
                        <div class="tool-setting">
                            <h4>line-width</h4>
                            <div style="width: 100%; background-color: gray; height: 2px; margin-bottom: 5px"></div>
                            <div style="width: 100%;">
                                <input id="line-width" type="range" min="2" max="10" step="2" v-model="LineWidth">
                                <input type="number" min="2" max="10" step="2" v-model="LineWidth">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-10 col-xs-12">
                <div class="jumbotron" >
                    <div id="sketch-pad" ref="sketchPad" :style="cursorSet">
                        <v-stage
                                ref="stage"
                                :config="configStage"
                                @resize="fitStageIntoParentContainer"
                                @click="handleStageMouseClick"
                                @mousedown="handleStageMouseDown"
                                @mousemove="handleStageMouseMove"
                                @mouseup="handleStageMouseUp"
                        >
                            <v-layer ref="backgroundLayer" :cofig="{ draggable: false }"></v-layer>
                            <v-layer ref="mainLayer">
                            </v-layer>
                            <v-layer ref="dragLayer"></v-layer>
                        </v-stage>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ImageDownloadDialog from '@/components/dialogs/ImageDownloadDialog.vue';

    import Konva from 'konva';
    import VueKonva from 'vue-konva';

    Vue.use(VueKonva, Konva);

    const stageWidth = 1000;
    const stageHeight = 600;
    const initialLinewidth = 4;
    const initialFontsize = 20;
    const initialColor = '#000000';

    let vm;

    enum tools {
        'move',
        'line',
        'rect',
        'circle',
        'text'
    }

    @Component({
        components: { ImageDownloadDialog }
    })

    export default class Sketch extends Vue {
        stage: any;
        mainLayer: any;
        dragLayer: any;
        backgroundLayer: any;
        textarea: any = null;
        stageWidth: number;
        stageHeight: number;
        configStage: {};
        selectedTool: string = null;
        LineWidth: number = initialLinewidth;
        FontSize: number = initialFontsize;
        color: string = initialColor;
        tempShapeObj: object = null;
        tempShapeAttrs: object = null;
        drawingStartX: number = 0;
        drawingStartY: number = 0;
        pointerPosX: number = null;
        pointerPosY: number = null;
        isDrawing: boolean = false;
        isTransformerAdded: boolean = false;
        cursorSet: object = { cursor: "default" };
        initialState: Array<object> = [];
        state: Array<object> = [];
        appHistory: Array<any> = [];
        appHistoryStep: number = 0;

        @Watch('selectedTool')
        getChangedTool() {
            if (this.selectedTool == "move"){
                this.cursorSet = {
                    cursor: "move"
                }
            }else if (this.selectedTool == "text"){
                this.cursorSet = {
                    cursor: "text"
                };
            }else {
                this.cursorSet = {
                    cursor: "crosshair"
                };
            }
        }

        created() {
            this.stageWidth = stageWidth;
            this.stageHeight = stageHeight;
            this.configStage = {
                container: 'sketch-pad',
                width: this.stageWidth,
                height: this.stageHeight
            };
        }

        mounted() {
            // Create an instance.
            vm = this;
            this.stage = vm.$refs.stage.getNode();
            this.mainLayer = vm.$refs.mainLayer.getNode();
            this.dragLayer = vm.$refs.dragLayer.getNode();
            this.backgroundLayer = vm.$refs.backgroundLayer.getNode();
            // Set stage size according to browser size.
            this.fitStageIntoParentContainer();
        }

        fromNewSketch() {
            // clear input form file.
            vm.$refs.inputFile.value = '';
            this.initialState = [];
            this.startSketch();
        }

        fromImportedSketch(sketch){
            this.initialState = sketch;
            this.startSketch();
        }

        startSketch() {
            // clear stage
            vm.$refs.stage.getNode().clear();
            // clear selected tool
            this.selectedTool = null;
            // remove background highlight for selected tool
            let current = this.$el.getElementsByClassName("active");
            if(current.length !== 0){
                current[0].className = current[0].className.replace(" active", "");
            }
            this.cursorSet = { cursor: "default" };
            // clear textarea
            this.textarea = null;
            let elements = document.body.getElementsByTagName('textarea');
            while (elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            // clear state
            this.state = [];
            // clear history
            this.appHistory = [];
            this.appHistoryStep = 0;
            this.state = [...this.initialState];
            this.appHistory.push(this.initialState);
            this.createState(this.state);
        }

        loadBackground(path) {
            let imageObj = new Image();
            imageObj.src = path;
            imageObj.onerror = () => {
                this.$root.$emit("alert", "danger", "Path is not valid");
            };
            imageObj.onload = () => {
                let background = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: imageObj,
                    width: stageWidth,
                    height: stageHeight
                });
                // Add the image to the background layer.
                this.backgroundLayer.add(background);
                this.backgroundLayer.batchDraw();
            };
        }

        selectTool(index) {
            this.selectedTool = tools[index];
            if (this.selectedTool == "move") {
                // find all shapes in mainlayer and set them draggable.
                let shapeObjs = this.state;
                shapeObjs.map((item, index) => {
                    Object.assign( item,{ draggable: true });
                });
                this.createState(this.state);
            }else {
                // find all shapes in mainlayer and set them not draggable.
                let shapeObjs = this.state;
                shapeObjs.map((item, index) => {
                    Object.assign(item,{draggable: false});
                });
                this.createState(this.state);
            }

            // add background highlight for selected tool div.
            let tool_divs = this.$el.getElementsByClassName('tool');
            let current = this.$el.getElementsByClassName("active");
            if(current.length !== 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            tool_divs[index+2].className += " active";
            // remove textarea elements
            let elements = this.$el.getElementsByTagName('textarea');
            while (elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        fitStageIntoParentContainer() {
            let container = vm.$refs.sketchPad;
            let containerWidth = container.offsetWidth;
            let scale = containerWidth / this.stageWidth;
            this.stage = vm.$refs.stage.getNode();
            this.stage.width(stageWidth * scale);
            this.stage.height(stageHeight * scale);
            this.stage.scale({ x: scale, y: scale });
            this.stage.draw();
        }

        getRelativePointerPosition(node) {
            // the function will return pointer position relative to the passed node
            let transform = node.getAbsoluteTransform().copy();
            // to detect relative position we need to invert transform
            transform.invert();
            // get pointer (say mouse or touch) position
            let pos = node.getStage().getPointerPosition();
            // now we find relative point
            return transform.point(pos);
        }

        getAbsolutePosition(pointX, pointY){
            // find position of stage container on the page:
            let stageBox = this.stage.container().getBoundingClientRect();
            // then calculate the position relative to stage:
            let container = vm.$refs.sketchPad;
            let containerWidth = container.offsetWidth;
            let scale = containerWidth / this.stageWidth;

            let absPosition = {
                x: stageBox.left + pointX*scale,
                y: stageBox.top + pointY*scale,
            };
            return absPosition;
        }

        makeTextarea(x, y) {
            let textareaPosition = this.getAbsolutePosition(x, y);
            // create textarea and style it
            this.textarea = document.createElement('textarea');
            document.body.appendChild(this.textarea);
            this.textarea.value = '';
            this.textarea.style.fontSize = this.FontSize;
            this.textarea.style.position = 'absolute';
            this.textarea.style.top = textareaPosition.y + 'px';
            this.textarea.style.left = textareaPosition.x + 'px';
            this.textarea.style.width = 200 + 'px';
        }

        createLineObject(){
            return Object.assign({},{
                type:'line',
                points: [],
                offsetX: null,
                offsetY: null,
                rotation: null,
                scaleX: null,
                scaleY: null,
                x: null,
                y: null,
                // set hit region width
                hitStrokeWidth: 50,
                stroke: initialColor,
                strokeWidth: initialLinewidth,
                draggable: false,
            }, this.tempShapeAttrs);
        }

        createRectObject(){
            return Object.assign({},{
                type:'rect',
                x: null,
                y: null,
                width: null,
                height: null,
                rotation: 0,
                scaleX: null,
                scaleY: null,
                stroke: initialColor,
                strokeWidth: initialLinewidth,
                draggable: false,
            },this.tempShapeAttrs);
        }

        createCircleObject(){
            return Object.assign({},{
                type:'circle',
                x: null,
                y: null,
                radius: null,
                stroke: initialColor,
                strokeWidth: initialLinewidth,
                draggable: false,
            },this.tempShapeAttrs);
        }

        createTextObject(){
            return Object.assign({},{
                type:'text',
                text: null,
                x: null,
                y: null,
                offsetX: 0,
                offsetY: 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                fontSize: this.FontSize,
                stroke: null,
                strokeWidth: null,
                draggable: false,
            },this.tempShapeAttrs)
        }

        updateTransformingShape(tshape) {
            let type = tshape.className;
            switch (type) {
                case 'Line':
                    this.tempShapeAttrs = {
                        type: 'line',
                        name: tshape.name(),
                        offsetX: tshape.offsetX(),
                        offsetY: tshape.offsetY(),
                        points: tshape.points(),
                        rotation: tshape.rotation(),
                        scaleX: tshape.scaleX(),
                        scaleY: tshape.scaleY(),
                        x: tshape.x(),
                        y: tshape.y(),
                        stroke: tshape.stroke(),
                        strokeWidth: tshape.strokeWidth(),
                        draggable: true,
                    };
                    break;
                case 'Rect':
                    this.tempShapeAttrs = {
                        type: 'rect',
                        name: tshape.getName(),
                        x: tshape.x(),
                        y: tshape.y(),
                        width: tshape.width(),
                        height: tshape.height(),
                        rotation: tshape.rotation(),
                        scaleX: tshape.scaleX(),
                        scaleY: tshape.scaleY(),
                        stroke: this.color,
                        strokeWidth: this.LineWidth,
                        draggable: true
                    };
                    break;
                case 'Circle':
                    this.tempShapeAttrs = {
                        type: 'circle',
                        name: tshape.getName(),
                        x: tshape.x(),
                        y: tshape.y(),
                        rotation: tshape.rotation(),
                        scaleX: tshape.scaleX(),
                        scaleY: tshape.scaleY(),
                        stroke: "black",
                        strokeWidth: this.LineWidth,
                        radius: tshape.radius(),
                        draggable: true,
                    };
                    break;
                case 'Text':
                    this.tempShapeAttrs = {
                        type: 'text',
                        name: tshape.getName(),
                        text: tshape.attrs.text,
                        x: tshape.x(),
                        y: tshape.y(),
                        rotation: tshape.rotation(),
                        scaleX: tshape.scaleX(),
                        scaleY: tshape.scaleY(),
                        fontSize: tshape.fontSize(),
                        draggable: true,
                        width: 200
                    };
                    break;
                default:
                    this.tempShapeAttrs = null;
            }
        }

        handleStageMouseClick(e) {
            // If initial state isn't in history, ask to start a new sketch.
            if (this.appHistory.length === 0){
                this.$root.$emit("alert", "warning", "Please press New Sketch button or Import button!");
                return;
            }
            // If tool is not selected, ask to choose a tool.
            if (this.selectedTool === null){
                this.$root.$emit("alert", "warning", "Please select a tool!");
                return;
            }
            if (this.selectedTool == "text"){
                // if clicked text component, get the Text's value and attrs then save it.
                if (e.target.className == "Text"){
                    let Text = e.target;
                    // In case make a textarea for existing text, get the mouse position of text.
                    this.makeTextarea(e.target.x(), e.target.y());
                    this.textarea.value = Text.text();
                    this.textarea.style.fontSize = Text.fontSize();
                    Text.hide();
                    this.mainLayer.draw();
                    this.textarea.addEventListener('keydown', (e) =>{
                        // exit edit mode on esc
                        if (e.keyCode == 27) {
                            // remove textarea and show Text component
                            document.body.removeChild(this.textarea);
                            this.textarea = null;
                            this.createState(this.state);
                            return;
                        }
                        // hide on enter
                        if (e.keyCode == 13) {
                            // if value is not changed
                            if (Text.text() == this.textarea.value){
                                // remove textarea and show hidden Text component
                                document.body.removeChild(this.textarea);
                                Text.show();
                                this.mainLayer.draw();
                                return;
                            }else {
                                Text.destroy();
                                this.mainLayer.draw();
                                this.tempShapeAttrs = {
                                    type: 'text',
                                    text: this.textarea.value,
                                    x: Text.x(),
                                    y: Text.y(),
                                    rotation: Text.rotation(),
                                    scaleX: Text.scaleX(),
                                    scaleY: Text.scaleY(),
                                    fontSize: Text.fontSize(),
                                    draggable: true,
                                    width: 200
                                };
                                this.tempShapeObj = this.createTextObject();
                                document.body.removeChild(this.textarea);
                                this.textarea = null;
                                let TextId = Number(Text.getName().slice(-1));
                                this.state[TextId] = this.tempShapeObj;
                                this.saveStateToHistory();
                                this.createState(this.state);
                            }
                        }
                    });
                }

                // if clicked stage or background component, create a new text component
                if (e.target == this.stage || e.target.className == "Image"){
                    // if there is a opened textarea , don't create a new one
                    if( this.textarea !== null ) { return; }
                    this.pointerPosX = this.getRelativePointerPosition(this.stage).x;
                    this.pointerPosY = this.getRelativePointerPosition(this.stage).y;
                    // In case make a textarea for new text, get the mouse pointer position.
                    this.makeTextarea( this.pointerPosX, this.pointerPosY);
                    this.textarea.style.fontSize = this.FontSize;
                    this.textarea.addEventListener('keydown', (e) => {
                        // exit edit mode on esc
                        if (e.keyCode == 27) {
                            // remove textarea and show Text component
                            document.body.removeChild(this.textarea);
                            this.textarea = null;
                            this.createState(this.state);
                            return;
                        }
                        // hide on enter
                        if (e.keyCode == 13) {
                            // if value is empty
                            if (this.textarea.value == ''){
                                // remove textarea and show Text component
                                document.body.removeChild(this.textarea);
                                this.textarea = null;
                                return;
                            }else{
                                this.tempShapeAttrs = {
                                    type:"text",
                                    text: this.textarea.value,
                                    x: this.pointerPosX,
                                    y: this.pointerPosY,
                                    draggable: false,
                                    width: 200
                                };

                                this.tempShapeObj = this.createTextObject();
                                document.body.removeChild(this.textarea);
                                this.textarea = null;
                                this.state.push(this.tempShapeObj);
                                this.saveStateToHistory();
                                this.createState(this.state);
                            }

                        }
                    });

                }
            }

        }

        handleStageMouseDown(e) {
            // If initial state isn't in history, ask to start a new sketch.
            if (this.appHistory.length === 0){
                this.$root.$emit("alert", "warning", "Please press New Sketch button or Import button!");
                return;
            }
            // If tool is not selected, ask to choose a tool.
            if (this.selectedTool === null){
                this.$root.$emit("alert", "warning", "Please select a tool!");
                return;
            }
            // If text tool is selected, do nothing.
            if (this.selectedTool == "text"){
                return;
            }
            // If move tool is selected, add transformer.
            // shape tool is selected, start drawing.
            if (this.selectedTool == "move"){
                // if click on empty area - remove all transformers
                if (e.target == this.stage || e.target.className == "Image") {
                    this.stage.find('Transformer').destroy();
                    this.createState(this.state);
                    return;
                }
                // do nothing if clicked NOT on shapes.
                if (!e.target.attrs.name.includes('item')) {
                    return;
                }
                // remove old transformers
                this.stage.find('Transformer').destroy();
                let transformingShape = e.target;
                // create new transformer
                let tr;
                if (e.target.className == "Line"){
                    tr = new Konva.Transformer({
                        ignoreStroke: true,
                    });
                }else {
                    tr = new Konva.Transformer();
                }
                this.mainLayer.add(tr);
                this.isTransformerAdded = true;
                tr.attachTo(transformingShape);
                this.mainLayer.draw();
                // attach event listener to created shape.
                transformingShape.addEventListener('transformstart', (e) => {
                    console.log('transform start');
                });
                transformingShape.addEventListener('dragmove', (e) => {
                    this.isTransformerAdded = false;
                    this.updateTransformingShape(transformingShape);
                });
                transformingShape.addEventListener('dragend',(e) => {
                    if (this.isTransformerAdded == true) {
                        return;
                    }
                    this.updateTransformingShape(transformingShape);
                    switch (transformingShape.className) {
                        case 'Line':
                            this.tempShapeObj = this.createLineObject();
                            break;
                        case 'Rect':
                            this.tempShapeObj = this.createRectObject();
                            break;
                        case 'Circle':
                            this.tempShapeObj = this.createCircleObject();
                            break;
                        case 'Text':
                            this.tempShapeObj = this.createTextObject();
                            break;
                        default:
                            this.tempShapeObj = null;
                    }
                    let tShapeName = transformingShape.getName();
                    let tShapeId = Number(tShapeName.slice(-1));
                    // update state after transform drag ends.
                    this.state[tShapeId] = this.tempShapeObj;
                    this.saveStateToHistory();
                    this.createState(this.state);
                });
                transformingShape.addEventListener('transform', (e) => {
                    this.updateTransformingShape(transformingShape);
                });
                transformingShape.addEventListener('transformend', (e) => {
                    this.updateTransformingShape(transformingShape);
                    switch (transformingShape.className) {
                        case 'Line':
                            this.tempShapeObj = this.createLineObject();
                            break;
                        case 'Rect':
                            this.tempShapeObj = this.createRectObject();
                            break;
                        case 'Circle':
                            this.tempShapeObj = this.createCircleObject();
                            break;
                        case 'Text':
                            this.tempShapeObj = this.createTextObject();
                            break;
                        default:
                    }
                    let tShapeName = transformingShape.getName();
                    // let tShapeId = parseInt(tShapeName.charAt(tShapeName.length -1), 10);
                    let tShapeId = Number(tShapeName.slice(-1));
                    // update state after transform ends.
                    this.state[tShapeId] = this.tempShapeObj;
                    this.saveStateToHistory();
                    this.createState(this.state);
                });
            }else {
                // If stage or background is selected, start drawing a new shape.
                if (e.target == e.target.getStage() || e.target.className === "Image"){
                    this.stage = vm.$refs.stage.getNode();
                    this.isDrawing = true;
                    this.pointerPosX = this.getRelativePointerPosition(this.stage).x;
                    this.pointerPosY = this.getRelativePointerPosition(this.stage).y;
                    this.drawingStartX = this.pointerPosX;
                    this.drawingStartY = this.pointerPosY;
                }else{
                    return;
                }
            }
        }

        handleStageMouseMove(e) {
            // Only when drawing is started, create and update shape by drag.
            if (this.isDrawing){
                this.stage = vm.$refs.stage.getNode();
                this.pointerPosX = this.getRelativePointerPosition(this.stage).x;
                this.pointerPosY = this.getRelativePointerPosition(this.stage).y;
                // moving to another layer will improve dragging performance
                this.dragLayer.removeChildren();
                switch (this.selectedTool) {
                    case "line":
                        this.tempShapeObj = new Konva.Line({
                            points: [this.drawingStartX, this.drawingStartY, this.pointerPosX, this.pointerPosY],
                            stroke: this.color,
                            strokeWidth: this.LineWidth,
                        });
                        break;
                    case "rect":
                        this.tempShapeObj = new Konva.Rect({
                            x: this.drawingStartX,
                            y: this.drawingStartY,
                            width: this.pointerPosX-this.drawingStartX,
                            height: this.pointerPosY-this.drawingStartY,
                            stroke: this.color,
                            strokeWidth: this.LineWidth,
                        });
                        break;
                    case "circle":
                        this.tempShapeObj = new Konva.Circle({
                            x: this.drawingStartX + (this.pointerPosX-this.drawingStartX)/2,
                            y: this.drawingStartY + (this.pointerPosX-this.drawingStartX)/2,
                            stroke: "black",
                            strokeWidth: this.LineWidth,
                            radius: Math.abs(this.pointerPosX-this.drawingStartX)/2,
                        });
                        break;
                    default:
                        this.tempShapeObj = null;
                }
                this.dragLayer.add(this.tempShapeObj);
                this.stage.draw();
            }else {
                return;
            }
        }

        handleStageMouseUp(e) {
            // Only when drawing is started, create a new shape.
            if(this.isDrawing){
                this.isDrawing = false;
                this.dragLayer.removeChildren();
                this.pointerPosX = this.getRelativePointerPosition(this.stage).x;
                this.pointerPosY = this.getRelativePointerPosition(this.stage).y;
                switch (this.selectedTool) {
                    case "line":
                        this.tempShapeAttrs = {
                            type: 'line',
                            points: [this.drawingStartX, this.drawingStartY, this.pointerPosX, this.pointerPosY],
                            offsetX: 0,
                            offsetY: 0,
                            rotation: 0,
                            scaleX: 1,
                            scaleY: 1,
                            x: 0,
                            y: 0,
                            stroke: this.color,
                            strokeWidth: this.LineWidth,
                            draggable: false
                        };
                        this.tempShapeObj = this.createLineObject();
                        break;
                    case "rect":
                        this.tempShapeAttrs = {
                            type:'rect',
                            x: this.drawingStartX,
                            y: this.drawingStartY,
                            width: this.pointerPosX-this.drawingStartX,
                            height: this.pointerPosY-this.drawingStartY,
                            stroke: this.color,
                            strokeWidth: this.LineWidth,
                            draggable: false
                        };
                        this.tempShapeObj = this.createRectObject();
                        break;
                    case "circle":
                        // let radius = Math.sqrt((this.pointerPosX-this.drawingStartX)^2 + (this.pointerPosY-this.drawingStartY)^2);
                        this.tempShapeAttrs = {
                            type:'circle',
                            x: this.drawingStartX + (this.pointerPosX-this.drawingStartX)/2,
                            y: this.drawingStartY + (this.pointerPosX-this.drawingStartX)/2,
                            stroke: "black",
                            strokeWidth: this.LineWidth,
                            radius: Math.abs(this.pointerPosX-this.drawingStartX)/2,
                            draggable: false,
                        };
                        this.tempShapeObj = this.createCircleObject();
                        break;
                    default:
                        this.tempShapeObj = null;
                }
                this.state.push(this.tempShapeObj);
                this.saveStateToHistory();
                this.createState(this.state);
            }else {
                return;
            }
        }

        createState(state){
            this.mainLayer.destroyChildren();
            this.stage.draw();
            let shape;
            state.forEach((item, index) => {
                if (item.type === 'line'){
                    shape = new Konva.Line({
                        name: 'item-' + index,
                        points: item.points,
                        offsetX: item.offsetX,
                        offsetY: item.offsetY,
                        rotation: item.rotation,
                        x: item.x,
                        y: item.y,
                        scaleX: item.scaleX,
                        scaleY: item.scaleY,
                        hitStrokeWidth: item.hitStrokeWidth,
                        stroke: item.stroke,
                        strokeWidth: item.strokeWidth,
                        draggable: item.draggable,
                    });
                }
                if (item.type === 'rect'){
                    shape = new Konva.Rect({
                        name: 'item-' + index,
                        x: item.x,
                        y: item.y,
                        rotation: item.rotation,
                        scaleX: item.scaleX,
                        scaleY: item.scaleY,
                        width: item.width,
                        height: item.height,
                        stroke: item.stroke,
                        strokeWidth: item.strokeWidth,
                        draggable: item.draggable,
                    })
                }
                if (item.type === 'circle'){
                    shape = new Konva.Circle({
                        name: 'item-' + index,
                        x: item.x,
                        y: item.y,
                        rotation: item.rotation,
                        scaleX: item.scaleX,
                        scaleY: item.scaleY,
                        radius: item.radius,
                        stroke: item.stroke,
                        strokeWidth: item.strokeWidth,
                        draggable: item.draggable,
                    });
                }
                if (item.type === 'text'){
                    shape = new Konva.Text({
                        name: 'item-' + index,
                        x: item.x,
                        y: item.y,
                        rotation: item.rotation,
                        scaleX: item.scaleX,
                        scaleY: item.scaleY,
                        text: item.text,
                        fontSize: item.fontSize,
                        width: 200,
                        draggable: item.draggable,
                    });
                }
                this.mainLayer.add(shape);
                this.stage.draw();
            });
        }

        undo() {
            if (this.appHistoryStep === 0) {
                return;
            }
            this.appHistoryStep -= 1;
            this.state = [...this.appHistory[this.appHistoryStep]];
            // create everything from scratch
            this.createState(this.state);
        }

        redo() {
            if (this.appHistoryStep === this.appHistory.length -1) {
                return;
            }
            this.appHistoryStep += 1;
            this.state = [...this.appHistory[this.appHistoryStep]];
            // create everything from scratch
            this.createState(this.state);
        }

        saveStateToHistory() {
            // let state = this.state.slice();
            let state = [...this.state];
            this.appHistory = this.appHistory.slice(0, this.appHistoryStep + 1);
            this.appHistory = this.appHistory.concat([state]);
            this.appHistoryStep += 1;
        }

        importFile(e) {
            let sketchJson;
            let file = e.target.files[0];
            if (!file) {
                return;
            }
            let reader = new FileReader();
            reader.onload = () => {
                // json = event.target.result;
                sketchJson = reader.result;
                this.fromImportedSketch(JSON.parse(sketchJson));
            };
            reader.readAsText(file);
        }

        exportFile(e) {
            let exportJson = JSON.stringify(this.state);
            let exportLink = vm.$refs.outputFileLink;
            exportLink.setAttribute("download", "sketch.json");
            exportLink.setAttribute("href", "data:application/octet-stream," + encodeURIComponent(exportJson));
            exportLink.click();
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import "../../node_modules/bootstrap/scss/bootstrap";
    @import '../../node_modules/bootstrap/scss/bootstrap.scss';

    @media only screen and (max-width: 1280px){
        #toolbox .col-sm-12, .col-md-6{
            padding: 2px!important;
        }
        .jumbotron {
            padding: 5px!important;
        }
        .tool-setting {
            margin: 10px 10px;
        }
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        opacity: 1;
    }
    .row{
        margin-left: 0!important;
        margin-right: 0!important;
    }
    #toolbox {
        cursor: pointer!important;
    }
    #sketch-pad {
        background-color: white;
        margin: 5px;
    }
    .tool{
        border-radius: 5px;
        border: 2px solid gray;
        background: #ffffff;
        text-align: center;
        margin: 5px 0;
        position: relative;
        width: 100%;
        height: available;
        display: flex;
        align-items: center;
        justify-content: center
    }
    .tool:after{
        content: "";
        display: block;
        padding-bottom: 100%;
    }
    .tool:hover, .active {
        background: #DEE6D8;
    }
    .tool i {
        font-size: 2vw;
        vertical-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .tool label {
        margin: 10px 0;
    }
    .tool-setting {
        width: 100%;
        display: flex;
        flex-direction: column;
        font-size: 16px;
        background-color: white;
        border: 2px solid gray;
        border-radius: 5px;
        margin: 10px 20px;
        padding: 5px;
        text-align: center;
    }
    .tool-setting h4{
        font-size: 20px;
        font-weight: bold;
        color: gray;
    }
    .tool-setting input:nth-child(1) {
        width: 100%;
    }
    .tool-setting input:nth-child(2) {
        width: 50px;
        margin: 10px 0;
    }
    #download-btn {
        background: #007BFF;
        margin-bottom: 1rem;
    }
    #sketch-pad{
        padding: 0!important;
    }
    .jumbotron {
        padding: 5px!important;
        border: 2px solid gray;
    }
    textarea {
        background-color: transparent;
        border: 1px dashed black;
    }
    .error{
        color: red;
    }
    .file-btn-wrapper {
        width: 100%;
        position: relative;
        overflow: hidden;
        display: inline-block;
    }
    .file-btn {
        border: 2px solid gray;
        width: 100%;
        color: gray;
        font-size: 16px;
        background-color: white;
        padding: 5px 10px;
        border-radius: 8px;
        font-weight: bold;
    }
    .file-btn:hover{
        background-color: #DEE6D8;
    }
    .file-btn-wrapper label{
        text-align: center;
    }
    .file-btn-wrapper input[type=file] {
        width: 100%;
        height: 100px;
        display: none;
    }

</style>
