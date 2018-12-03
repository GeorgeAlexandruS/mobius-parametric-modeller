import { Component, Input, EventEmitter, Output} from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { DataService } from '@services';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent {
    /*
    @Input() flowchart: IFlowchart;
    @Input() node: INode;
    */

    @Output() imported = new EventEmitter();
    @Output() delete_Function = new EventEmitter();
    @Output() helpText = new EventEmitter();
    copiedProd: IProcedure[];

    private copyCheck = false;

    constructor(private dataService: DataService) {
    }

    // add a procedure
    add(data: {type: ProcedureTypes, data: IFunction}): void {
      NodeUtils.add_procedure(this.dataService.node, data.type, data.data);
    }

    // delete a procedure
    deleteChild(index: number): void {
      this.dataService.node.procedure.splice(index, 1);
      NodeUtils.deselect_procedure(this.dataService.node);
    }

    // select a procedure
    selectProcedure(event, line): void {
      NodeUtils.select_procedure(this.dataService.node, event.prod, event.ctrl || false);
    }

    // copy selected procedures
    copyProd() {
      if (!this.copyCheck) { return; }
      console.log('copying', this.dataService.node.state.procedure);
      this.copiedProd = this.dataService.node.state.procedure;
    }

    // cut selected procedures
    cutProd(event) {
      if (!this.copyCheck || document.activeElement.nodeName === 'INPUT') { return; }
      console.log('cutting', this.dataService.node.state.procedure);
      this.copiedProd = this.dataService.node.state.procedure;
      let parentArray;
      for (const prod of this.copiedProd) {
        if (prod.parent) {
          parentArray = prod.parent.children;
        } else { parentArray = this.dataService.node.procedure; }

        for (let i = 0; i < parentArray.length; i++ ) {
          if (parentArray[i] === prod) {
            parentArray.splice(i, 1);
            break;
          }
        }
      }
      NodeUtils.deselect_procedure(this.dataService.node);
    }

    // paste copied procedures
    pasteProd(event) {
      if (this.copyCheck && this.copiedProd && document.activeElement.nodeName.toUpperCase() !== 'INPUT') {
        const pastingPlace = this.dataService.node.state.procedure[0];
        if (pastingPlace === undefined) {
          for (let i = 0; i < this.copiedProd.length; i++) {
            console.log('pasting', this.copiedProd[i].ID);
            NodeUtils.paste_procedure(this.dataService.node, this.copiedProd[i]);
            this.dataService.node.state.procedure[0].selected = false;
            this.dataService.node.state.procedure = [];
          }
        } else if (pastingPlace.children) {
          for (let i = 0; i < this.copiedProd.length; i++) {
            console.log('pasting', this.copiedProd[i].ID);
            NodeUtils.paste_procedure(this.dataService.node, this.copiedProd[i]);
            this.dataService.node.state.procedure[0].selected = false;
            pastingPlace.selected = true;
            this.dataService.node.state.procedure = [pastingPlace];
          }

        } else {
          for (let i = this.copiedProd.length - 1; i >= 0; i --) {
            console.log('pasting', this.copiedProd[i].ID);
            NodeUtils.paste_procedure(this.dataService.node, this.copiedProd[i]);
            this.dataService.node.state.procedure[0].selected = false;
            pastingPlace.selected = true;
            this.dataService.node.state.procedure = [pastingPlace];
          }
        }
        // this.copiedProd = undefined;
      }
    }

    // activate copying/cutting/pasting when the mouse hovers over the procedure list
    activateCopyPaste(): void {
      this.copyCheck = true;
    }

    // deactivate copying/cutting/pasting when the mouse exit the procedure list
    deactivateCopyPaste(): void {
      this.copyCheck = false;
    }

    // import a flowchart as function
    importFunction(event) {
      for (const func of event) {
        this.dataService.flowchart.functions.push(func);
      }
    }

    // delete an imported function
    deleteFunction(event) {
        for (let i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === event) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
    }

    emitHelpText(event) {
      this.helpText.emit(event);
    }

}