"use strict";
import powerbi from "powerbi-visuals-api";
import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom"; 
import { ReactCircleCard, initialState }  from "./ReactCircleCard";
import "./../style/visual.less";
import IViewport = powerbi.IViewport;

export class Visual implements IVisual {
    private settings: VisualSettings;
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
  
    private viewport: IViewport;
    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
  
        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];
            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = Math.min(width, height);
 
            // tslint:disable-next-line: prefer-type-cast
            this.settings = VisualSettings.parse(dataView) as VisualSettings;
            const object = this.settings.circle;

            ReactCircleCard.update({
                size,
                textLabel: dataView.metadata.columns[0].displayName,
                textValue: dataView.single.value.toString(),
                borderWidth: object && object.circleThickness ? object.circleThickness : undefined,
                background: object && object.circleColor ? object.circleColor : undefined
            });
        } else {
            this.clear();
        }
    }
    public enumerateObjectInstances(
        options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
    private clear() {
        ReactCircleCard.update(initialState);    
    }
}