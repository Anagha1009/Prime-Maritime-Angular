import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { ContainerComponent } from './container/container.component';
import { ContainerSizeComponent } from './container-size/container-size.component';
import { ContainerTypeComponent } from './container-type/container-type.component';
import { CurrencyComponent } from './currency/currency.component';
import { LinerComponent } from './liner/liner.component';
import { LinerServiceComponent } from './liner-service/liner-service.component';
import { PartyComponent } from './party/party.component';
import { PortComponent } from './port/port.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { UnitComponent } from './unit/unit.component';
import { VesselComponent } from './vessel/vessel.component';
import { VoyageComponent } from './voyage/voyage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { LocationComponent } from './location/location.component';
import { UserComponent } from './user/user.component';
import { SlotOperatorComponent } from './slot-operator/slot-operator.component';
import { FreightComponent } from './freight/freight.component';
import { TariffComponent } from './tariff/tariff.component';

@NgModule({
    declarations: [
        ContainerComponent,
        ContainerSizeComponent,
        ContainerTypeComponent,
        CurrencyComponent,
        LinerComponent,
        LinerServiceComponent,
        PartyComponent,
        PortComponent,
        ScheduleComponent,
        ServicetypeComponent,
        UnitComponent,
        VesselComponent,
        VoyageComponent,
        LocationComponent,
        UserComponent,
        SlotOperatorComponent,
        FreightComponent,
        TariffComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgMultiSelectDropDownModule,
        HttpClientModule,
        TranslateModule,
        DataTablesModule,
        MasterRoutingModule,
    ]
})
export class MasterModule { }
