import { ChangeDetectorRef, ElementRef, EventEmitter, KeyValueDiffers, Renderer2, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Column } from '../../../models';
import { RowAction } from '../../../models/row-action.model';
export declare class FsRowComponent implements OnInit, DoCheck, OnDestroy {
    private _el;
    private _cdRef;
    private _differs;
    private _renderer;
    t: boolean;
    role: string;
    row: any;
    rowActions: RowAction[];
    rowEvents: {};
    rowIndex: number;
    columns: Column[];
    reorder: boolean;
    startDragging: EventEmitter<{}>;
    stopDragging: EventEmitter<{}>;
    menuRowActions: RowAction[];
    inlineRowActions: RowAction[];
    private _rowDiffer;
    private _eventListeners;
    constructor(_el: ElementRef, _cdRef: ChangeDetectorRef, _differs: KeyValueDiffers, _renderer: Renderer2);
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    mousedow(event: any): void;
    /**
     * Set event listeners for row
     */
    private initRowEvents();
}
