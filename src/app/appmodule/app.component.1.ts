import { Component, Injector, ComponentFactoryResolver, ViewContainerRef,
    ViewChild, EventEmitter, HostListener, OnInit } from '@angular/core';
import { ViewEditorComponent } from '../views/view-editor/view-editor.component';
import { ViewDashboardComponent } from '../views/view-dashboard/view-dashboard.component';
import { ViewGalleryComponent } from '../views/view-gallery/view-gallery.component';
import { IMobius } from '@models/mobius';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import * as circularJSON from 'circular-json';
import { IView } from '../model-viewers/view.interface';
import { ViewFlowchartComponent } from '../views/view-flowchart/view-flowchart.component';
import { Observable } from 'rxjs';
import { PlatformLocation } from '@angular/common'

// @ts-ignore
console.stdlog = console.log.bind(console);
// @ts-ignore
console.logs = [];
// @ts-ignore
console.log = function() {
    // @ts-ignore
    console.logs.push(Array.from(arguments));
    // @ts-ignore
    console.stdlog.apply(console, arguments);
};
/*

*/
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
    private views = [];
    private Viewers = {
        'gallery': ViewGalleryComponent, // src/views/view-gallery/
        'dashboard': ViewDashboardComponent, // src/views/view-dashboard/
        'flowchart': ViewFlowchartComponent, // src/views/view-flowchart/
        'editor': ViewEditorComponent    // src/views/view-editor/
    };
    activeView: string;
    helpView: any;

    constructor(private dataService: DataService, private injector: Injector, private r: ComponentFactoryResolver) {}

    /*
    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHander(event) {
        event.returnValue = true;
    }
    */

    ngOnInit() {
        this.activeView = 'gallery';
        this.updateView('gallery');
    }


    updateFile(event: string) {
        this.dataService.file = circularJSON.parse(event);
        const fc = this.dataService.file.flowchart;
        if (this.dataService.node.type !== 'end'){
            for (let i = 0; i< fc.nodes.length; i++){
                if (fc.nodes[i].type == 'end'){
                    fc.meta.selected_nodes = [i]
                    break;
                }
            }
        }
        document.getElementById('executeButton').click();
        this.updateValue();
    }

    createView(view: string) {
        const component = this.Viewers[view];
        const factory = this.r.resolveComponentFactory(component);
        const componentRef = factory.create(this.injector);
        if (view === 'flowchart') {
            componentRef.instance['switch'].subscribe(data => this.updateView(data));
        } else if (view === 'editor') {
            componentRef.instance['helpText'].subscribe(data => this.helpView = data);
        } else if (view === 'gallery') {
            componentRef.instance['switch'].subscribe(data => this.updateView(data));
            // componentRef.instance['dataservice'] = this.dataService;
        }
        return componentRef;
    }

    updateView(view: string): void {
        this.activeView = view;

        if ( this.views[ view ] === undefined) {
                this.views[ view ] = this.createView(view);
        }
        // this.updateValue();

        this.vc.detach();
        this.vc.insert( this.views[ view ].hostView );
    }

    updateValue() {
        for (const view in this.Viewers) {
            if (!this.views[view]) { continue; }
            /*
            const componentRef =    this.views[ view ];
            if (view === 'flowchart') {
                // componentRef.instance['data'] = this.dataService.flowchart;
            } else if (view === 'editor') {
                // componentRef.instance['flowchart'] = this.dataService.flowchart;
                // componentRef.instance['node'] = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
            } else if (view === 'dashboard') {
                // componentRef.instance['flowchart'] = this.dataService.flowchart;
            }
            */

        }
    }

    viewerData(): any {
        const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) { return ''; }
        if (node.type === 'output') { return node.input.value; }
        return node.output.value;
    }

}