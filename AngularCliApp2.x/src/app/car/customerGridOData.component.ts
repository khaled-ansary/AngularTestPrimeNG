import { NgModule, Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { ODataConfiguration, ODataServiceFactory, ODataService, ODataQuery, ODataPagedResult } from 'angular-odata-es5';
import { Observable, Operator } from 'rxjs/rx';
import { ICustomer } from './customer';
import { NorthwindODataConfigurationFactory } from './NorthwindODataConfigurationFactory';

console.log('`CustomerGridODataComponent` component loaded asynchronously');

@Component({
    templateUrl: './customerGridOData.component.html',
    selector: 'my-customer-grid-odata',
    providers: [ { provide: ODataConfiguration, useFactory: NorthwindODataConfigurationFactory }, ODataServiceFactory ],
    styleUrls: [ './carGrid.component.css']
})
export class CustomerGridODataComponent implements OnInit {

    public customers: ICustomer[] = [];

    public totalRecords: number;

    public filter: LazyLoadEvent;

    private odata: ODataService<ICustomer>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<ICustomer>('Customers');
    }

    public ngOnInit() {
        console.log('hello `CustomerGridODataComponent` component');
    }

    public loadCategoriesLazy(event: LazyLoadEvent) {
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        console.log('event = ' + JSON.stringify(event));
        this.filter = event;

        this.getPagedData(event);
    }

    private getPagedData(event: LazyLoadEvent) {
        let query: ODataQuery<ICustomer> = this.odata
            .Query()
            .Top(event.rows)
            .Skip(event.first);

        if (event.filters) {
            const filterOData: string[] = [];
            for (const prop in event.filters) {
                if (event.filters.hasOwnProperty(prop)) {
                    const filter = event.filters[prop] as FilterMetadata;
                    const key: string = filter.matchMode.toLowerCase();
                    if (key !== '') {
                        filterOData.push(key + '(' + prop + ', \'' + filter.value + '\')');
                    }
                 }
            }

            query = query.Filter(filterOData.join(' and '));
        }

        if (event.sortField) {
            const sortOrder: string = event.sortOrder > 0 ? 'asc' : 'desc';
            query = query.OrderBy(event.sortField + ' ' + sortOrder);
        }

        query
            .ExecWithCount()
            .subscribe((pagedResult: ODataPagedResult<ICustomer>) => {
                    this.customers = pagedResult.data;
                    this.totalRecords = pagedResult.count;
                },
                (error) => {
                    console.log('getPagedData ERROR ' + error);
                });
    }
}
