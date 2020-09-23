let triangle = {
    services: {},
    configuration: { },
    components: {},
    domParser: new DOMParser()
}

triangle.config = function (key, value){
    this.configuration[key] = value;
}

triangle.component = function (name, component_){
    component_.name = name;
    component_.inElements = [];
    component_.outElements = [];
    component_.document = null;
    $.get(component_.templateUrl, function (response){
        component_.document = triangle.domParser.parseFromString(response, 'text/html');
        component_.inElements = component_.document.querySelectorAll('[trIn]');
        for(let i = 0; i < component_.inElements.length; i++){
            let elem = component_.inElements.item(i);
            $(elem).on('keydown keyup change', (e) => {
                readInputsFrom(component_.inElements, component_.controller.scope);
                component_.controller.relate();
                writeOutputsTo(component_.outElements, component_.controller.scope);
            });
        }
        component_.outElements = component_.document.querySelectorAll('[trOut]');
        triangle.components[name] = component_;
        applyComponent(component_);
    })
    // Object.defineProperty(this.components,name,component_);
}

$(document).ready(function(){
    document.title = triangle.configuration.title ? triangle.configuration.title : "Triangle App";
});

function applyComponents(){
    for (component in triangle.components){ 
        applyComponent(component);
    }
}
function applyComponent(component){
    let componentList = document.getElementsByTagName(component.name);
    for(let i = 0; i < componentList.length; i++){
        componentList.item(i).appendChild(component.document.body.firstChild);
    }
}

function readInputsFrom(inputElements, scope){
    for(let i = 0; i < inputElements.length; i++){
        var variable = inputElements.item(i).attributes['trin'].nodeValue;
        if("INPUT TEXTAREA SELECT".search(inputElements.item(i).tagName) >= 0)
            scope[variable] = inputElements.item(i).value;
    }
}
function writeOutputsTo(outputElements, scope){
    for(let i = 0; i < outputElements.length; i++){
        var variable = outputElements.item(i).attributes['trout'].nodeValue;
        if("INPUT TEXTAREA SELECT".search(outputElements.item(i).tagName) >= 0)
            outputElements.item(i).value = scope[variable];
        else
            outputElements.item(i).innerHTML = scope[variable];
    }
}